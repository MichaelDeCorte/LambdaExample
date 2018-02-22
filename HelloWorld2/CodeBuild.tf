resource "aws_iam_role" "codebuild_role" {
  name = "CodeBuildRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codebuild.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "CodeBuildPolicy" {
  name        = "codebuild-policy"
  path        = "/service-role/"
  description = "Policy used in trust relationship with CodeBuild"

  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Resource": "*",
            "Action": [
                "codebuild:StartBuild",
                "codebuild:StopBuild",
                "codebuild:BatchGet*",
                "codebuild:Get*",
                "codebuild:List*",
                "s3:GetBucketLocation",
                "s3:ListAllMyBuckets",
                "s3:GetObject",
                "s3:PutObject"
            ]
        },
        {
            "Effect": "Allow",
            "Resource": "arn:aws:logs:*:*:log-group:/aws/codebuild/*:log-stream:*",
            "Action": [
                "logs:CreateLogStream"
            ]
        },
        {
            "Effect": "Allow",
            "Resource": "arn:aws:ssm:*:*:parameter/CodeBuild/*",
            "Action": [
                "ssm:PutParameter"
            ]
        }
    ]
}
POLICY
}

resource "aws_iam_policy_attachment" "codebuild_policy_attachment" {
  name       = "codebuild-policy-attachment"
  policy_arn = "${aws_iam_policy.codebuild_policy.arn}"
  roles      = ["${aws_iam_role.codebuild_role.id}"]
}

resource "aws_codebuild_project" "HelloWorld" {
  name         = "HelloWorld"
  description  = "HelloWorld Lamba project"
  build_timeout      = "5"
  service_role = "${aws_iam_role.codebuild_role.arn}"

  artifacts {
    type = "NO_ARTIFACTS"
  }

  environment {
    compute_type = "BUILD_GENERAL1_SMALL"
    image        = "aws/codebuild/nodejs:6.3.1"
    type         = "LINUX_CONTAINER"

    environment_variable {
      "name"  = "SOME_KEY1"
      "value" = "SOME_VALUE1"
    }

    environment_variable {
      "name"  = "SOME_KEY2"
      "value" = "SOME_VALUE2"
    }
  }

  source {
    type     = "GITHUB"
    location = "https://github.com/MichaelDeCorte/LambdaExample.git"
    buildspec = "HelloWorld2/buildspec.yml"
  }

  tags {
    "Environment" = "Test"
  }

  depends_on = ["aws_s3_bucket.mrd-codebucket"]
}

