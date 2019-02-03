############################################################
# Inialization

# module "party_api" {
#     source = "../../Terraform/lambda/api"
#     # source = "git@github.com:MichaelDeCorte/TerraForm.git//lambda/api"

#     globals = "${var.globals}"
    
#     api_id 				= "${var.api_id}"
#     resource_id     	= "${var.resource_id}"
#     function_name		= "party"
#     handler			    = "src/party.handler"
#     authorizer_id 		= "${var.authorizer_id}"
#     filename		    = "${path.module}/party-${var.version}.zip"    
# }

#####
module "partyResource" {
    # source = "../../Terraform/apiGateway/resource"
    source = "git@github.com:MichaelDeCorte/TerraForm.git//apiGateway/resource"

    globals = "${var.globals}"

    api_id 			= "${var.api_id}"
    resource_id     = "${var.resource_id}"
    path_part		= "party"
}

#####
# define the lambda function
module "party" {
    # source = "../../Terraform/lambda/basic"
    source = "git@github.com:MichaelDeCorte/TerraForm.git//lambda/basic"

    globals = "${var.globals}"

    filename		    = "${path.module}/party-${var.version}.zip"
    s3_bucket           = "${var.s3_bucket}"
    function_name		= "party"
    handler			    = "src/party.handler"
    variables			= {
        LOG_LEVEL = "trace"
    }
}

#####
# attach the lambda function to an api method
module "partyMethod" {
    source = "../../../Terraform/apiGateway/method"
    # source = "git@github.com:MichaelDeCorte/TerraForm.git//apiGateway/method"

    globals = "${var.globals}"

    api_id 			= "${var.api_id}"
    resource_id     = "${module.partyResource.resource_id}"
    function_uri	= "${module.party.invoke_arn}"
    authorizer_id 	= "${var.authorizer_id}"
}

#####
# permissions for the method
module "partyPrep" {
    # source = "../../Terraform/apiGateway/lambdaPrep"
    source = "git@github.com:MichaelDeCorte/TerraForm.git//apiGateway/lambdaPrep"

    globals = "${var.globals}"

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
        value = "${module.partyMethod.dependencyId}"
    }
}

output "dependencyId" {
    # value = "${module.partyResource.subPath}"
    value 	= "${var.dependsOn}:${null_resource.dependsOn.id}"
}
