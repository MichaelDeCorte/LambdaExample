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
PACKAGE=putParty-0.0.2.zip
.EXPORT_ALL_VARIABLES:

AWS_SDK_LOAD_CONFIG=1

# error', 'warn', 'info', 'debug', and 'trace'
# LOG_LEVEL=trace
LOG_LEVEL=error

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
	npm run dependencies
	npm pack
	set -e; \
	TGZ=`echo $(PACKAGE) | sed 's@.[zZ][iI][pP]@.tgz@g'`; \
	SDIR=`pwd`;\
	TDIR=/tmp/$$$$.npmpackage; \
	mkdir $$TDIR; \
	cd $$TDIR;	\
	tar xf $$SDIR/$$TGZ;	\
	cd package; 	\
	find node_modules -name '*.md' -exec rm {} \; ;\
	find . -name 'package*.json' -exec rm {} \; ;\
	zip --recurse-path --quiet ../$(PACKAGE) .;	\
	cd $$SDIR; \
	mv $$TDIR/$(PACKAGE) . ;\
	rm -rf $$TDIR; \
	rm $$TGZ

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
.unit.lint: $(UNITTESTSRC) $(SRC)
.unit.lint: 
	npm run lint 
	touch .unit.lint


.unit.local: $(UNITTESTSRC) $(SRC)
.unit.local: .unit.lint
.unit.local: 
	npm run unit	
	touch .unit.local

sonar:
	echo ==== sonarqube && sonar-scanner -Dproject.settings=$$HOME/.sonar/sonar-project.properties  $$(cat sonar.properties) 

############################################################
# Integration Tests
.integration.aws: .unit.local
.integration.aws: .install.terraform 
.integration.aws: $(INTTESTSRC) $(SRC)
.integration.aws:
	npm run aws
	touch .integration.aws

.integration.service: .unit.local
.integration.service: .install.terraform
.integration.service: .integration.aws
.integration.service:  $(INTTESTSRC) $(SRC)
.integration.service:
	npm run service
	touch .integration.service

############################################################
# Clean
clean.terraform:
	rm -f .install.terraform $(package)

clean.local:
	rm -f test/test.output .unit.local .integration.aws

############################################################
# Init
init:
	npm install --save-dev npm # update npm
	npm install --save-dev jest
	npm install --save-dev jest-each
	npm install --save-dev eslint-plugin-jest
	npm install --save-dev eslint-config-airbnb-base
	npm install --save-dev aws-sdk
	npm install --save-dev aws-sdk-mock
	npm install --save-dev supertest
	npm install --save-dev serverless
	npm install string-hash
	npm install log-driver
	npm install
	terraform init
	terraform get

# npm info "eslint-config-airbnb-base@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "eslint-config-airbnb-base@latest"

############################################################
environment: .environment.terraform

package: $(PACKAGE)

install: .install.terraform

test: unit integration

unit: .unit.lint
unit: .unit.local

integration: .unit.local
integration: .integration.aws
integration: .integration.service

clean: clean.terraform clean.local

veryclean:  clean
	terraform destroy

