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

##########
locals {
    region 	= "${var.globals["region"]}"    

    vpc_cidr			= "${local.region["vpc_cidr"]}"
    public_a_cidr		= "${local.region["public_a_cidr"]}"
}

##########
module "vpc" {
#    source 					= "../../../../Terraform/vpc"
     source 				= "git@github.com:MichaelDeCorte/TerraForm.git//vpc"
    globals					= "${var.globals}"
    tags					= "${var.tags}"

    name 					= "${var.name}"
    vpc_cidr 				= "${local.vpc_cidr}"
    default_subnet_cidr		= "${local.public_a_cidr}"
    nat						= "false"
    igw						= "false"

    ingress_network_acls = [    
        {
            # inbound ssh
            protocol       	= "tcp"
            rule_no    		= 22
            action    		= "allow"
            # MRD.  this should be locked down to a VPN block
            cidr_block 		= "0.0.0.0/0"
            from_port      	= 22
            to_port        	= 22
        },
        {
            # inbound https
            protocol       	= "tcp"
            rule_no    		= 443
            action    		= "allow"
            cidr_block 		= "0.0.0.0/0"
            from_port      	= 443
            to_port        	= 443
        },
        # {
        #     # inbound jenkins
        #     protocol       	= "tcp"
        #     rule_no    		= 8080
        #     action    		= "allow"
        #     cidr_block 		= "0.0.0.0/0"
        #     from_port      	= 8080
        #     to_port        	= 8080
        # },
        {
            # Inbound Return traffic via ephemeral ports
            protocol       	= "tcp"
            rule_no    		= 2000
            action    		= "allow"
            cidr_block     	= "0.0.0.0/0"
            from_port      	= 1024
            to_port        	= 65535
        }
    ]

    egress_network_acls = [
        # Outbound Traffic
        {
            # ssh
            protocol       	= "tcp"
            rule_no    		= 22
            action    		= "allow"
            from_port      	= 22
            to_port        	= 22
            cidr_block 		= "0.0.0.0/0"
        },
        {
            # https
            protocol       	= "tcp"
            rule_no    		= 443
            action    		= "allow"
            from_port      	= 443
            to_port        	= 443
            cidr_block     	= "0.0.0.0/0"
        },
        {
            # ephemeral
            protocol       	= "tcp"
            rule_no    		= 2000
            action    		= "allow"
            from_port      	= 1024
            to_port        	= 65535
            cidr_block     	= "0.0.0.0/0"
        }
    ]
}

##############################

output "vpc_id" {
    value = "${module.vpc.vpc_id}"
}

output "vpc_arn" {
    value     	= "${module.vpc.vpc_arn}"
}

output "vpc_cidr" {
    value     	= "${module.vpc.vpc_cidr}"
}

output "subnet_public_a_cidr" {
    value		= "${module.vpc.default_subnet_cidr}"
}

output "subnet_public_a_id" {
    value		= "${module.vpc.subnet_id}"
}

output "subnet_public_a_arn" {
	value		= "${module.vpc.subnet_arn}"
}

output "network_acl_public_id" {
    value		= "${module.vpc.network_acl_id}"
}

output "route_table_id" {
    value = "${module.vpc.route_table_id}"
}
