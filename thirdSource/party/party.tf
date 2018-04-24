############################################################
# Inialization
module "variables" {
    # source = "../../Terraform/variables"
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/variables"
}

variable "api_id" {
    type = "string"
}

variable "resource_id" {
    type = "string"
}

variable "stage_name" {
    type = "string"
}

variable "s3_bucket" {
    type = "string"
}

variable "version" {
    default = "0.0.1"
}

#####
module "partyResource" {
    source = "../../Terraform/apiGateway/resource"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/apiGateway/resource"

    api_id 			= "${var.api_id}"
    resource_id     = "${var.resource_id}"
    path_part		= "party"
}

#####
# define the lambda function
module "party" {
    source = "../../Terraform/lambda/basic"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/lambda/basic"

    filename		    = "${path.module}/party-${var.version}.zip"
    s3_bucket           = "${var.s3_bucket}"
    function_name		= "party"
    handler			    = "src/party.handler"
}

#####
# attach the lambda function to an api method
module "putPartyMethod" {
    source = "../../Terraform/apiGateway/method"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/apiGateway/method"

    api_id 			= "${var.api_id}"
    resource_id     = "${module.partyResource.resource_id}"
    function_uri	= "${module.party.invoke_arn}"    
}

#####
# permissions for the method
module "putPartyPrep" {
    source = "../../Terraform/apiGateway/lambdaPrep"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/apiGateway/lambdaPrep"

    function_name	= "${module.party.function_name}"    
}


############################################################
# the api gateway url

# the resource url
output "subPath" {
    value = "${module.partyResource.subPath}"
}


############################################################
# hack for lack of depends_on
variable "dependsOn" {
    default = ""
}

resource "null_resource" "dependsOn" {

    triggers = {
        value = "${module.putPartyMethod.dependencyId}"
    }
}

output "dependencyId" {
    # value = "${module.partyResource.subPath}"
    value 	= "${var.dependsOn}:${null_resource.dependsOn.id}"
}