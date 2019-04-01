############################################################
# Inialization
module "globals" {
    source = "config.terraform/globals"
}

module "common" {
    source = "config.terraform/common"
}

locals {
    region 		= "${module.globals.globals["region"]}"
    awsProfile 	= "${module.globals.globals["awsProfile"]}"
    dns			= "${module.globals.globals["dns"]}"
    globals 	= "${merge(module.globals.globals, module.globals.secrets)}"
    common 		= "${module.common.common}"
    stage_name  = "${local.region["env"]}"
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
    # source = "../../Terraform/cloudwatch/logGroup"
    source = "git@github.com:MichaelDeCorte/Terraform.git//cloudwatch/logGroup"

    globals 	= "${local.globals}"

    tags		= "${map("Module", "Common")}"

    name 		= "aes/domains/${local.region["env"]}_thirdSource/application-logs"
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

module "lambda_role" {
    # source = "../role"                                                                                                                     
    source = "git@github.com:MichaelDeCorte/Terraform.git//lambda/role"

    globals = "${local.globals}"
}

module "party" {
    source = "party"

    globals = "${local.globals}"

    api_authorizer_id	= "${module.apiGateway.authorizer_id}"
    api_id 			    = "${module.apiGateway.api_id}"
    api_execution_arn   = "${module.apiGateway.execution_arn}"
    api_parent_id  		= "${module.apiGateway.root_resource_id}"
    role_arn			= "${module.lambda_role.arn}"

    s3_bucket           = "${local.common["codebucket_id"]}"
}



############################################################
# deploy the party service on the api gateway
module "api_deploy" {
    # source = "../../Terraform/apiGateway/deployment"
    source = "git@github.com:MichaelDeCorte/TerraForm.git//apiGateway/deployment"

    depends 		= "${module.party.depends}"
    globals 		= "${local.globals}"

    api_id			= "${module.apiGateway.api_id}"
    stage_name 		= "${local.stage_name}-stage"
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
module "testConfig" {
    # source = "../../Terraform/files"
    source = "git@github.com:MichaelDeCorte/TerraForm.git//files"

    globals = "${local.globals}"

    input = "common.test/templates/testUser.json.template"

    output = [
        "common.test/src/testUser.${local.stage_name}.json"
    ]

    variables = {
        Username="testid.${random_string.test_id_username.result}@decorte.us"
        InitialPassword="${random_string.initial_password.result}"
        FinalPassword="${random_string.final_password.result}"
    }
}    

module "environmentConfig" {
    # source = "../../Terraform/files"
    source = "git@github.com:MichaelDeCorte/TerraForm.git//files"

    globals = "${local.globals}"

    input = "environment/templates/environment.json.template"

    output = [
        "environment/src/environment.${local.stage_name}.json",
        "website/src/assets/environment.${local.stage_name}.json"
    ]

    variables = {
        apiEndPoints = "${jsonencode(module.party.api_endpoints)}"
        apiInvokeUrl = "${jsonencode(module.api_deploy.invoke_url)}"
        cognitoUserPoolId = "${module.login.pool_id}"
        cognitoClientId = "${module.login.client_id}"
        loginUrl = "${module.login.url}"
        region="${local.region["region"]}"
    }
}    

module "testUser" {
    source = "login/users"

    depends 		= "${module.environmentConfig.depends}:${module.testConfig.depends}:${module.login.depends}"
    globals 		= "${local.globals}"
    testConfig 		= "${path.module}/${module.testConfig.output[0]}"
    environmentConfig = "${path.module}/${module.environmentConfig.output[0]}"
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
        "${module.api_deploy.invoke_url}"
    ]
}


##############################
output "region" {
    value = "${local.region}"
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

output "api_endpoints" {
    value =  "${module.party.api_endpoints}"
}

output "api_invoke_url" {
    value =  "${module.api_deploy.invoke_url}"
}
