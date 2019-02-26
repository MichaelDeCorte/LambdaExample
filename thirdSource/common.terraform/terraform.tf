############################################################
# Inialization
module "globals" {
    source = "../config.terraform/globals"
}

locals {
    region 		= "${module.globals.globals["region"]}"
    awsProfile 	= "${module.globals.globals["awsProfile"]}"
    globals 	= "${merge(module.globals.globals, module.globals.secrets)}"
    cloudtrail 	= "thirdsource-cloudtrail"
    dns 		= "${module.globals.globals["dns"]}"
    name		= "thirdsource"
}

provider "aws" {
    region  = "${local.region["region"]}"
    profile = "${local.awsProfile["profile"]}"
    shared_credentials_file = "${local.awsProfile["shared_credentials_file"]}"

    # region  = "us-east-1"
    # profile = "mdecorte"
    # shared_credentials_file = "~/.aws/credentials_mdecorte"
}

terraform {
    backend "s3" {
        encrypt 	= false
        bucket 		= "thirdsource-terraform"
        key 		= "common"
        region  	= "us-east-1"
    }
}

##############################
module "terraform" {
    source 		= "git@github.com:MichaelDeCorte/TerraForm.git//s3/s3"

    globals 	= "${module.globals.globals}"

    bucket 		= "thirdsource-terraform"
    tags		= "${map("Module", "common")}"
    acl    		= "private"
    versioning 	= true
}

module "cloudtrail_bucket" {
    # source 		= "../../../Terraform/s3/s3"
    source 		= "git@github.com:MichaelDeCorte/TerraForm.git//s3/s3"

    globals 	= "${module.globals.globals}"

    bucket 		= "${local.cloudtrail}"
    tags		= "${map("Module", "common")}"
    acl    		= "private"
}

module "cloudtrail_policy" {
    source 		= "../../../Terraform/cloudtrail/policy"

    globals 	= "${module.globals.globals}"

    name 		= "${local.cloudtrail}-policy"
    bucket_name	= "${module.cloudtrail_bucket.name}"
}

module "cloudtrail_trail" {
    source 		= "../../../Terraform/cloudtrail"
    # source 		= "git@github.com:MichaelDeCorte/TerraForm.git//cloudtrail"

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
    tags		= "${map("Module", "common")}"
    acl    		= "private"
    force_destroy = true
}    



# module "vpc" {
#     source 		= "./vpc/"
#     globals 	= "${module.globals.globals}"
#     name 		= "thirdsource-common"
#     tags		= "${map("Module", "common")}"
# }

# module "bastion" {
#     source 		= "./bastion/"
#     globals 	= "${module.globals.globals}"

#     name 		= "thirdsource-bastion-common"

#     tags		= "${map("Module", "common")}"

#     vpc_id 		= "${module.vpc.vpc_id}"

#     subnet_id 	= "${module.vpc.subnet_public_a_id}"
#     zone_id		= "${module.dns.zone_id}"
# }

module "dns" {
    source 		= "./dns"
    globals 	= "${module.globals.globals}"

    name 		= "${local.dns["domain"]}"
    tags		= "${map("Module", "common")}"
}

module "certificate" {
    source 						= "./certificate"
    globals 					= "${module.globals.globals}"
    zone_id						= "${module.dns.zone_id}"
    name 						= "${local.dns["domain"]}"    
    subject_alternative_names 	= [ "*.${local.dns["domain"]}"    ]
    tags						= "${map("Module", "common")}"
}

# module "jenkins" {
#     source 		= "./jenkins/"
#     globals 	= "${module.globals.globals}"

#     name 		= "Jenkins"

#     vpc_id 		= "${module.vpc.vpc_id}"

#     subnet_id 	= "${module.vpc.subnet_public_a_id}"

#     zone_id 	=  "${module.dns.zone_id}"

#     tags		= "${map("Module", "common")}"
# }

##############################

output "codebucket_id" {
    value = "${module.codebucket.id}"
}

output "cloudtrail_id" {
    value = "${module.cloudtrail_trail.id}"
}
