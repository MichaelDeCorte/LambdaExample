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

variable "tags" {
	 type = "map"
	 default = { }
}


############################################################
module "LambdaRole" {
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/lambda/role"
    source = "../role"
}


# https://www.terraform.io/docs/providers/aws/r/lambda_function.html
resource "aws_lambda_function" "aws_lambda" {
    source_code_hash    = "${base64sha256(file("${var.filename}"))}"
    filename              = "${var.filename}"
    # s3_bucket             = "mdecorte-codebucket"
    # s3_key                = "9e7ddb249e5ae71e28a77cce43bf9791"
    function_name       = "${var.function_name}"

    publish	            = "${var.publish}"
    handler	            = "${var.handler}"

    tags		        = "${merge(var.tags, module.variables.tags)}"
    role                = "${module.LambdaRole.arn}"
    runtime             = "${var.runtime}"

    tags                = "${merge(var.tags, module.variables.tags)}"
}