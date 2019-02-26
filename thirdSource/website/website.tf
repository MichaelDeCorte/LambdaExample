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
}

variable "acm_certificate_arn" {
    type = "string"
}

############################################################

locals {
    sourceDir = "dist/website/"
    toDir = "s3://${module.website_s3.id}"
#    dns 	= "${var.globals["dns"]}"
    website_aliases = "${var.globals["website_aliases"]}"
}

##########
# static website
module "website_s3" {
    source = "git@github.com:MichaelDeCorte/TerraForm.git//s3/website"
    # source = "../../../Terraform/s3/website/"

    globals = "${var.globals}"

    bucket = "${var.name}"
    force_destroy = true
    index_document = "index.html"
}    

module "website_copy" {
    source = "git@github.com:MichaelDeCorte/TerraForm.git//s3/copy_dir"
    # source = "../../../Terraform/s3/copy_dir/"

    globals = "${var.globals}"

    from = "${local.sourceDir}"
    to = "${local.toDir}"
}

module "website_cloudfront" {
    source = "git@github.com:MichaelDeCorte/TerraForm.git//cloudfront"

    globals = "${var.globals}"

    domain_name = "${module.website_s3.bucket_regional_domain_name}"
    origin_id 	= "${var.name}"
    aliases 	= [ "${var.name}", "${local.website_aliases["aliases"]}" ]
    
    
    acm_certificate_arn = "${var.acm_certificate_arn}"
    default_ttl = "360"
}


# resource "aws_route53_record" "dns" {
#     zone_id = "${var.zone_id}"
#     name    = "${var.name}"
#     type    = "CNAME"
#     ttl     = "300"
#     records = [ "${module.website_cloudfront.domain_name}" ]
# }

data "aws_vpc_endpoint_service" "s3" {
    service = "s3"
}

resource "aws_vpc_endpoint" "s3" {
    vpc_id       = "${var.vpc_id}"
    service_name = "${data.aws_vpc_endpoint_service.s3.service_name}"
}

##############################
output "aws_url" {
    value = "${module.website_s3.website_endpoint}"
}

output "url" {
    value = "${var.name}"
}


