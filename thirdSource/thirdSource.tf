############################################################
# Inialization
module "globals" {
    source = "Terraform/globals"
}

variable "stage_name" {
    default = "uat"
}

locals {
    globals = "${merge(module.globals.globals, module.globals.secrets)}"
    region = "${module.globals.globals["region"]}"
    awsProfile = "${module.globals.globals["awsProfile"]}"
}

provider "aws" {
    region  = "${local.region["region"]}"
    profile = "${local.awsProfile["profile"]}"
}

##########
# s3 to store code
module "mdecorte-codebucket" {
    # source = "../Terraform/s3"
    source = "git@github.com:MichaelDeCorte/TerraForm.git//s3/s3"

    globals = "${local.globals}"

    bucket = "mdecorte-codebucket"
    acl    = "private"
    force_destroy = true
}    

# install api gateway
module "apiGateway" {
    # source = "../Terraform/apiGateway/api"
    source = "git@github.com:MichaelDeCorte/TerraForm.git//apiGateway/api"

    globals = "${local.globals}"

    api_name 			= "thirdSource"
}

############################################################
# create the resource and methods
module "party" {
    source = "party"

    globals = "${local.globals}"

    api_id 			    = "${module.apiGateway.api_id}"
    resource_id     	= "${module.apiGateway.root_resource_id}"
    stage_name 			= "${var.stage_name}"
    s3_bucket           = "${module.mdecorte-codebucket.id}"
}


module "apiDeploy" {
    # source = "../Terraform/apiGateway/deployment"
    source = "git@github.com:MichaelDeCorte/TerraForm.git//apiGateway/deployment"

    globals = "${local.globals}"

    dependsOn 		= "${module.party.dependencyId}"

    api_id			= "${module.apiGateway.api_id}"
    stage_name 		= "${var.stage_name}"
}

module "login" {
    source = "login"

    globals = "${local.globals}"

    amazonClient = "${local.globals["thirdSourceAmazonClient"]}"
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

output "url" {
    value = "${module.apiDeploy.deployment_url}${module.party.subPath}"
}

output "loginUrl" {
    value = "${module.login.url}"
}




