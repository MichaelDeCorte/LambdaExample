# PACKAGEROOT=/Users/mdecorte/Documents/Development/Lambda/thirdSource
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

NODE_MODULES = \
	common 							\
	methodRouter					\
	common.test						\
	environment

############################################################

init: npm.init

npm.init:
	npm install
	# npm install promise
	# npm install string-hash
	# npm install joi

unit:

environment: 

install: 

integration: 

test:

clean:

veryclean: 

############################################################
include $(PACKAGEROOT)/config.make/make.footer


