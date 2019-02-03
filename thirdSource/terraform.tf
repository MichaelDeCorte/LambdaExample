############################################################
# Inialization
module "globals" {
    source = "config.terraform/globals"
}

module "shared" {
    source = "config.terraform/shared"
}

variable "stage_name" {
    default = "uat"
}

locals {
    region = "${module.globals.globals["region"]}"
    awsProfile = "${module.globals.globals["awsProfile"]}"
    globals = "${merge(module.globals.globals, module.globals.secrets)}"
    shared 				= "${module.shared.shared}"
}

provider "aws" {
    region  = "${local.region["region"]}"
    shared_credentials_file = "${local.awsProfile["shared_credentials_file"]}"
    profile = "${local.awsProfile["profile"]}"
}

terraform {
    backend "s3" {
        encrypt 	= false
        bucket 		= "thirdsource-terraform"
        key 		= "terraform"
        region  	= "us-east-1"
    }
}

# install api gateway
module "apiGateway" {
    source = "../../Terraform/apiGateway/api"
    # source = "git@github.com:MichaelDeCorte/TerraForm.git//apiGateway/api"

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
    s3_bucket           = "${local.shared["codebucket_id"]}"
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

############################################################
module "login" {
    source = "login"

    globals = "${local.globals}"

    amazonClient = "${local.globals["thirdSourceAmazonClient"]}"
    domain = "thirdsource"
    callback_url = "http://localhost:4200/security/authenticate"
    signout_url = "http://localhost:4200/security/login"
    
}

#####
# create a JS file with the URL for the stage
module "uriTemplate" {
    # source = "../Terraform/files"
    source = "git@github.com:MichaelDeCorte/TerraForm.git//files"

    globals = "${local.globals}"

    input = "party/templates/party.uri.js"
    output = "party/test/party.${var.stage_name}.uri.js"
    variables = {
        uri = "${module.apiDeploy.deployment_url}${module.party.subPath}"
    }
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

    input = "common_test/templates/environment.json.template"
    output = "common_test/src/environment.json"
    variables = {
        partyUri = "${module.apiDeploy.deployment_url}${module.party.subPath}"
        cognitoUserPoolId = "${module.login.pool_id}"
        cognitoClientId = "${module.login.client_id}"
        loginUrl = "${module.login.url}"
        testIdUsername="${random_string.test_id_username.result}"
        testIdInitialPassword="${random_string.initial_password.result}"
        testIdFinalPassword="${random_string.final_password.result}"
        region="${local.region["region"]}"
    }
}    

##############################
output "region" {
    value = "${local.region}"
}

output "url" {
    value = "${module.apiDeploy.deployment_url}${module.party.subPath}"
}

output "login_url" {
    value = "${module.login.url}"
}

output "client_id" {
    value = "${module.login.client_id}"
}
