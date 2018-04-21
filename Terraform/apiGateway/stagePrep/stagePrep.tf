############################################################
# API
#   -> Resource (not required for /)
#       -> Method 
#           -> Integration with Lambda
#               -> Integration Response
#           -> Method Response
#   -> Deployment        
#        
#    

# include "global" variables
module "variables" {
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/variables"
}

variable "stage_name" {
    type = "string"
}

variable "api_id" {
    type = "string"
}

##############################
# create CloudWatch LogGroup
#
# must be created before AWS creates LogGroup via aws_api_gateway_method_settings
#
module "apiStageLogGroup" {
    source = "../../cloudwatch/logGroup"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/cloudwatch/logGroup"

    name = "API-Gateway-Execution-Logs_${var.api_id}/${var.stage_name}"
}    


############################################################

output "stage_name" {
    value = "${var.stage_name}"
}
