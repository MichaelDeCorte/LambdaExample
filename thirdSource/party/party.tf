############################################################
# input variables

locals {
    envVariables			= "${var.globals["envVariables"]}"
}


############################################################

#####
# define the lambda function
module "party_lambda" {
    # source = "../../../Terraform/lambda/api"
    source = "git@github.com:MichaelDeCorte/TerraForm.git//lambda/api"

    globals = "${var.globals}"

    publish				= true # versioning and aliases
    s3_bucket           = "${var.s3_bucket}"

    variables			= "${local.envVariables}"
    api_id 				= "${var.api_id}"
    api_execution_arn	= "${var.api_execution_arn}"
    api_parent_id     	= "${var.api_parent_id}"
    api_authorizer_id 	= "${var.api_authorizer_id}"
    role_arn			= "${var.role_arn}"
    
    functions 			= [
        {
            name				= "party"
            handler			    = "src/party.handler"
            filename		    = "${path.module}/party-${var.version}.zip"
        }
    ]
    
}


############################################################
# the api gateway url

output "qualifier" {
    value = [ "${module.party_lambda.qualifier}" ]
}

output "function_arn" {
    value = [ "${module.party_lambda.arn}" ]
}

output "api_endpoints" {
    value = "${module.party_lambda.api_endpoints}"
}

############################################################
# hack for lack of depends_on
variable "depends" {
    default = ""
}

output "depends" {
     value 	= "${var.depends}:${module.party_lambda.depends}"
}
