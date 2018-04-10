############################################################
module "variables" {
    # source = "../Terraform/variables"
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/variables"
}

provider "aws" {
        region     = "${module.variables.region}"
}


module "mdecorte-codebucket" {
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/s3"
    # source = "../Terraform/s3"

    bucket = "mdecorte-codebucket"
    acl    = "private"
    force_destroy = true
}    

module "LambdaExample" {
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/lambda/basic"
    # source = "../Terraform/lambda/basic"

	filename		    = "HelloWorld.zip"
	function_name		= "HelloWorld"
	handler			    = "src/main.handler"
}

