############################################################
# Inialization
module "globals" {
    source = "../config.terraform/globals"
}

locals {
    region = "${module.globals.globals["region"]}"
    awsProfile = "${module.globals.globals["awsProfile"]}"
    globals = "${merge(module.globals.globals, module.globals.secrets)}"
    cloudtrail = "thirdsource-cloudtrail"
}

provider "aws" {
    region  = "${local.region["region"]}"
    shared_credentials_file = "${local.awsProfile["shared_credentials_file"]}"
    profile = "${local.awsProfile["profile"]}"
    # profile = "mdecorte"
}

terraform {
    backend "s3" {
        encrypt 	= false
        bucket 		= "thirdsource-terraform"
        key 		= "shared"
        region  	= "us-east-1"
    }
}

module "terraform" {
    source 		= "git@github.com:MichaelDeCorte/TerraForm.git//s3/s3"

    globals 	= "${module.globals.globals}"

    bucket 		= "thirdsource-terraform"
    tags		= "${map("Module", "Common")}"
    acl    		= "private"
    versioning 	= true
}

module "cloudtrail_bucket" {
    # source 		= "../../../Terraform/s3/s3"
    source 		= "git@github.com:MichaelDeCorte/TerraForm.git//s3/s3"

    globals 	= "${module.globals.globals}"

    bucket 		= "${local.cloudtrail}"
    tags		= "${map("Module", "Common")}"
    acl    		= "private"
}

module "cloudtrail_policy" {
    source 		= "../../../Terraform/cloudtrail/policy"

    globals 	= "${module.globals.globals}"

    name 		= "${local.cloudtrail}-policy"
    bucket_name	= "${module.cloudtrail_bucket.name}"
}

module "cloudtrail_trail" {
    # source 		= "../../../Terraform/cloudtrail"
    source 		= "git@github.com:MichaelDeCorte/TerraForm.git//cloudtrail"

    globals 	= "${module.globals.globals}"

    name 		= "${local.cloudtrail}"
    bucket 		= "thirdsource-cloudtrail"
}


##########
# s3 to store code
module "codebucket" {
    source 		= "git@github.com:MichaelDeCorte/TerraForm.git//s3/s3"

    globals 	= "${local.globals}"

    bucket 		= "thirdsource-codebucket"
    tags		= "${map("Module", "Common")}"
    acl    		= "private"
    force_destroy = true
}    

output "codebucket_id" {
    value = "${module.codebucket.id}"
}

output "cloudtrail_id" {
    value = "${module.cloudtrail_trail.id}"
}
