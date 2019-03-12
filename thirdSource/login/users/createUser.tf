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
variable "dependsOn" {
    default = ""
}

resource "null_resource" "dependsOutput" {

    triggers = {
        value = "${null_resource.createUser.id}"
    }
}

output "dependencyId" {
    # value = "${module.partyResource.subPath}"
    value 	= "${var.dependsOn}:${null_resource.dependsOutput.id}"
}

