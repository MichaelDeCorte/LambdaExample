#############################################################
SRC=src/main.js
TESTSRC= \
		test/main-aws.test.js 		\
		test/main-aws.test.json 	\
		test/main-unit.test.js		\
		test/main-unit.test.json

TFSOURCE=HelloWorld.tf
PACKAGE=HelloWorld.zip

all: unit package environment install integration

############################################################
# Environment
.environment.terraform: $(PACKAGE)
.environment.terraform: $(TFSOURCE)
.environment.terraform: .unit.local
.environment.terraform: 
	terraform apply -auto-approve &&  \
	touch .environment.terraform

############################################################
# Package
.package.terraform: $(PACKAGE)
.package.terraform: .unit.local

$(PACKAGE): $(SRC)
	zip -r $@ $<

#############################################################
# Install
.install.terraform: terraform.tfstate 
.install.terraform: $(PACKAGE)
.install.terraform:
	terraform apply -auto-approve && \
	touch .install.terraform

############################################################
# Unit Tests
.unit.local: $(TESTSRC)
.unit.local:
	( npm run lint  									&&	\
	npm run unit 	 									&&	\
	npm run coverage 									&&	\
	touch .unit.local 									&&	\
	sonar-scanner -Dproject.settings=$$HOME/.sonar/sonar-project.properties  $$(cat sonar.properties) \
	) 2>&1 | tee -a test/test.output

############################################################
# Integration Tests
.integration.local:  terraform.tfstate .install.terraform .unit.local
.integration.local: $(TESTSRC)
.integration.local:
	( npm run aws 	 									&&	\
	touch .integration.local 								\
	) 2>&1 | tee -a test/test.output 


############################################################
# Clean
clean.terraform:
	rm -f .install.terraform $(package)

clean.local:
	rm -f test/test.output .unit.local .integration.local

############################################################
# Init
init:
	npm install npm # update npm
	npm install --save-dev jest
	npm install --save-dev jest-each
	npm install --save-dev eslint-plugin-jest
	npm info "eslint-config-airbnb-base@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "eslint-config-airbnb-base@latest"
	npm install --save-dev webpack
	npm install --save-dev aws-sdk
	npm install --save-dev aws-sdk-mock
	npm install
	terraform init
	terraform get
	terraform refresh

############################################################
environment: .environment.terraform

package: .package.terraform

install: .install.terraform

test: unit integration

unit: .unit.local

integration: .integration.local

clean: clean.terraform clean.local

veryclean:  clean
	terraform destroy

