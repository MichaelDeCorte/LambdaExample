############################################################
# Inialization
module "variables" {
    # source = "../Terraform/variables"
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/variables"
}

provider "aws" {
    region     = "${module.variables.region}"
    
}

##########
# s3 to store code
module "mdecorte-codebucket" {
    # source = "../Terraform/s3"
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/s3"

    bucket = "mdecorte-codebucket"
    acl    = "private"
    force_destroy = true
}    

##########
# install lambda function
module "putParty" {
    source = "../Terraform/lambda/basic"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/lambda/basic"

    filename		    = "putParty-0.0.2.zip"
    s3_bucket           = "${module.mdecorte-codebucket.id}"
    function_name		= "putParty"
    handler			    = "src/putParty.handler"
    variables           =
    {
        LOG_LEVEL = "debug"
    }
}

##########
# install api gateway
module "apiGateway" {
    source = "../Terraform/apiGateway/api"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/apiGateway/api"

    api_name = "party"
}

module "uatStage" {
    source = "../Terraform/apiGateway/stagePrep"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/apiGateway/stagePrep"

    api_id 			= "${module.apiGateway.api_id}"
    stage_name 		= "uat"
}
##########
module "putPartyApi" {
    source = "../Terraform/apiGateway/lambdaPrep"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/apiGateway/lambdaPrep"

    function_name	= "${module.putParty.function_name}"    
}


##########
module "partyResource" {
    source = "../Terraform/apiGateway/resource"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/apiGateway/resource"

    api_id 			= "${module.apiGateway.api_id}"
    resource_id     = "${module.apiGateway.root_resource_id}"
    path_part		= "party"
}

module "putPartyMethod" {
    source = "../Terraform/apiGateway/method"
    # source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/apiGateway/method"

    stage_name 		= "${module.uatStage.stage_name}"
    api_id 			= "${module.apiGateway.api_id}"
    resource_id     = "${module.partyResource.resource_id}"
    function_uri	= "${module.putParty.invoke_arn}"    
}


##############################
module "uriTemplate" {
    source = "git@github.com:MichaelDeCorte/LambdaExample.git//Terraform/files"
    # source = "../Terraform/files"

    input = "templates/putParty-service.uri.js"
    output = "test/putParty-service.uri.js"
    variables = {
        # uri = "${module.putPartyMethod.invoke_url}"
        uri = "${module.putPartyMethod.deployment_url}${module.partyResource.subPath}"
    }
}    


############################################################
# the api gateway url

# the method url
output "url" {
    value = "${module.putPartyMethod.deployment_url}${module.partyResource.subPath}"
}


