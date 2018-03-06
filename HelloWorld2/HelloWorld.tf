############################################################
module "variables" {
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/variables"
}

provider "aws" {
    region     = "${module.variables.region}"
}

module "HelloWorld" {
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/codebuild"
    # source = "../Terraform/codebuild"

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




