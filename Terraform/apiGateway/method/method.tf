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

variable "resource_id" {
	type = "string"
}

variable "function_uri" {
	type = "string"
}    

variable "function_name" {
	type = "string"
}    
    
##############################

variable "logging_level" {
    # OFF ERROR INFO
    default   = "INFO" 
}

variable "integration_type" {
    # AWS, AWS_PROXY, HTTP or HTTP_PROXY
    default     = "AWS_PROXY"
}

variable "integration_http_method" {
    # GET, POST, PUT, DELETE, HEAD, OPTION, ANY
    default     = "POST" 
}

# create CloudWatch LogGroup
#
# must be created before AWS creates LogGroup via aws_api_gateway_method_settings
#
module "apiLogGroup" {
    source = "../../cloudwatch/logGroup"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/cloudwatch/logGroup"

    name = "API-Gateway-Execution-Logs_${var.api_id}/${var.stage_name}"
}    

resource "aws_api_gateway_method" "apiMethod" {
    rest_api_id   = "${var.api_id}"
    resource_id   = "${var.resource_id}"
    http_method   = "ANY"
    http_method   = "PUT"
    authorization = "NONE"
}

# enable logging for this method
resource "aws_api_gateway_method_settings" "methodSettings" {
    depends_on = [
        "module.apiLogGroup",
        "aws_api_gateway_deployment.methodDeployment"
    ]

    rest_api_id = "${var.api_id}"
    stage_name  = "${var.stage_name}"
    method_path = "*/*"
    
    settings {
        metrics_enabled = true
        logging_level   = "${var.logging_level}"
        data_trace_enabled = true
    }
}

resource "aws_api_gateway_integration" "methodIntegration" {
    rest_api_id = "${var.api_id}"
    resource_id = "${aws_api_gateway_method.apiMethod.resource_id}"
    http_method = "${aws_api_gateway_method.apiMethod.http_method}"

    integration_http_method = "${var.integration_http_method}"
    type                    = "${var.integration_type}"
    uri                     = "${var.function_uri}"
}

##############################
resource "aws_api_gateway_method_response" "200MethodResponse" {
    depends_on = [
        "aws_api_gateway_integration.methodIntegration"
    ]
    rest_api_id = "${var.api_id}"
    resource_id   = "${var.resource_id}"
    http_method = "${aws_api_gateway_method.apiMethod.http_method}"
    status_code = "200"
    response_models = {
        "application/json" = "Empty"
    }
}
        
##############################
resource "aws_api_gateway_method_response" "500MethodResponse" {
    depends_on = [
        "aws_api_gateway_integration.methodIntegration"
    ]
    rest_api_id = "${var.api_id}"
    resource_id   = "${var.resource_id}"
    http_method = "${aws_api_gateway_method.apiMethod.http_method}"
    status_code = "500"
    response_models = {
        "application/json" = "Error"
    }
}
        
# ##########
resource "aws_api_gateway_deployment" "methodDeployment" {
    depends_on = [
        "aws_api_gateway_integration.methodIntegration",
    ]

    rest_api_id = "${var.api_id}"
    stage_name  = "${var.stage_name}"
}

resource "aws_lambda_permission" "allowApiGateway" {
  statement_id   = "AllowExecutionFromApiGateway"
  action         = "lambda:InvokeFunction"
  function_name  = "${var.function_name}"
  principal      = "apigateway.amazonaws.com"
}

output "invoke_url" {
    value = "${aws_api_gateway_deployment.methodDeployment.invoke_url}"
}


