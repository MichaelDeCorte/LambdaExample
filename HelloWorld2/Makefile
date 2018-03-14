 
SRC=main.js 
TARGET=HelloWorld
TFSOURCE=HelloWorld.tf

all: package install

############################################################
# CodeBuild
# package.CodeBuild: 
# 	@ARN=$$(aws codebuild start-build --project-name HelloWorld --output json  | sed -n 's@^[[:blank:]]*"arn":.*"\(.*\)"$$@\1@p'); \
# 	BUILDCOMPLETE=false; \
# 	while [ $$BUILDCOMPLETE == false ] ;\
# 	do \
# 		BUILDCOMPLETE=$$(aws codebuild batch-get-builds --ids $$ARN --output json | sed -n 's@[[:space:]]*"buildComplete": \(.*\),@\1@p') ; \
# 		echo Build In Progress ; \
# 		sleep 1; \
# 	done ; \
# 	BUILDSTATUS=$$(aws codebuild batch-get-builds --ids $$ARN --output json | sed -n 's@[[:space:]]*"buildStatus": "\(.*\)",@\1@p') ; \
# 	aws codebuild batch-get-builds --ids $$ARN --output json ; \
# 	echo $$BUILDSTATUS 

# ############################################################
# # Terraform
# TESTOUTPUT=testOutput.txt
# PACKAGE=HelloWorld.zip

# # terraform.tfstate: $(PACKAGE) 
# # 	terraform apply

# install.Terraform: terraform.tfstate $(PACKAGE)

# $(PACKAGE): $(SRC)
# 	zip -r $@ $<

# $(TESTOUTPUT): terraform.tfstate $(PACKAGE) 
# 	sh ./test.sh

# testTerraform: $(TESTOUTPUT)

############################################################
# CloudFormation
environment.Terraform: terraform.tfstate

terraform.tfstate: $(TFSOURCE)
terraform.tfstate:
	terraform apply

package.CloudFormation: newSamTemplate.yaml
newSamTemplate.yaml: samTemplate.yaml
newSamTemplate.yaml: $(SRC)
newSamTemplate.yaml:
	aws cloudformation package --template-file samTemplate.yaml --s3-bucket mdecorte-codebucket --output-template-file newSamTemplate.yaml && \
	touch .package.CloudFormation

.package.CloudFormation: newSamTemplate.yaml

install.CloudFormation: .install.CloudFormation 

.install.CloudFormation: .package.CloudFormation

.install.CloudFormation:
	aws cloudformation deploy --template-file newSamtemplate.yaml --stack-name test --capabilities CAPABILITY_IAM && \
	touch .install.CloudFormation


test.local: $(TARGET).test.out environment package install


$(TARGET).test.out: 
$(TARGET).test.out: 
	sh $(TARGET).test.sh 

clean.CloudFormation:
	rm -f newSameTemplate.yaml
	rm -f .package.CloudFormation .install.CloudFormation

clean.local:
	rm -f *.test.out

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


