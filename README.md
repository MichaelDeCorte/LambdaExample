# LambdaExample

Todo
- input validation, https://www.npmjs.com/package/joi
- selenium?
- cucumber?    
- blog notes    
- vpc
- route 53    
- version node libraries
- static resources
- jenkins    ???
- version service
- load testing
- memory testing
- module location within package / packageroot
- authentication
- production / test / ....      
- source code security scanning (unclear if there are good open source packages to do this)
- local lambda?
    https://docs.aws.amazon.com/lambda/latest/dg/sam-cli-requirements.html
- Swagger is API Documentation spec.
- replace make??
    
Done
- AWS stubbing
- terraform deploy
- jest
- data driven testing / jest-each
- integration with sonarqube
- jest-each, externalize test data
- integration testing
- dynamo     
- push code to S3
- logging
- data at rest
- AWS api gateway
- CloudWatch log group retention policy
- better sub-module support
- multiple services with one lambda? / issues with 
    https://stackoverflow.com/questions/41425511/aws-api-gateway-lambda-multiple-endpoint-functions-vs-single-endpoint
    https://github.com/balmbees/corgi
    https://www.npmjs.com/package/vingle-corgi
- better test coverage
- logging at module aka log4j
- dynamo orm
    https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
    https://github.com/clarkie/dynogels
    https://github.com/automategreen/dynamoose
    https://www.npmjs.com/package/dynamodb-data-types
    https://www.npmjs.com/package/dynamodb-marshaler
- upgrade to node 8.10 # terraform init -upgrade

Blog
- hello world
    - setup ~/.aws
    - setup aws cli
    - setup terraform
    - setup npm
    - initial TF script
    - cli testing
- automation
    - makefile
    - eslint
    - logging
    - testing
        - jest
        - unit tests
- lambda party service
    - method router
    - promises
    - dynamo integration
    - more terraform
    - testing
        - jest each
        - more unit
        - aws integration tests
- aws api
    - testing
        - jest each
        - more unit
        - more integration tests
        - service integration tests


============================================================    
Terraform
ISSUES
- debugging is hard....errors not helpful.  errors frequently don't have the file with the error
- provisioniner can't be separated from resource
- execution from anyplace except project root is really bad

- no variable for project root
- module source doesn't support variables  :  "${path.root}/variables/chef"

- input variables can't be interpolated.   # see default tag for a pattern to support this

- no support for looping or conditionals
- no support for depends_on between modules        


------------------------------------------------------------
Best practice
- tag all TF created resources with Terraform:true

------------------------------------------------------------
Best Practice
- use separate state files for each env
https://charity.wtf/2016/03/30/terraform-vpc-and-why-you-want-a-tfstate-file-per-env/
    