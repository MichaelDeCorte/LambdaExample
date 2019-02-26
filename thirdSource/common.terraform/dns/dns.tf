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

##############################
resource "aws_route53_zone" "dns" {
    name	= "${var.name}"
    tags	= "${var.globals["tags"]}"
}

##############################
output "zone_id" {
    value 	= "${aws_route53_zone.dns.zone_id}"
}

output "domain" {
    value 	= "${var.name}"
}

