# Instance/main.tf

# include "global" variables
module "variables" {
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/variables"
}

############################################################
# input variables
variable "input" {
    type = "string"
}

variable "output" {
    type = "string"
}

variable "variables" {
    type = "map"
}

variable "chmod" {
    default = "aog-w" 
}
 
############################################################
# samTemplate.yaml, update with role

data "template_file" "template" {
  template = "${file("${var.input}")}"

  vars =
     "${var.variables}"
}

resource "null_resource" "rmOutput" {
    triggers = "${merge(var.variables,
                        map("template", "${file("${var.input}")}")
                )}"

    provisioner "local-exec" {
        command = "rm -f ${var.output}"
    }
}
    
resource "null_resource" "createOutput" {
    triggers = "${merge(var.variables,
                        map("template", "${file("${var.input}")}")
                )}"

    provisioner "local-exec" {
        command = "cat > ${var.output}<<EOL\n${data.template_file.template.rendered}\nEOL"
    }
    depends_on = ["null_resource.rmOutput"]
}
    
resource "null_resource" "chmodOutput" {
    triggers = "${merge(var.variables,
                        map("template", "${file("${var.input}")}")
                )}"

    provisioner "local-exec" {
        command = "chmod ${var.chmod} ${var.output}"
    }
    depends_on = ["null_resource.createOutput"]
}
    