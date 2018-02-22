resource "aws_s3_bucket" "mrd-codebucket" {
  bucket = "mrd-codebucket"
  acl    = "private"

  tags {
    Name        = "Bucket for code packages"
    Environment = "Dev"
  }
}