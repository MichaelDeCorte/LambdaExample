
data "terraform_remote_state" "common" {
    backend = "s3" 

    config {
        encrypt 	= false
        bucket 		= "thirdsource-terraform"
        # key must be a path into the bucket
        # https://github.com/hashicorp/terraform/issues/17707
        key 		= "env:/common/common"
        region  	= "us-east-1"
    }
}

output "common" {
    value = {
        codebucket_id 				= "${data.terraform_remote_state.common.codebucket_id}"
        cloudtrail_id 				= "${data.terraform_remote_state.common.cloudtrail_id}"
        zone_id						= "${data.terraform_remote_state.common.zone_id}"
        acm_certificate_arn			= "${data.terraform_remote_state.common.acm_certificate_arn}"
    }
}
