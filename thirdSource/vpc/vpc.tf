############################################################
# input variables
variable "globals" {
    type = "map"
}

variable "tags" {
    type = "map"
    default = { }
}

variable "common" {
    type = "map"
    default = { }
}

variable "name" {
    type = "string"
}

locals {
    region 				= "${var.globals["region"]}"
    awsProfile 				= "${var.globals["awsProfile"]}"

    vpc_cidr		= "${local.region["vpc_cidr"]}"
    public_a_cidr	= "${local.region["public_a_cidr"]}"
    private_a_cidr	= "${local.region["private_a_cidr"]}"
}

##############################
module "vpc" {
    source 		= "git@github.com:MichaelDeCorte/TerraForm.git//vpc"
#    source 		= "../../../../../Terraform/vpc"
    globals		= "${var.globals}"
    tags		= "${var.tags}"
    

    name 					= "${var.name}"
    vpc_cidr 				= "${local.vpc_cidr}"
    default_subnet_cidr		= "${local.public_a_cidr}"

    ingress_network_acls = [    
        {
            # inbound ssh
            protocol       = "tcp"
            rule_no    = 22
            action    = "allow"
            # MRD.  this should be locked down to a VPN block
            cidr_block = "0.0.0.0/0"
            from_port      = 22
            to_port        = 22
        },
        {
            # inbound http
            protocol       = "tcp"
            rule_no    = 80
            action    = "allow"
            cidr_block = "0.0.0.0/0"
            from_port      = 80
            to_port        = 80
        },
        {
            # inbound https
            protocol       = "tcp"
            rule_no    = 443
            action    = "allow"
            cidr_block = "0.0.0.0/0"
            from_port      = 443
            to_port        = 443
        },
        {
            # Inbound traffic from private net
            protocol       = "tcp"
            rule_no    = 1000
            action    = "allow"
            cidr_block 	   = "${local.private_a_cidr}"
            from_port      = 0
            to_port        = 65535
        },
        {
            # Inbound Return traffic via ephemeral ports
            protocol       = "tcp"
            rule_no    = 2000
            action    = "allow"
            cidr_block     = "0.0.0.0/0"
            from_port      = 1024
            to_port        = 65535
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
            # http
            protocol       	= "tcp"
            rule_no    		= 80
            action    		= "allow"
            from_port      	= 80
            to_port        	= 80
            cidr_block     	= "0.0.0.0/0"
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
            # ephemera
            protocol       	= "tcp"
            rule_no    		= 2000
            action    		= "allow"
            from_port      	= 1024
            to_port        	= 65535
            cidr_block     	= "0.0.0.0/0"
        }
    ]
}


module "private_subnet" {
    source 		= "git@github.com:MichaelDeCorte/TerraForm.git//vpc/subnet"
#    source 		= "../../../../../Terraform/vpc/subnet"

    globals			= "${var.globals}"
    
    vpc_id 			= "${module.vpc.vpc_id}"
    nat_gateway_id	= "${module.vpc.nat_gateway_id}"
    name 			= "/ ${local.region["env"]} A / Private"
    cidr_block 		= "${local.private_a_cidr}"
    egress_network_acls = [
        # outbound traffic
        {
            # http from public subnet
            protocol       	= "tcp"
            rule_number    	= 80
            rule_action    	= "allow"
            from_port      	= 80
            to_port        	= 80
            cidr_block     	= "0.0.0.0/0"
        },
        {
            # https from public subnet
            protocol       	= "tcp"
            rule_number    	= 443
            rule_action    	= "allow"
            from_port      	= 443
            to_port        	= 443
            cidr_block     = "0.0.0.0/0"
        },
        {
            # return to  public subnet
            protocol       	= "tcp"
            rule_number    	= 2000
            rule_action    	= "allow"
            from_port      	= 1024
            to_port        	= 65535
            cidr_block 		= "${local.public_a_cidr}"
        }
    ]

    ingress_network_acls = [
        # inbound traffic

        {
            # Inbound ssh from public subnet
            protocol       = "tcp"
            rule_number    = 22
            rule_action    = "allow"
            from_port      = 22
            to_port        = 22
            cidr_block     = "${local.public_a_cidr}"
        },
        {
            # Inbound Return traffic from NAT
            protocol       = "tcp"
            rule_number    = 2000
            rule_action    = "allow"
            from_port      = 1024
            to_port        = 65535
            cidr_block     = "0.0.0.0/0"
        }
    ]
}

##############################
##############################
##############################
output "vpc_id" {
    value = "${module.vpc.vpc_id}"
}

output "subnet_public_a_id" {
    value		= "${module.vpc.subnet_id}"
}

output "subnet_private_a_id" {
    value		= "${module.private_subnet.subnet_id}"
}

output "security_group_ids" {
    value 	= [
        "${module.vpc.security_group_ids}"
    ]
}
