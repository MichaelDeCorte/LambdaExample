PACKAGEROOT=/Users/mdecorte/Documents/Development/Lambda/thirdSource
include $(PACKAGEROOT)/config.make/make.header

#############################################################

# LOG_LEVEL=trace

SRC= \
	src/party.js					\
	src/getParty.js					\
	src/putParty.js					\
	src/putPartyPre.js				\
	src/scanParty.js				\
	src/scanPartyPre.js

UNITTESTSRC= \
	test/getParty-unit.test.js		\
	test/getParty-unit.test.json	\
	test/putParty-unit.test.js		\
	test/putParty-unit.test.json	\
	test/scanParty-unit.test.js		\
	test/scanParty-unit.test.json

INTTESTSRC= \
	test/putGetParty-api.test.js 	\
	test/putGetParty-api.test.json	\
	test/putGetParty-uri.test.js 	\
	test/putGetParty-uri.test.json 	\
	test/putScanParty-api.test.js	\
	test/putScanParty-api.test.json	\
	test/putScanParty-uri.test.js	\
	test/putScanParty-uri.test.json		

TFSOURCE=\
	party.tf

PACKAGE=party-0.0.1.zip

SUBPACKAGES=

############################################################


all: node_modules/common
all: node_modules/methodRouter
all: node_modules/common.test

init: node_modules/common
init: node_modules/methodRouter
init: node_modules/common.test

init: npm.init

npm.init:
	npm install --save-dev
	npm install  promise
	npm install string-hash
	npm install  joi
	npm install --save-dev supertest


unit:

environment: 

install: 

integration: 

test: 

clean:

veryclean: 

node_modules/common:
	npm install ../common

node_modules/methodRouter: 
	npm install ../methodRouter

node_modules/common.test: 
	npm install ../common.test

$(PACKAGE): node_modules/common
$(PACKAGE): node_modules/methodRouter
$(PACKAGE): node_modules/common.test


############################################################
include $(PACKAGEROOT)/config.make/make.footer


