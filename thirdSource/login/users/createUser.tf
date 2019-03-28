############################################################
#

variable "globals" {
    type = "map"
}

variable "tags" {
    type = "map"
    default = {}
}

variable "testConfig" {
    type = "string"
}

variable "environmentConfig" {
    type = "string"
}

##############################

locals {
    region = "${var.globals["region"]}"
}

resource "null_resource" "createUser" {

    provisioner "local-exec" {
        command = "sh ${path.module}/createUser.sh ${var.environmentConfig} ${var.testConfig}"
    }
}

############################################################
# hack for lack of depends_on
variable "depends" {
    default = ""
}

resource "null_resource" "dependsOutput" {
    triggers = {
        value = "${null_resource.createUser.id}"
    }
}

output "depends" {
    # value = "${module.partyResource.subPath}"
    value 	= "${var.depends}:${null_resource.dependsOutput.id}"
}

