# Instance/main.tf

# include "global" variables
module "variables" {
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/variables"
}


############################################################
# input variables
variable "region" {
	 default = "$${module.variables.region}"
}

variable "description" {
	default=""
}

variable "tags" {
	 type = "map"
	 default = { }
}

variable "function_name" {
	 type = "string"
}

variable "filename" {
    type = "string"
}

variable "handler" {
	 type = "string"
}

variable "runtime" {
	 default = "nodejs6.10"
}

# turn on versioning of lambda function
variable "publish" {
	 default = "false"
}


############################################################
resource "aws_iam_role" "lambda_role" {
  name = "lambda_role"
  force_detach_policies = true
  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "Service": "lambda.amazonaws.com"
            },
            "Action": [
                "sts:AssumeRole"
            ]
        }
    ]
}
EOF
}
variable "tags" {
	 type = "map"
	 default = { }
}


# https://www.terraform.io/docs/providers/aws/r/lambda_function.html
resource "aws_lambda_function" "aws_lambda" {
    filename            = "${var.filename}"
    source_code_hash    = "${base64sha256(file("${var.filename}"))}"
    function_name       = "${var.function_name}"

    publish	            = "${var.publish}"
    handler	            = "${var.handler}"

    tags		        = "${merge(var.tags, module.variables.tags)}"
    role                = "${aws_iam_role.lambda_role.arn}"
    runtime             = "${var.runtime}"

    tags                = "${merge(var.tags, module.variables.tags)}"
}