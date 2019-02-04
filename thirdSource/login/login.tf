############################################################
#

variable "globals" {
    type = "map"
}

variable "tags" {
    type = "map"
    default = {}
}

# website that requires authenciation and autorization
variable "callback_url" {
    type = "string"
}

variable "signout_url" {
    default= ""
}

# 1) the name of the pool
# 2) the URL prefix, https://<domain>.auth.<region>.amazoncognito.com.
variable "domain" {
    type = "string"
}

variable "amazonClient" {
    type = "map"
}

##############################

locals {
    region = "${var.globals["region"]}"
}

############################################################
# https://textik.com/#26ee3d6d3e83fc6c
#
# User Pool                                                                       
# | | | | 
# | | | |                                                                      +
# | | | +-------> Policy                                                        
# | | |                                                                         
# | | +---------> Federated Identity Provider                                   
# | |                  |                                                        
# | |                  |                                                        
# | |                  +-----------> Application (Client)                       
# | +------------------------------>     |                                      
# |                                      |                                      
# |                                      +---> Authentication URL (Domain)      
# +------------------------------------------>                                  
############################################################

############################################################
# white list URI
# https://developer.amazon.com/iba-sp/overview.html

############################################################
# Create the User Pool for Authentication / General Settings
# General Settings -> Attributes
# General Settings -> Policies
resource "aws_cognito_user_pool" "pool" {
    name = "${var.domain}" 			# name of the pool
    # username_attributes = ["email"] # how to login.  phone_number, email, preferred_username
    # alias_attributes = [
    #     "email"
    # ] # how to login.  phone_number, email, preferred_username

    username_attributes = [
        "email"
    ]

    admin_create_user_config {
        allow_admin_create_user_only = true # MRD, not sure this works with federated identities
    }

    password_policy {
        minimum_length = 8
    }

    tags                        = "${merge( var.tags,
											var.globals["tags"],      
											map("Service", "cognito-idp.user-pool"),
											map("Name", "${var.domain}"))}"    

}

# Link the Federated Identity Provider with the Pool
# Depends upon App Registration with Provider
# Federation -> Identity Provider
# Federation -> Attribute Mapping
resource "aws_cognito_identity_provider" "AWSprovider" {
    user_pool_id  = "${aws_cognito_user_pool.pool.id}"
    provider_name = "LoginWithAmazon"

    # Valid Values: SAML | Facebook | Google | LoginWithAmazon | OIDC
    provider_type = "LoginWithAmazon"

    provider_details {
        client_id         = "${var.amazonClient["ID"]}"
        client_secret     = "${var.amazonClient["Secret"]}"
        # available scopes: postal_code profile profile:user_id profile:email profile:name
        # authorize_scopes  = "profile:user_id"
        authorize_scopes  = "profile"
        
        # should not be required
        attributes_url	  = "https://api.amazon.com/user/profile"
        attributes_url_add_attributes = "false"
        authorize_url = "https://www.amazon.com/ap/oa"
        token_request_method = "POST"
        token_url = "https://api.amazon.com/auth/o2/token"
    }

    attribute_mapping {
        username = "user_id"
        email    = "email"
    }
}


# Define the Application
# Associate the Applicatioin with the Pool
resource "aws_cognito_user_pool_client" "client" {
    depends_on = [ "aws_cognito_identity_provider.AWSprovider" ]
    user_pool_id = "${aws_cognito_user_pool.pool.id}"

    ##########
    # General settings -> App Clients
    name = "loginClient"
    generate_secret = false
    refresh_token_validity = 30
    explicit_auth_flows = [ "USER_PASSWORD_AUTH" ]


    ##########
    # App Integration -> App Client Settings

    supported_identity_providers = ["COGNITO", "LoginWithAmazon"]

    callback_urls = [
        "${var.callback_url}"
    ]

    logout_urls = [
        "${var.signout_url}"
    ]

    # define how AWS sends the application the authorization token.
    # code / server side token code; implicit / client side uri code
    # https://developer.amazon.com/docs/login-with-amazon/choose-authorization-grant.html
    # allowed_oauth_flows = ["code", "implicit"] 
    allowed_oauth_flows = ["code"] 

    # define what account data is shared from the identity pool with the application
    # https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-app-idp-settings.html
    # https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_UserPoolClientType.html
    # overridden by aws_cognito_identity_provider authorize_scopes
    allowed_oauth_scopes = ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"]

    #  client is allowed to follow the OAuth protocol when interacting with Cognito user pools.
    allowed_oauth_flows_user_pool_client = true
}

# Define the Authentication URLs = https://<domain>.auth.<region>.amazoncognito.com.
# App Integration -> Domain Name
resource "aws_cognito_user_pool_domain" "domain" {
    depends_on = [ "aws_cognito_user_pool_client.client" ]
    domain = "${var.domain}"
    user_pool_id = "${aws_cognito_user_pool.pool.id}"
}

# resource "aws_cognito_identity_pool" "main" {
#     identity_pool_name               = "identityPool"
#    allow_unauthenticated_identities = false
#
#    cognito_identity_providers {
#        client_id = "${aws_cognito_user_pool_client.client.id}"
#        provider_name = "cognito-idp.us-east-1.amazonaws.com/${aws_cognito_user_pool.pool.id}"
#    }
#  supported_login_providers {
#    "graph.facebook.com"  = "12345678"
#    "accounts.google.com" = "123456789012.apps.googleusercontent.com"
#  }
# }


# ############################################################
# # the login url

# # the resource url
output "url" {
    value = "https://${var.domain}.auth.${local.region["region"]}.amazoncognito.com/login?response_type=code&client_id=${aws_cognito_user_pool_client.client.id}&redirect_uri=${urlencode(var.callback_url)}"
}

output "client_id" {
    value = "${aws_cognito_user_pool_client.client.id}"
}

output "pool_id" {
    value = "${aws_cognito_user_pool.pool.id}"
}

############################################################
# hack for lack of depends_on
variable "dependsOn" {
    default = ""
}

resource "null_resource" "dependsOutput" {

    triggers = {
        value = "${aws_cognito_user_pool.pool.id}"
    }
}

output "dependencyId" {
    # value = "${module.partyResource.subPath}"
    value 	= "${var.dependsOn}:${null_resource.dependsOutput.id}"
}

