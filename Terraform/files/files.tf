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
 
############################################################
# samTemplate.yaml, update with role

data "template_file" "template" {
  template = "${file("${var.input}")}"

  vars =
     "${var.variables}"
}

resource "null_resource" "export_samTemplate" {
    triggers = "${merge(var.variables, map("template", "${file("${var.input}")}"))}"

    provisioner "local-exec" {
        command = "cat > ${var.output}<<EOL\n${data.template_file.template.rendered}\nEOL"
    }
}
    