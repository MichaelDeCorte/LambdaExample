 
SRC=main.js 
TARGET=HelloWorld
TFSOURCE=HelloWorld.tf

all: package install

############################################################
# CloudFormation
S3BUCKET=mdecorte-codebucket

environment.Terraform: terraform.tfstate

terraform.tfstate: $(TFSOURCE)
terraform.tfstate:
	terraform apply

samTemplate.yaml: templates/samTemplate.yaml
	terraform apply

package.CloudFormation: newSamTemplate.yaml
newSamTemplate.yaml: samTemplate.yaml
newSamTemplate.yaml: $(SRC)
newSamTemplate.yaml:
	aws cloudformation package --template-file samTemplate.yaml --s3-bucket $(S3BUCKET) --output-template-file newSamTemplate.yaml && \
	touch .package.CloudFormation

.package.CloudFormation: newSamTemplate.yaml

install.CloudFormation: .install.CloudFormation 

.install.CloudFormation: .package.CloudFormation

.install.CloudFormation:
	aws cloudformation deploy --template-file newSamTemplate.yaml --stack-name test --capabilities CAPABILITY_IAM && \
	touch .install.CloudFormation


test.local: tests/$(TARGET).test.out

tests/$(TARGET).test.out:  terraform.tfstate .package.CloudFormation .install.CloudFormation
tests/$(TARGET).test.out: 
	cd tests; sh $(TARGET).test.sh
	cat $@

clean.CloudFormation:
	rm -f newSameTemplate.yaml
	rm -f .package.CloudFormation .install.CloudFormation

clean.local:
	rm -f tests/*.test.out tests/*.test.error

############################################################
environment: environment.Terraform

package: package.CloudFormation

install: install.CloudFormation

test: test.local

init:
	terraform init
	terraform get
	terraform refresh

clean: clean.CloudFormation clean.local

veryclean: clean
	terraform destroy


