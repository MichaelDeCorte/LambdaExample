# partyTable.tf
    
locals {
    region = "${var.globals["region"]}"
}

module "party_table" {   
    source = "git@github.com:MichaelDeCorte/TerraForm.git//dynamo"
    # source 					= "../../../Terraform/dynamo"

    globals 					= "${var.globals}"
    tags 						= "${var.tags}"
    billing_mode				= "PAY_PER_REQUEST"
    table_name_prefix			= "${local.region["env"]}_"

    name           = "party"
    hash_key       = "partyID"		# Primary partition key	

    attributes = [
        {
            name = "partyID"
            type = "N"
        },
    ]

    # global_secondary_indexes  = [
        # {
        #     name               = ""
        #     hash_key           = ""		# Primary partition key	
        #     range_key          = ""		# Primary sort key	
        #     projection_type    = "ALL"			# "ALL" "INCLUDE" "KEYS_ONLY'
        # },
    # ]

    server_side_encryption = "true"
}
