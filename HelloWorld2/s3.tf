resource "aws_s3_bucket" "mrd_codebucket" {
  bucket = "mrd_codebucket"
  acl    = "private"

  tags {
    Name        = "Bucket for code packages"
    Environment = "Dev"
  }
}