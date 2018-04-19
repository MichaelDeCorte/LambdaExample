############################################################
module "variables" {
    # source = "../Terraform/variables"
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/variables"
}

##########
provider "aws" {
        region     = "${module.variables.region}"
}

##########
module "mdecorte-codebucket" {
    # source = "../Terraform/s3"
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/s3"

    bucket = "mdecorte-codebucket"
    acl    = "private"
    force_destroy = true
}    

##########
module "putParty" {
    source = "../Terraform/lambda/basic"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/lambda/basic"

	filename		    = ".serverless/putParty.zip"
    s3_bucket           = "${module.mdecorte-codebucket.id}"
	function_name		= "putParty"
	handler			    = "src/putParty.handler"
    variables           =
                        {
                            LOG_LEVEL = "silly"
                        }
}

##########
module "apiGateway" {
    source = "../Terraform/apiGateway/api"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/apiGateway/api"

    api_name = "party"
}

##########
module "partyResource" {
    source = "../Terraform/apiGateway/resource"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/apiGateway/resource"

    api_id 			= "${module.apiGateway.api_id}"
    resource_id     = "${module.apiGateway.root_resource_id}"
}

##########
module "partyMethod" {
    source = "../Terraform/apiGateway/method"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/apiGateway/method"

    stage_name 		= "uat"
    api_id 			= "${module.apiGateway.api_id}"
    resource_id     = "${module.partyResource.resource_id}"
    function_uri	= "${module.putParty.invoke_arn}"    
    function_name	= "${module.putParty.function_name}"    
}

############################################################
output "invoke_url" {
    value = "${module.partyMethod.invoke_url}"
}
        