############################################################
module "variables" {
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/variables"
    # source = "../Terraform/variables"
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

module "LambdaRole" {
     source = "../Terraform/lambda/role"
}

############################################################
# samTemplate.yaml, update with role

module "samTemplate" {
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/files"
    # source = "../Terraform/files"

    input = "templates/samTemplate.yaml"
    output = "samTemplate.yaml"
    variables = {
        role = "${module.LambdaRole.arn}"
    }
}    


############################################################
# samTemplate.yaml, update with role

module "buildspec" {
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/files"
    # source = "../Terraform/files"

    input = "templates/buildspec.yml"
    output = "buildspec.yml"
    variables = {
        s3bucket = "${module.mdecorte-codebucket.id}"
        role = "${module.LambdaRole.arn}"
    }
}    
        