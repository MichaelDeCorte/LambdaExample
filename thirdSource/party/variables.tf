variable "globals" {
    type = "map"
}

variable "api_id" {
    type = "string"
}

variable "parent_id" {
    type = "string"
}

variable "stage_name" {
    type = "string"
}

variable "s3_bucket" {
    type = "string"
}

variable "version" {
    default = "0.0.1"
}

variable "authorizer_id" {
    default = ""
}

variable "api_execution_arn" {
    type = "string"
}

variable "tags" {
	 type = "map"
	 default = { }
}
