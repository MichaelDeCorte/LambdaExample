############################################################
module "variables" {
    # source = "../Terraform/variables"
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/variables"
}

provider "aws" {
        region     = "${module.variables.region}"
}


module "LambdaExample" {
    # source = "../Terraform/lambda/basic"
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/lambda/basic"

	filename		    = "HelloWorld.zip"
	function_name		= "HelloWorld"
	handler			    = "main.handler"
}

