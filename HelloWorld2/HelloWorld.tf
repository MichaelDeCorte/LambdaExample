############################################################
module "variables" {
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/variables"
}

provider "aws" {
    region     = "${module.variables.region}"
}

module "HelloWorld" {
    source = "../Terraform/codebuild"

    name = "HelloWorld"
    description = "HelloWorld Lambda project"
    location = "https://github.com/MichaelDeCorte/LambdaExample.git"
    buildspec = "HelloWorld2/buildspec.yml"

#    depends_on = ["aws_s3_bucket.mdecorte-codebucket"]
}

module "mdecorte-codebucket" {
    source = "../Terraform/s3"

    bucket = "mdecorte-codebucket"
    acl    = "private"
    force_destroy = true
}    



#module "LambdaExample" {
#    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/lambda/basic"
#    source = "../Terraform/lambda/basic"
#
#
#	# filename		    = "HelloWorld.zip"
#	function_name		= "HelloWorld"
#	handler			    = "main.handler"
#}

