 
SRC=src/main.js 
TFSOURCE=HelloWorld.tf

all: package install

############################################################
# CloudFormation
S3BUCKET=mdecorte-codebucket

environment.terraform: terraform.tfstate

terraform.tfstate: $(TFSOURCE)
terraform.tfstate:
	terraform apply

samTemplate.yaml: templates/samTemplate.yaml
	terraform apply

newSamTemplate.yaml: samTemplate.yaml
newSamTemplate.yaml: $(SRC)
newSamTemplate.yaml:
	aws cloudformation package --template-file samTemplate.yaml --s3-bucket $(S3BUCKET) --output-template-file newSamTemplate.yaml && \
	touch .package.cloudformation

.package.cloudformation: newSamTemplate.yaml

.install.cloudformation: .package.cloudformation

.install.cloudformation:
	aws cloudformation deploy --template-file newSamTemplate.yaml --stack-name test --capabilities CAPABILITY_IAM && \
	touch .install.cloudformation


.test.local:  terraform.tfstate .package.cloudformation .install.cloudformation
.test.local:
	( npm run lint && 										\
	npm run test && 										\
	npm run coverage &&										\
	touch .test.local 										\
	) 2>&1 | tee -a src/test.output 

clean.cloudformation:
	rm -f newSameTemplate.yaml
	rm -f .package.cloudformation .install.cloudformation

clean.local:
	rm -f src/test.output

############################################################
environment: environment.terraform

package: .package.cloudformation

install: .install.cloudformation

test: .test.local

init:
	npm install --save-dev jest
	npm install --save-dev eslint-plugin-jest
	npm info "eslint-config-airbnb-base@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "eslint-config-airbnb-base@latest"
	npm install --save-dev webpack
	npm install
	terraform init
	terraform get
	terraform refresh

clean: clean.cloudformation clean.local

veryclean: clean
	terraform destroy


