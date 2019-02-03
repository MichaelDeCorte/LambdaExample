############################################################
# input variables
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

locals {
}

##############################
module "terraform_s3" {
    source = "git@github.com:MichaelDeCorte/TerraForm.git//s3/s3"
    # source = "./terraform/s3/website"

    globals             = "${var.globals}"

    bucket = "${var.name}"
    prevent_destroy = true
    versioning = true

}    

##############################
output "name" {
    value = "${var.name}"
}
