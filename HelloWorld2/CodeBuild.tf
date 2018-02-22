resource "aws_iam_role" "CodeBuildRole" {
  name = "CodeBuildRole"

  assume_role_policy = "${file("CodeBuildRole.json")}"
}

resource "aws_iam_policy" "CodeBuildPolicy" {
  name        = "CodeBuildPolicy"
  path        = "/service-role/"
  description = "Policy used in trust relationship with CodeBuild"

  policy = "${file("CodeBuildPolicy.json")}"

}

resource "aws_iam_policy_attachment" "codebuild_policy_attachment" {
  name       = "CodeBuildPolicyAttachment"
  policy_arn = "${aws_iam_policy.CodeBuildPolicy.arn}"
  roles      = ["${aws_iam_role.CodeBuildRole.id}"]
}

resource "aws_codebuild_project" "HelloWorld" {
  name         = "HelloWorld"
  description  = "HelloWorld Lamba project"
  build_timeout      = "5"
  service_role = "${aws_iam_role.CodeBuildRole.arn}"

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

  depends_on = ["aws_s3_bucket.mdecorte-codebucket"]
}

