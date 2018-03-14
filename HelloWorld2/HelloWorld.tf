############################################################
module "variables" {
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/variables"
}

provider "aws" {
    region     = "${module.variables.region}"
}

module "HelloWorld" {
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/codebuild"
    source = "../Terraform/codebuild"

    name = "HelloWorld"
    description = "HelloWorld Lambda project"
    location = "https://github.com/MichaelDeCorte/LambdaExample.git"
    buildspec = "HelloWorld2/buildspec.yml"
}

module "mdecorte-codebucket" {
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/s3"
    # source = "../Terraform/s3"

    bucket = "mdecorte-codebucket"
    acl    = "private"
    force_destroy = true
}    

module "LambdaRole" {
     source = "../Terraform/lambda/role"
}

# module "LambdaExample" {
#     source = "../Terraform/lambda/basic"
#     # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/lambda/basic-zip"

# 	filename		    = "HelloWorld.zip"
# 	function_name		= "HelloWorld"
# 	handler			    = "main.handler"
# }
