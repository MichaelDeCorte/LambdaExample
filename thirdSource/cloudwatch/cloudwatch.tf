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
    region 						= "${var.globals["region"]}"
}


##############################
resource "aws_cloudwatch_log_group" "logs" {
    name					= "${var.name}"

    tags 					= "${merge(	var.tags, 
										map("Service", "logs.log-group"),
										var.globals["tags"])}"

}


output "arn" {
    value = "${aws_cloudwatch_log_group.logs.arn}"
}
