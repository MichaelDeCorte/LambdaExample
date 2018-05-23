# LambdaExample

Todo
- authentication
- debugger in chrome
        https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27
- git branches
- cloudwatch alarms http://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html
- x-ray https://docs.aws.amazon.com/lambda/latest/dg/lambda-x-ray.html?shortFooter=true
- aws config
- aws ElastiCache
- route 53    
- selenium?
- cucumber?    
- vpc / https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html
- version node libraries
- version service
- load testing
- memory testing
- production / test / ....      
- source code security scanning (unclear if there are good open source packages to do this)
- local lambda?
    https://docs.aws.amazon.com/lambda/latest/dg/sam-cli-requirements.html
- Swagger is API Documentation spec.
- replace make??
- jenkins codepipeline
- service discovery
    https://read.acloud.guru/service-discovery-as-a-service-the-missing-serverless-lynchpin-541d001466f4
- Orchestration
    - AWS Step Functions
    - AWS Simple Workflow
    - https://read.acloud.guru/some-lessons-learned-about-lambda-orchestration-1a8b72a33fd2
- AWS code build, local testing, https://aws.amazon.com/about-aws/whats-new/2018/05/aws-codebuild-now-supports-local-testing-and-debugging    
- db 
    https://www.npmjs.com/package/dynamodb   waiting for promise support

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
- AWS Lambda best practices
    https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html
            Waiting on below to move aws declaration outside of method
            https://github.com/dwyl/aws-sdk-mock/issues/93
- input validation, https://www.npmjs.com/package/joi
    https://github.com/hapijs/joi/blob/v13.2.0/API.md#objectwithoutkey-peers
- lock local node to 8.10
- AOP / no.  Requires ES7 or Babel


Blog
- hackernoon.com
- medium.com
- dzone.com    
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
- taint syntax is just wrong...
    https://github.com/hashicorp/terraform/issues/11570
- can't taint template_files
    https://github.com/terraform-providers/terraform-provider-template/issues/2    

------------------------------------------------------------
Best practice
- tag all TF created resources with Terraform:true

------------------------------------------------------------
Best Practice
- use separate state files for each env
https://charity.wtf/2016/03/30/terraform-vpc-and-why-you-want-a-tfstate-file-per-env/
    