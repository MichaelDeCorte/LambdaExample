############################################################
# Inialization
module "globals" {
    source = "config.terraform/globals"
}

module "common" {
    source = "config.terraform/common"
}

variable "stage_name" {
    default = "uat"
}

locals {
    region 		= "${module.globals.globals["region"]}"
    awsProfile 	= "${module.globals.globals["awsProfile"]}"
    dns			= "${module.globals.globals["dns"]}"
    globals 	= "${merge(module.globals.globals, module.globals.secrets)}"
    common 		= "${module.common.common}"
}

provider "aws" {
    region  				= "${local.region["region"]}"
    shared_credentials_file = "${local.awsProfile["shared_credentials_file"]}"
    profile 				= "${local.awsProfile["profile"]}"
}

terraform {
    backend "s3" {
        encrypt 	= false
        bucket 		= "thirdsource-terraform"
        key 		= "terraform"
        region  	= "us-east-1"
    }
}

##############################
module "vpc" {
    source 		= "./vpc/"
    globals 	= "${local.globals}"
    tags		= "${map("Module", "Common")}"

    common 		= "${local.common}"
    name 		= "thirdSource ${local.region["env"]}"
}



module "application_logs" {
    source		= "./cloudwatch"
    globals 	= "${local.globals}"
    tags		= "${map("Module", "Common")}"

    name 		= "/aws/aes/domains/${local.region["env"]}-thirdSource/application-logs"
}

module "apiGateway" {
    # source = "../../Terraform/apiGateway/api"
    source = "git@github.com:MichaelDeCorte/TerraForm.git//apiGateway/api"

    globals = "${local.globals}"

    api_name 			= "thirdSource"
    pool_id             = "${module.login.pool_id}"
}

############################################################
# create the resource and methods
module "party" {
    source = "party"

    globals = "${local.globals}"

    authorizer_id 	    = "${module.apiGateway.authorizer_id}"
    api_id 			    = "${module.apiGateway.api_id}"
    resource_id     	= "${module.apiGateway.root_resource_id}"
    stage_name 			= "${var.stage_name}"
    s3_bucket           = "${local.common["codebucket_id"]}"
}



############################################################
# deploy the party service on the api gateway
module "apiDeploy" {
    # source = "../Terraform/apiGateway/deployment"
    source = "git@github.com:MichaelDeCorte/TerraForm.git//apiGateway/deployment"

    globals = "${local.globals}"

    dependsOn 		= "${module.party.dependencyId}"

    api_id			= "${module.apiGateway.api_id}"
    stage_name 		= "${var.stage_name}"
}

#####
# create a JS file with the URL for the stage
module "uriTemplate" {
    # source = "../Terraform/files"
    source = "git@github.com:MichaelDeCorte/TerraForm.git//files"

    globals 		= "${local.globals}"

    input = "party/templates/party.uri.js"
    output = "party/test/party.${var.stage_name}.uri.js"
    variables = {
        uri = "${module.apiDeploy.deployment_url}${module.party.subPath}"
    }
}    

############################################################
module "login" {
    source = "login"

    globals = "${local.globals}"

    amazonClient = "${local.globals["thirdSourceAmazonClient"]}"
    domain = "thirdsource"

    callback_urls = [
        "http://localhost:4200/security/authenticate",
        "${module.website.website_url}/security/authenticate"
    ]

    logout_urls = [
        "http://localhost:4200/home",
        "${module.website.website_url}/home"
    ]
}


resource  "random_string" "initial_password" {
    length = 16
    special = true
}

resource "random_string" "final_password" {
    length = 16
    special = true
}

resource "random_string" "test_id_username" {
    length = 8
    upper = false
    special = false
    number = false
}

#####
# create a JS file with the URL for the stage
module "environmentTemplate" {
    # source = "../Terraform/files"
    source = "git@github.com:MichaelDeCorte/TerraForm.git//files"

    globals = "${local.globals}"

    input = "common.test/templates/environment.json.template"
    output = "common.test/src/environment.json"
    variables = {
        partyUri = "${module.apiDeploy.deployment_url}${module.party.subPath}"
        cognitoUserPoolId = "${module.login.pool_id}"
        cognitoClientId = "${module.login.client_id}"
        loginUrl = "${module.login.url}"
        Username="testid.${random_string.test_id_username.result}@decorte.us"
        InitialPassword="${random_string.initial_password.result}"
        FinalPassword="${random_string.final_password.result}"
        region="${local.region["region"]}"
    }
}    

module "testUser" {
    source = "login/users"

    dependsOn = "${module.environmentTemplate.dependencyId}:${module.login.dependencyId}"
    globals = "${local.globals}"
    environmentFile = "${module.environmentTemplate.output}"
}

module "website" {
    source 		= "./website/"
    globals 	= "${local.globals}"
    tags		= "${map("Module", "Website")}"

    name 		= "${local.region["env"]}.${local.dns["domain"]}"
    zone_id		= "${local.common["zone_id"]}"
    vpc_id 		= "${module.vpc.vpc_id}"
    acm_certificate_arn = "${local.common["acm_certificate_arn"]}"

    allowed_origins		= [
        "${module.apiDeploy.deployment_url}"
    ]
}


##############################
output "region" {
    value = "${local.region}"
}

output "api_url" {
    value = "${module.apiDeploy.deployment_url}${module.party.subPath}"
}


output "login_url" {
    value = "${module.login.url}"
}

output "website_url" {
    value = "${module.website.website_url}"
}

output "client_id" {
    value = "${module.login.client_id}"
}

output "regex" {
    value =    "${replace(module.apiDeploy.deployment_url, "/^(.*:\\/\\/[^/]*).*$/","$1")}"
}
