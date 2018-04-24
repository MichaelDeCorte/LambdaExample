PACKAGEROOT=/Users/mdecorte/Documents/Development/Lambda/thirdSource

include $(PACKAGEROOT)/config/make.header

#############################################################
SRC=

UNITTESTSRC= 

INTTESTSRC= 

TFSOURCE=\
	thirdSource.tf

PACKAGE=

SUBPACKAGES=party

# error', 'warn', 'info', 'debug', and 'trace'
LOG_LEVEL=error


############################################################
# Init
init:
	npm install --save-dev npm
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


include $(PACKAGEROOT)/config/make.footer
