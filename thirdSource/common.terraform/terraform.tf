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
    aws_config 	= "thirdsource-config"
    s3_logging 	= "thirdsource-s3-logging"
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

##########
module "s3_logging" {
    # source 		= "../../../Terraform/s3/logging"
    source 		= "git@github.com:MichaelDeCorte/TerraForm.git//s3/logging"

    globals 	= "${module.globals.globals}"
    tags		= "${map("Module", "common")}"

    bucket 		= "${local.s3_logging}"
}

##############################
module "terraform" {
    # source 			= "../../../Terraform/s3/s3"
    source 		= "git@github.com:MichaelDeCorte/TerraForm.git//s3/s3"

    globals 		= "${module.globals.globals}"
    tags			= "${map("Module", "common")}"

    bucket 			= "thirdsource-terraform"
    acl    			= "private"
    versioning 		= true
    logging_bucket	= "${module.s3_logging.name}"
}


##########
module "cloudtrail_bucket" {
    # source 		= "../../../Terraform/s3/s3"
    source 		= "git@github.com:MichaelDeCorte/TerraForm.git//s3/s3"

    globals 	= "${module.globals.globals}"
    tags		= "${map("Module", "common")}"

    bucket 		= "${local.cloudtrail}"
    acl    		= "private"
    policy 		= "${module.cloudtrail_policy.policy}"
    logging_bucket	= "${module.s3_logging.name}"
} 

module "cloudtrail_policy" {
    # source 		= "../../../Terraform/cloudtrail/policy"
    source 		= "git@github.com:MichaelDeCorte/TerraForm.git//cloudtrail/policy"
    
    depends		= "${module.cloudtrail_bucket.depends}"
    globals 	= "${module.globals.globals}"

    bucket_name	= "${module.cloudtrail_bucket.name}"
}

module "cloudtrail_trail" {
    # source 		= "../../../Terraform/cloudtrail"
    source 		= "git@github.com:MichaelDeCorte/TerraForm.git//cloudtrail"

    depends		= "${module.cloudtrail_bucket.depends}:${module.cloudtrail_policy.depends}"
    globals 	= "${module.globals.globals}"

    name 		= "${local.cloudtrail}"
    bucket 		= "${module.cloudtrail_bucket.name}"
}

##########
module "aws_config" {
    source 		= "../../../Terraform/awsConfig"
    # source 		= "git@github.com:MichaelDeCorte/TerraForm.git//awsConfig"

    globals 	= "${module.globals.globals}"

    name 		= "${local.aws_config}"
    logging_bucket	= "${module.s3_logging.name}"
}

##########
# s3 to store code
module "codebucket" {
    # source 		= "../../../Terraform/s3/s3"
    source 		= "git@github.com:MichaelDeCorte/TerraForm.git//s3/s3"

    globals 	= "${local.globals}"
    tags		= "${map("Module", "common")}"

    bucket 		= "thirdsource-codebucket"
    acl    		= "private"
    force_destroy = true
    logging_bucket	= "${module.s3_logging.name}"
}    



# module "vpc" {
#     source 		= "./vpc/"
#     globals 	= "${module.globals.globals}"
#     tags		= "${map("Module", "common")}"
#     name 		= "thirdsource-common"
# }

# module "bastion" {
#     source 		= "./bastion/"
#     globals 	= "${module.globals.globals}"
#     tags		= "${map("Module", "common")}"

#     name 		= "thirdsource-bastion-common"


#     vpc_id 		= "${module.vpc.vpc_id}"

#     subnet_id 	= "${module.vpc.subnet_public_a_id}"
#     zone_id		= "${module.dns.zone_id}"
# }

module "dns" {
    source 		= "./dns"
    globals 	= "${module.globals.globals}"
    tags		= "${map("Module", "common")}"

    name 		= "${local.dns["domain"]}"
}

module "certificate" {
    source 						= "./certificate"
    globals 					= "${module.globals.globals}"
    tags						= "${map("Module", "common")}"

    zone_id						= "${module.dns.zone_id}"
    name 						= "${local.dns["domain"]}"    
    subject_alternative_names 	= [ "*.${local.dns["domain"]}"    ]
}

# module "jenkins" {
#     source 		= "./jenkins/"
#     globals 	= "${module.globals.globals}"
#     tags		= "${map("Module", "common")}"

#     name 		= "Jenkins"

#     vpc_id 		= "${module.vpc.vpc_id}"

#     subnet_id 	= "${module.vpc.subnet_public_a_id}"

#     zone_id 	=  "${module.dns.zone_id}"

# }

##############################

output "codebucket_id" {
    value = "${module.codebucket.id}"
}

output "cloudtrail_id" {
    value = "${module.cloudtrail_trail.id}"
}

output "zone_id" {
    value 		= "${module.dns.zone_id}"
}

output "acm_certificate_arn" {
    value 		= "${module.certificate.acm_certificate_arn}"
}

output "s3_logging" {
    value 		= {
        "${local.region["region"]}" = "${module.s3_logging.name}"
    }
}
