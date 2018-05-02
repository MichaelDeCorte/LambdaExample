# partyTable.tf
    
resource "aws_dynamodb_table" "partyTable" {
  name           = "party"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "partyID"

  attribute {
    name = "partyID"
    type = "N"
  }

  tags    = "${module.variables.tags}"

  server_side_encryption {
    enabled = "true"
  }
}

