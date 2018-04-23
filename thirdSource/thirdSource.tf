############################################################
# Inialization
module "variables" {
    # source = "../Terraform/variables"
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/variables"
}

provider "aws" {
    region     = "${module.variables.region}"
    
}

variable "stage_name" {
    default = "uat"
}

##########
# s3 to store code
module "mdecorte-codebucket" {
    # source = "../Terraform/s3"
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/s3"

    bucket = "mdecorte-codebucket"
    acl    = "private"
    force_destroy = true
}    

# install api gateway
module "apiGateway" {
    source = "../Terraform/apiGateway/api"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/apiGateway/api"

    api_name 			= "thirdSource"
}

############################################################
# create the resource and methods
module "party" {
    source = "party"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/lambda/basic"

    api_id 			    = "${module.apiGateway.api_id}"
    resource_id     	= "${module.apiGateway.root_resource_id}"
    stage_name 			= "${var.stage_name}"
    s3_bucket           = "${module.mdecorte-codebucket.id}"
}


module "apiDeploy" {
    source = "../Terraform/apiGateway/deployment"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/apiGateway/deployment"

    dependsOn 		= "${module.party.dependencyId}"

    api_id			= "${module.apiGateway.api_id}"
    stage_name 		= "${var.stage_name}"
}

#####
# create a JS file with the URL for the stage
module "uriTemplate" {
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/files"
    # source = "../Terraform/files"

    input = "party/templates/putParty-service.uri.js"
    output = "party/test/putParty-service.uri.js"
    variables = {
        uri = "${module.apiDeploy.deployment_url}${module.party.subPath}"
    }
}    

output "url" {
    value = "${module.apiDeploy.deployment_url}${module.party.subPath}"
}

