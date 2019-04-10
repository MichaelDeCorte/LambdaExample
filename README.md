https://thirdsource.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=139l5vat7ia75ckr20iuhhjv0f&redirect_uri=https%3A%2F%www.google.com

    
# LambdaExample

==============================
TODO
- aws config
    - ssh should be retricted to vpn
    - s3 buckets should be replicated across regions
    - s3 buckets should be encypted / done
    
- multiple angular workspaces, not hard coded.  how?  Currently "dev" is hardcoded in shared/environment/environment.service.ts
- micro frontends https://micro-frontends.org/
- app mesh
- session manager: https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-sessions-start.html
- packer?
- refactor to classes
- aws ElastiCache
- debugger in chrome
        https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27
- git branches
- cloudwatch alarms http://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html
- x-ray https://docs.aws.amazon.com/lambda/latest/dg/lambda-x-ray.html
    
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
- service discovery
    https://read.acloud.guru/service-discovery-as-a-service-the-missing-serverless-lynchpin-541d001466f4
- Orchestration
    - AWS Step Functions
    - AWS Simple Workflow
    - https://read.acloud.guru/some-lessons-learned-about-lambda-orchestration-1a8b72a33fd2
- jenkins codepipeline
- AWS code build, local testing, https://aws.amazon.com/about-aws/whats-new/2018/05/aws-codebuild-now-supports-local-testing-and-debugging
- api stages, and lambda versioning
    Stages are linked at method level to the lambda functions and
    structure.  So all of the stages will have the same api with at
    most different versions of the api.  This makes it difficult to
    add new functions, or introduce breaking changes. Stages are best
    reserved for green / yellow deployments.
    
    For different env, create a new api.

- replace make??
- api gateway, stages shoudl use stage variables
    https://medium.com/@muralimohan.mothupally/configuring-aws-lambda-for-multiple-environments-using-api-gateway-stages-for-an-asp-net-1d5d8e2e88b6
    https://docs.amazonaws.cn/en_us/apigateway/latest/developerguide/aws-api-gateway-stage-variables-reference.html
- api key

    
  
- db 
    https://www.npmjs.com/package/dynamodb   waiting for promise support

==============================
DONE
- TF lambda module / multiple services, simplify usage
- disallow s3 website access
- multiple workspaces
    - dynamo / done
    - cloudwatch / done
	- angular / done
    - lambda / done
    - s3 / done
    - cloudfront / done
    - route 53 / done
    - api gateway / done
    - terraform / done
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
- TF / dependencyId 
        ############################################################
        # hack for lack of depends_on                                                                                                                
        variable "depends" {
            default = ""
        }

        resource "null_resource" "depends" {

            # triggers = {
            #     value = "${aws_s3_bucket.website.}"
            # }

            depends_on = [
                "aws_s3_bucket.website"
            ]
        }

        output "depends" {
            value   = "${var.depends}:s3/${null_resource.depends.id}"
        }


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
- module source doesn't support variables  :  "${path.root}/variables/chef"
- no support for looping or conditionals
- no support for depends_on between modules        
- taint syntax is just wrong...
    https://github.com/hashicorp/terraform/issues/11570
- can't taint template_files
    https://github.com/terraform-providers/terraform-provider-template/issues/2    
- can't use count for modules
- count can't be computed.
    https://github.com/hashicorp/terraform/issues/12570
- conditionals to allow switching between two different parameters
	- https://github.com/hashicorp/terraform/issues/14037
- array of maps / map of arrays, unstable
- input variables can't be interpolated.   # see default tag for a pattern to support this
- accessing elements isn't consistent. sometimes splat, lookup, element
- conditionals can't be used with lists
    https://github.com/hashicorp/terraform/issues/18259
- the output of a * splat resource that has 0 elements isn't treated as an empty list.  
    https://github.com/hashicorp/terraform/issues/16681
- lifecycles have to be hard coded
    https://github.com/hashicorp/terraform/issues/3116
- assigning values to a block is inconsistent
    https://github.com/hashicorp/terraform/issues/16582

            

    
------------------------------------------------------------
Best practice
- tag all TF created resources with Terraform:true

------------------------------------------------------------
Best Practice
- use separate state files for each env
https://charity.wtf/2016/03/30/terraform-vpc-and-why-you-want-a-tfstate-file-per-env/
    