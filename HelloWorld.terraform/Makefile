#############################################################
SRC=src/main.js
TESTSRC= \
		test/main-aws.test.js 		\
		test/main-aws.test.json 	\
		test/main-unit.test.js		\
		test/main-unit.test.json

TFSOURCE=HelloWorld.tf
PACKAGE=HelloWorld.zip

all: package install

############################################################
# Environment
.environment.terraform: $(PACKAGE)
.environment.terraform: $(TFSOURCE)
.environment.terraform: 
	terraform apply -auto-approve &&  \
	touch .environment.terraform

############################################################
# Package
.package.terraform: $(PACKAGE)

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
# Test
.test.local:  terraform.tfstate .package.terraform .install.terraform
.test.local: $(TESTSRC)
.test.local:
	( npm run lint  									&&	\
	npm run test 	 									&&	\
	npm run coverage 									&&	\
	touch .test.local 									&&	\
	sonar-scanner -Dproject.settings=$$HOME/.sonar/sonar-project.properties  $$(cat sonar.properties) \
	) 2>&1 | tee -a test/test.output 


############################################################
# Clean
clean.terraform:
	rm -f .package.terraform .install.terraform $(package)

clean.local:
	rm -f test/test.output 

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

test: .test.local

clean: clean.terraform clean.local

veryclean:  clean
	terraform destroy

