resource "aws_s3_bucket" "mdecorte-codebucket" {
  bucket = "mdecorte-codebucket"
  acl    = "private"

  tags {
    Name        = "Bucket for code packages"
    Environment = "Dev"
  }
}