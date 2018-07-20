# output "keys" {
#     value = {
#         access_key = ""
#         secret_key = ""
#     }
# }

# output "tags" {
#     value  	 =    {
#         AdminContact = "Michael DeCorte"
#         Description = "LambdaHelloWorld"
# 		Owner	 = "Michael DeCorte"
# 		Project	 = "RedRocks"
# 		Terraform = "true"
# 	}
# }

# output "variables" {
#     value  	 =    {
#         LOG_LEVEL = "debug"
# 	}
# }

# output "region" {
#     value    = "us-east-1"
#     description = "AWS region to launch servers."
# }

# output "id" {
#     # value = "AKIAJ7H5ZLIQEZS7C4EQ"
#     value = "mdecorte"
# }

# output "keypair" {
#     value    = "KPVirginia" #Virginia (us-east-1)
#     description = "Desired name of AWS key pair"
# }

# # aws ec2 describe-availability-zones
# output "availability_zone" {
#     value    = "us-east-1d"
# }

# output "env" {
#     value    = "test"
#     #value    = "prod"
#     #value    = "dev"
#     #value    = "demo"
#     description = "The name for the environment."
# }

# output "retention_in_days" {
#     value = "3"
# }

############################################################
output "globals" {
    
    value = {
        keys = {
            access_key = ""
            secret_key = ""
        },

        tags = {
            AdminContact = "Michael DeCorte"
            Description = "LambdaHelloWorld"
            Owner	 = "Michael DeCorte"
            Project	 = "RedRocks"
            Terraform = "true"
        },

        envVariables = {
            LOG_LEVEL = "debug"
        },

        region = {
            region = "us-east-1"
            availability_zone = "us-east-1d"
            environment = "dev" # "dev", "test", "demo", "prod"
        },

        awsProfile = {
            profile = "mdecorte"
        },

        keypair = {
            keyPair    = "KPVirginia" #Virginia (us-east-1)
        },

         cloudWatch = {
            retention_in_days = "3"
        }
    }
}
