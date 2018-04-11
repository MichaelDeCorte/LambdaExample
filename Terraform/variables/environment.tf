output "keys" {
       value = {
       	     access_key = ""
       	     secret_key = ""
       }
}

output "tags" {
       value  	 =    {
      		AdminContact = "Michael DeCorte"
	        Description = "LambdaHelloWorld"
		Owner	 = "Michael DeCorte"
		Project	 = "RedRocks"
		Terraform = "true"
        LOG_LEVEL = "trace"
	}
}

output "region" {
       value    = "us-east-1"
       description = "AWS region to launch servers."
}

output "id" {
    # value = "AKIAJ7H5ZLIQEZS7C4EQ"
    value = "mdecorte"
}

output "keypair" {
       value    = "KPVirginia" #Virginia (us-east-1)
       description = "Desired name of AWS key pair"
}

# aws ec2 describe-availability-zones
output "availability_zone" {
       value    = "us-east-1d"
}

output "env" {
       value    = "test"
       #value    = "prod"
       #value    = "dev"
       #value    = "demo"
       description = "The name for the environment."
}

# output "sslcert" {
#        #value    = "arn:aws:acm:us-east-1:yyy:certificate/xxx" #Virginia (us-east-1)
#        description = "The name for the environment."
# }

# output "subnets" {
#        #value    = ["subnet-yyy", "subnet-xxxx"] # Virginia (us-east-1)
#        description = "The name for the environment."
# }

# output "subnetid" {
#        #value    = "subnet-xxx" # Virginia (us-east-1)
#        description = "The name for the environment."
# }

# output "vpcid" {
#        #value = "vpc-xxx" #Virginia (us-east-1)
# }