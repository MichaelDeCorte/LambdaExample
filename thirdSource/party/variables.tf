variable "globals" {
    type = "map"
}

variable "tags" {
	 type = "map"
	 default = { }
}

variable "api_id" {
    type = "string"
}

variable "api_execution_arn" {
    type = "string"
}

variable "api_authorizer_id" {
    default = ""
}

variable "api_parent_id" {
    type = "string"
}

variable "s3_bucket" {
    type = "string"
}

variable "version" {
    default = "0.0.1"
}

variable "role_arn" {
    type = "string"
}
