############################################################
variable "globals" {
    type = "map"
}

############################################################

locals {
    siteName = "thirdSource"
    sourceDir = "dist/thirdSource/"
    toDir = "s3://${module.thirdSource-s3.id}"
}

##########
# static website
module "thirdSource-s3" {
    source = "git@github.com:MichaelDeCorte/TerraForm.git//s3/website"

    globals = "${var.globals}"

    bucket = "${local.siteName}"
    force_destroy = true
    index_document = "index.html"
}    

module "thirdSource-copy" {
    source = "git@github.com:MichaelDeCorte/TerraForm.git//s3/copy_dir"

    globals = "${var.globals}"

    from = "${local.sourceDir}"
    to = "${local.toDir}"
}

module "thirdSource-cloudfront" {
    source = "git@github.com:MichaelDeCorte/TerraForm.git//cloudfront"

    globals = "${var.globals}"

    domain_name = "${module.thirdSource-s3.bucket_regional_domain_name}"
    origin_id = "${local.name}"
}
