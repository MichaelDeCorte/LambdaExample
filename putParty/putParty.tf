############################################################
module "variables" {
    # source = "../Terraform/variables"
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/variables"
}

provider "aws" {
        region     = "${module.variables.region}"
}


module "mdecorte-codebucket" {
    # source = "../Terraform/s3"
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/s3"

    bucket = "mdecorte-codebucket"
    acl    = "private"
    force_destroy = true
}    

module "putParty" {
    source = "../Terraform/lambda/basic"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/lambda/basic"

	filename		    = ".serverless/putParty.zip"
    s3_bucket           = "${module.mdecorte-codebucket.id}"
	function_name		= "putParty"
	handler			    = "src/putParty.handler"
}

