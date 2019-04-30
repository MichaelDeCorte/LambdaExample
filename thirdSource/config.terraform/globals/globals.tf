############################################################
locals {
    env = "${terraform.workspace}"

    # hack due to https://github.com/hashicorp/terraform/issues/14322
    aliases = {
        "default" = [ 
        ],
        "common" = [ 
        ],
        "dev" = [ 
        ],
        "proda" = [
        ]
    }
}


############################################################
output "globals" {
    
    value = {

        region = {
            
            env    = "${local.env}"
            
            region = "${lookup(map(
									"default", 		"default is an invalid workspace", 
									"common",		"us-east-1",
									"dev", 			"us-east-1"
						), local.env)}"


            availability_zone = "${lookup(map(
									"default", 		"default is an invalid workspace", 
									"common",		"us-east-1b",
									"dev", 			"us-east-1b"
                              ), local.env)}"

			vpc_cidr = "${lookup(map(
									"default", 		"default is an invalid workspace", 
									"common", 		"192.168.0.0/16",
									"dev", 			"192.170.0.0/16"
						), local.env)}"

            public_a_cidr = "${lookup(map(
									"default", 		"default is an invalid workspace", 
									"common", 		"192.168.1.0/24",
									"dev", 			"192.170.1.0/24"
						), local.env)}"

            private_a_cidr = "${lookup(map(
									"default", 		"default is an invalid workspace", 
									"common", 		"192.168.2.0/24",
									"dev", 			"192.170.2.0/24"
						), local.env)}"

        },

        keys = {
            access_key = ""
            secret_key = ""
        },

        awsProfile = {
            profile = "mdecorte"
            shared_credentials_file = "~/.aws/credentials_mdecorte"
        },

        tags = {
            AdminContact = "Michael DeCorte"
            Description = "LambdaHelloWorld"
            Owner	 = "Michael DeCorte"
            Project	 = "RedRocks"
            Terraform = "true"
            Environment = "${local.env}"
        },

        envVariables = {
            LOG_LEVEL = "debug"
            ENVIRONMENT = "${local.env}"
        },

        website_aliases = {
            aliases = "${local.aliases[local.env]}",
        },

        dns = {
            domain = "aws.decorte.us"
        },
        
        # dns = {
        #     zone_id = "Z6V3K0RZG3XJL"
        #     domain = "opinioneconomy.io"
        # },

        # keypair = {
        #     keyPair    = "KPVirginia" #Virginia (us-east-1)
        # },


        ssh_key = {
            # ssh key pair name
            key_name = "DeCorte"
            # location of the private key
            private_key = "~/.ssh/DeCorte.pem"
            # name of user on the remote system
            user = "ec2-user"
        },

        cloudWatch = {
            retention_in_days = "3"
        },

        chef = {
            server_url = "https://"
            user_name = "pivotal"
            user_key = "~/Documents/Development/Lambda/chef/.chef/private.pem"
            version = "14.5.33"
        }
        
    }
}
