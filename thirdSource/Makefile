PACKAGEROOT=/Users/mdecorte/Documents/Development/Lambda/thirdSource

include $(PACKAGEROOT)/config/make.header

#############################################################
SRC=

UNITTESTSRC= 

INTTESTSRC= 

TFSOURCE=\
	thirdSource.tf

PACKAGE=

SUBPACKAGES=\
	common 				\
	party

# error', 'warn', 'info', 'debug', and 'trace'
LOG_LEVEL=error


############################################################
all: .all

init: .init
init:
	npm install --save-dev npm
	npm install --save-dev jest
	npm install --save-dev jest-each
	npm install --save-dev eslint-plugin-jest
	npm install --save-dev eslint-config-airbnb-base
	npm install --save-dev aws-sdk
	npm install --save-dev aws-sdk-mock
	npm install --save-dev supertest
	terraform init
	terraform get

unit: .unit

package: .package

environment: .environment

install: .install

integration: .integration

test: .test

clean: .clean

veryclean: .veryclean

include $(PACKAGEROOT)/config/make.footer
