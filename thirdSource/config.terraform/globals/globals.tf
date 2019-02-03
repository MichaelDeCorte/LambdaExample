############################################################
locals {
    env = "${terraform.workspace}"

    # hack due to https://github.com/hashicorp/terraform/issues/14322
    aliases = {
        "default" = [ 
        ],
        "shared" = [ 
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

        keys = {
            access_key = ""
            secret_key = ""
        },

        region = {
            region = "us-east-1"
            availability_zone = "us-east-1d"
            environment = "dev" # "dev", "test", "demo", "prod"
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
        },

        # keypair = {
        #     keyPair    = "KPVirginia" #Virginia (us-east-1)
        # },

        region = {
            env    = "${local.env}"
            
            region = "${lookup(map(
									"default", 		"default is an invalid workspace", 
									"shared", 		"us-east-1", 
									"dev", 			"us-east-1", 
									"proda", 		"us-west-2",
						), local.env)}"


            availability_zone = "${lookup(map(
									"default", 		"default is an invalid workspace", 
									"shared", 		"us-east-1a", 
									"dev", 			"us-east-1b", 
									"proda", 		"us-west-2b",
                              ), local.env)}"

			vpc_cidr = "${lookup(map(
									"default", 		"default is an invalid workspace", 
									"shared",		"192.169.0.0/16", 
									"dev", 			"192.170.0.0/16", 
									"proda",		"192.171.0.0/16",
						), local.env)}"

            public_a_cidr = "${lookup(map(
									"default", 		"default is an invalid workspace", 
									"shared", 		"192.169.1.0/24", 
									"dev", 			"192.170.1.0/24", 
									"proda",		"192.171.1.0/24",
						), local.env)}"

            private_a_cidr = "${lookup(map(
									"default", 		"default is an invalid workspace", 
									"shared", 		"192.169.2.0/24", 
									"dev", 			"192.170.2.0/24", 
									"proda", 		"192.171.2.0/24",
						), local.env)}"

        },


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
