https://thirdsource.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=139l5vat7ia75ckr20iuhhjv0f&redirect_uri=https%3A%2F%www.google.com

    
# LambdaExample

Todo
- multiple angular workspaces, not hard coded.  how?
- multiple workspaces
	- angular / https://blog.angularindepth.com/becoming-an-angular-environmentalist-45a48f7c20d8
    - lambda / https://docs.aws.amazon.com/lambda/latest/dg/versioning-aliases.html
    - dynamo
    - cloudwatch
    - s3 / done
    - cloudfront / done
    - route 53 / done
    - api gateway / done
    - terraform / done

- disallow s3 website access
- TF / dependencyId 
        ############################################################                                                                                # hack for lack of depends_on                                                                                                                
        variable "dependsOn" {
            default = ""
        }

        resource "null_resource" "dependsOn" {

            # triggers = {
            #     value = "${aws_s3_bucket.website.}"
            # }

            depends_on = [
                "aws_s3_bucket.website"
            ]

        }

        output "dependencyId" {
            value   = "${var.dependsOn}:${null_resource.dependsOn.id}"
        }

- session manager: https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-sessions-start.html
- move to gitlab
- packer?
- refactor to classes
- aws ElastiCache
- aws config
- debugger in chrome
        https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27
- git branches
- cloudwatch alarms http://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html
- x-ray https://docs.aws.amazon.com/lambda/latest/dg/lambda-x-ray.html?shortFooter=true
- selenium?
- cucumber?    
- vpc / https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html
- lambda vpc
- api gateway vpc link
- version node libraries
- version service
- load testing
- memory testing
- source code security scanning (unclear if there are good open source packages to do this)
- local lambda?
    https://docs.aws.amazon.com/lambda/latest/dg/sam-cli-requirements.html
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
- authentication
    cognito https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html
    api https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html
- node local packaging
    - http://nicksellen.co.uk/2015/04/17/how-to-manage-private-npm-modules.html
    - https://docs.npmjs.com/cli/link.html
- route 53    
- terraform production / test / ....      
- refactor dynamo for more generic approach
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
    