PACKAGEROOT=/Users/mdecorte/Documents/Development/Lambda/thirdSource

include $(PACKAGEROOT)/config.make/make.header

#############################################################

# LOG_LEVEL=false
# LOG_LEVEL=error
# LOG_LEVEL=warn
# LOG_LEVEL=info
# LOG_LEVEL=debug
# LOG_LEVEL=trace

SRC=

UNITTESTSRC= 

INTTESTSRC= 

TFSOURCE=\
	terraform.tf

PACKAGE=

SUBPACKAGES=\
	environment			\
	common 				\
	common.test			\
	methodRouter		\
	party				\
	website


############################################################
all: 

init: npm.init terraform.init

npm.init:
	npm install 
	npm install --save-dev npm
	npm install --save-dev @angular/cli
	npm install --save-dev --save-exact jest@21.1.0
	npm install --save-dev --save -exact jest-each@0.3.1
	npm install --save-dev eslint@latest
	npm install --save-dev eslint-plugin-jest@latest
	npm install --save-dev eslint-config-airbnb-base@latest
	npm install --save-dev eslint-plugin-import@latest 
	npm install --save-dev aws-sdk
	npm install --save-dev aws-sdk-mock
	npm install --save-dev amazon-cognito-identity-js
	npm install --save-dev node-fetch # required by above which assumes to be run on a browser not node
	npm install --save-dev supertest
	npm install --save-dev jsonlint
	npm install --save-dev bundle-deps
	npm install --save-dev supertest
	npm install --save-dev log-driver
	npm install --save-dev joi
	npm install --save-dev promise
	npm install environment
	npm install common
	npm install common.test
	npm install methodRouter


terraform.init:
	terraform init -upgrade
	terraform get -update=true

unit: 

package: 

environment: terraform

install: 

integration: 

test: 

clean: 

veryclean: veryclean.terraform

include $(PACKAGEROOT)/config.make/make.footer
