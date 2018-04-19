#############################################################
SRC= \
	src/putParty.js						\
	src/logger.js						\
	src/guid.js

UNITTESTSRC= \
		test/putParty-unit.test.js		\
		test/putParty-unit.test.json

INTTESTSRC= \
		test/putParty-aws.test.js 		\
		test/putParty-aws.test.json

TFSOURCE=putParty.tf
PACKAGE=.serverless/putParty.zip
.EXPORT_ALL_VARIABLES:

AWS_SDK_LOAD_CONFIG=1

# error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 
# LOG_LEVEL=silly
LOG_LEVEL=debug
# LOG_LEVEL=error

all: unit package environment install integration

############################################################
# Environment
.environment.terraform: $(PACKAGE)
.environment.terraform: $(TFSOURCE)
.environment.terraform: .unit.local
.environment.terraform: 
	terraform apply -auto-approve
	touch .environment.terraform

############################################################
# Package
$(PACKAGE): .unit.local
$(PACKAGE): $(SRC)
	npm run package

#############################################################
# Install
.install.terraform: terraform.tfstate 
.install.terraform: $(PACKAGE)
.install.terraform: .unit.local
.install.terraform:
	terraform apply -auto-approve
	touch .install.terraform

############################################################
# Unit Tests
.unit.local: $(UNITTESTSRC) $(SRC)
.unit.local: 
	echo ==== lint
	npm run lint 
	echo ==== unit test
	npm run unit	
	touch .unit.local

sonar:
	echo ==== sonarqube && sonar-scanner -Dproject.settings=$$HOME/.sonar/sonar-project.properties  $$(cat sonar.properties) 

############################################################
# Integration Tests
.integration.local: .unit.local
.integration.local: .install.terraform 
.integration.local: $(INTTESTSRC) $(SRC)
.integration.local:
	npm run aws
	touch .integration.local

# npm run service

############################################################
# Clean
clean.terraform:
	rm -f .install.terraform $(package)

clean.local:
	rm -f test/test.output .unit.local .integration.local

############################################################
# Init
init:
	npm install --save-dev npm # update npm
	npm install --save-dev jest
	npm install --save-dev jest-each
	npm install --save-dev eslint-plugin-jest
	npm install --save-dev serverless
	npm info "eslint-config-airbnb-base@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "eslint-config-airbnb-base@latest"
	npm install --save-dev aws-sdk
	npm install --save-dev aws-sdk-mock
	npm install --save-dev supertest
	npm install string-hash
	npm install promise
	npm install winston
	npm install
	terraform init
	terraform get

############################################################
environment: .environment.terraform

package: $(PACKAGE)

install: .install.terraform

test: unit integration

unit: .unit.local

integration: .integration.local
integration: .unit.local

clean: clean.terraform clean.local

veryclean:  clean
	terraform destroy

