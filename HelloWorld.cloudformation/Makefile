 
SRC=src/main.js 
TFSOURCE=HelloWorld.tf

all: package install

S3BUCKET=mdecorte-codebucket

############################################################
# Environment
.environment.terraform: $(PACKAGE)
.environment.terraform: $(TFSOURCE)
.environment.terraform: 
	terraform apply &&  \
	touch .environment.terraform

.environment.terraform: $(package)

############################################################
# Package
.package.cloudformation: newSamTemplate.yaml

samTemplate.yaml: templates/samTemplate.yaml
	terraform apply

newSamTemplate.yaml: samTemplate.yaml
newSamTemplate.yaml: $(SRC)
newSamTemplate.yaml:
	aws cloudformation package --template-file samTemplate.yaml --s3-bucket $(S3BUCKET) --output-template-file newSamTemplate.yaml && \
	touch .package.cloudformation


############################################################
# Install
.install.cloudformation: .package.cloudformation

.install.cloudformation:
	aws cloudformation deploy --template-file newSamTemplate.yaml --stack-name test --capabilities CAPABILITY_IAM && \
	touch .install.cloudformation


############################################################
# Test
.test.local:  terraform.tfstate .package.cloudformation .install.cloudformation
.test.local:
	( npm run lint && 										\
	npm run test && 										\
	npm run coverage &&										\
	touch .test.local 										\
	) 2>&1 | tee -a src/test.output 

############################################################
# Clean
clean.cloudformation:
	rm -f newSameTemplate.yaml
	rm -f .package.cloudformation .install.cloudformation

clean.local:
	rm -f src/test.output

############################################################
# Init
init:
	npm install --save-dev jest
	npm install --save-dev eslint-plugin-jest
	npm info "eslint-config-airbnb-base@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "eslint-config-airbnb-base@latest"
	npm install --save-dev webpack
	npm install
	terraform init
	terraform get
	terraform refresh

############################################################
environment: .environment.terraform

package: .package.cloudformation

install: .install.cloudformation

test: .test.local

clean: clean.cloudformation clean.local

veryclean: clean
	terraform destroy


