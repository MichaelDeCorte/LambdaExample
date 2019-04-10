############################################################
variable "globals" {
    type = "map"
}

variable "tags" {
    type = "map"
    default = { }
}

variable "name" {
    type = "string"
}

variable "zone_id" {
    type = "string"
}

variable "vpc_id" {
    type = "string"
    default = ""
}

variable "acm_certificate_arn" {
    type = "string"
}

variable "allowed_origins" {
    default = [ "*" ]
}

############################################################


locals {
    sourceDir 			= "${path.module}/dist/website/"
    toDir 				= "s3://${module.website_cloudfront.s3_id}"
    dns 				= "${var.globals["dns"]}"
    website_aliases 	= "${var.globals["website_aliases"]}"
}

# https://github.com/terraform-providers/terraform-provider-aws/pull/7639
module "website_copy" {
    source = "git@github.com:MichaelDeCorte/TerraForm.git//s3/copy_dir"
    # source = "../../../Terraform/s3/copy_dir/"

    globals = "${var.globals}"

    from = "${local.sourceDir}"
    to = "${local.toDir}"

    cwd = "${path.module}"
}

module "website_cloudfront" {
    source = "git@github.com:MichaelDeCorte/TerraForm.git//cloudfront"
    # source = "../../../Terraform/cloudfront"

    globals = "${var.globals}"

    bucket = "${var.name}"
    force_destroy = true
    index_document = "index.html"

    allowed_origins = "${var.allowed_origins}"

    origin_id 	= "${var.name}"
    aliases 	= [ "${var.name}", "${local.website_aliases["aliases"]}" ]
    
    
    acm_certificate_arn = "${var.acm_certificate_arn}"
    default_ttl = "30" # 30 seconds, mrd
}


resource "aws_route53_record" "dns" {
    zone_id = "${var.zone_id}"
    name    = "${var.name}"
    type    = "CNAME"
    ttl     = "300"
    records = [ "${module.website_cloudfront.domain_name}" ]
}

data "aws_vpc_endpoint_service" "s3" {
    service = "s3"
}

resource "aws_vpc_endpoint" "s3" {
    count = "${var.vpc_id == "" ? 0 : 1}"

    vpc_id       = "${var.vpc_id}"
    service_name = "${data.aws_vpc_endpoint_service.s3.service_name}"
}

##############################
output "s3_url" {
    value = "http://${module.website_cloudfront.website_endpoint}"
}

output "website_url" {
    value = "https://${aws_route53_record.dns.fqdn}"
}

output "hashfile" {
    value = "${module.website_copy.hashfile}"
}

