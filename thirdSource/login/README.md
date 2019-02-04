
    - User Pool / authentication
        - custom or federated
    - Identity Pool / authorization

white list URI
https://developer.amazon.com/iba-sp/overview.html
AWS Developer -> Apps & Testing -> Security Profiles -> Web Settings
Allowed Origins = https://thirdsource.auth.us-east-1.amazoncognito.com
Return URLs = https://thirdsource.auth.us-east-1.amazoncognito.com/oauth2/idpresponse


============================================================
Api integration with Cognito

https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-enable-cognito-user-pool.html?shortFooter=true

CONFIGURE ******************************
Authorizers -> Create New Authorizer

    Token Source = Authorization

test via console using id_token (see below) without tag or quotes

LOGIN ******************************
-> Login link href = 
    https://<your_cognito_domain>/login?response_type=code&client_id=<your_app_client_id>&redirect_uri=<your_callback_url_encoded>
 	https://thirdsource.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=1g3f272m2ah3fn92kgc7r8hmcn&redirect_uri=http%3A%2F%2Flocalhost%3A4200/login

-> aws login page

-> response =
    <your_calback_url>?code=<string>
    http://localhost:4200/login?code=900b2860-3da0-4dda-af76-99ae134a7f5e

-> angular grab "code"

-> transate code to token
    https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html?shortFooter=true
    https://<your_cognito_domain>/oauth2/token
    body:
        grant_type:     authorization_code
        client_id:      <your_app_client_id>
        redirect_uri:   <your_callback_url>
        code:           <code>
    http options:
        Content-Type:  application/x-www-form-urlencoded

    Request URL: https://thirdsource.auth.us-east-1.amazoncognito.com/oauth2/token

    body:
        grant_type: authorization_code
        client_id: 1g3f272m2ah3fn92kgc7r8hmcn
        redirect_uri: http://localhost:4200/login
        code: b09c1a6f-9088-49c3-aa0f-79b830c2df6a
    Request Headers
        Content-Type: application/x-www-form-urlencoded

-> Response =
    id_token
    access_token
    refresh_token
    
USER ATTRIBUTES ******************************

ACCESS ******************************        


    Request Headers
        Authorization
LOGOUT ******************************
https://docs.aws.amazon.com/cognito/latest/developerguide/logout-endpoint.html?shortFooter=true

TEST ******************************

