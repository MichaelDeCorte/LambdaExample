# 

# include "global" variables
module "variables" {
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/variables"
}

variable "tags" {
	 type = "map"
	 default = { }
}



############################################################
resource "aws_iam_role" "lambda_role" {
  name = "lambda_role"
  force_detach_policies = true
  assume_role_policy = "${file("${path.module}/LambdaRole.json")}"
}

output "arn" {
       value = "${aws_iam_role.lambda_role.arn}"
}

output "roleName" {
       value = "${aws_iam_role.lambda_role.name}"
}

