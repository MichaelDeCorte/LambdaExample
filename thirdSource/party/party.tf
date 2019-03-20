############################################################
# input variables

locals {
    envVariables			= "${var.globals["envVariables"]}"
}


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
# define the lambda function
module "partyLambda" {
    # source = "../../../Terraform/lambda/basic"
    source = "git@github.com:MichaelDeCorte/TerraForm.git//lambda/basic"

    globals = "${var.globals}"

    filename		    = "${path.module}/party-${var.version}.zip"
    s3_bucket           = "${var.s3_bucket}"
    function_name		= "party"
    publish				= true # versioning and aliases
    handler			    = "src/party.handler"
    variables			= "${local.envVariables}"
}

#####
module "partyResource" {
    # source = "../../../Terraform/apiGateway/resource"
    source = "git@github.com:MichaelDeCorte/TerraForm.git//apiGateway/resource"

    globals 		= "${var.globals}"

    api_id 			= "${var.api_id}"
    parent_id     	= "${var.parent_id}"
    path_part		= "party"
}

#####
# attach the lambda function to an api method
module "partyMethod" {
    # source = "../../../Terraform/apiGateway/method"
    source = "git@github.com:MichaelDeCorte/TerraForm.git//apiGateway/method"

    globals = "${var.globals}"

    api_id 			= "${var.api_id}"
    resource_id     = "${module.partyResource.id}"
    function_uri	= "${module.partyLambda.invoke_arn}"
    authorizer_id 	= "${var.authorizer_id}"
}


############################################################
# the api gateway url

# the resource url
output "subPath" {
    value = "${module.partyResource.subPath}"
}

output "qualifier" {
    value = "${module.partyLambda.qualifier}"
}

output "function_arn" {
    value = "${module.partyLambda.arn}"
}


############################################################
# hack for lack of depends_on
variable "dependsOn" {
    default = ""
}

resource "null_resource" "dependsOn" {

    depends_on = [
        "module.partyResource",
        "module.partyLambda",
        "module.partyMethod"
    ]
}

output "dependencyId" {
     value 	= "${var.dependsOn}:${module.partyMethod.dependencyId}:party/${null_resource.dependsOn.id}"
}
