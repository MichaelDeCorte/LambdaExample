#############################################################
SRC=src/main.js
TFSOURCE=HelloWorld.tf
PACKAGE=HelloWorld.zip

all: package install

############################################################
# Environment
.environment.terraform: $(PACKAGE)
.environment.terraform: $(TFSOURCE)
.environment.terraform: 
	terraform apply &&  \
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
	terraform apply && \
	touch .install.terraform

############################################################
# Test
.test.local:  terraform.tfstate .package.terraform .install.terraform
.test.local:
	( npm run lint && 										\
	npm run test && 										\
	npm run coverage &&										\
	touch .test.local 										\
	) 2>&1 | tee -a src/test.output 


############################################################
# Clean
clean.terraform:
	rm -f .package.terraform .install.terraform $(package)

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

package: .package.terraform

install: .install.terraform

test: .test.local

clean: clean.terraform clean.local

veryclean:  clean
	terraform destroy

