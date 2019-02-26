############################################################
# input variables
variable "globals" {
    type = "map"
}

variable "tags" {
    type = "map"
    default = { }
}

variable "zone_id" {
    type = "string"
}

variable "name" {
    type = "string"
}

variable "subject_alternative_names" {
    type = "list"
    default = []
}

locals {
    awsProfile 				= "${var.globals["awsProfile"]}"
}

##############################
# Accepter's credentials.

# certificates need us-east-1
provider "aws" {
    alias = "east1"
    region = "us-east-1"
    profile = "${local.awsProfile["profile"]}"
}

data "aws_caller_identity" "east1" {
  provider = "aws.east1"
}


resource "aws_acm_certificate" "cert" {
    provider		  = "aws.east1"
    validation_method = "DNS"

    domain_name       = "${var.name}"
    subject_alternative_names = [ "${var.subject_alternative_names}" ]

    tags = "${merge(var.tags, var.globals["tags"])}"

    lifecycle {
        create_before_destroy = true
    }
}

resource "aws_route53_record" "certificate_record" {
    zone_id = "${var.zone_id}"
    name    = "${aws_acm_certificate.cert.domain_validation_options.0.resource_record_name}"
    type    = "${aws_acm_certificate.cert.domain_validation_options.0.resource_record_type}"
    ttl     = "300"
    records = [ "${aws_acm_certificate.cert.domain_validation_options.0.resource_record_value}" ]
}

output "acm_certificate_arn" {

    value 		= "${aws_acm_certificate.cert.arn}"
}
