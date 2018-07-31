PACKAGEROOT=/Users/mdecorte/Documents/Development/Lambda/thirdSource
include $(PACKAGEROOT)/config/make.header

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
	test/putScan-unit.test.js		\
	test/putScan-unit.test.json

INTTESTSRC= \
	test/putGetParty-api.test.js 	\
	test/putGetParty-api.test.json	\
	test/putGetParty-uri.test.js 	\
	test/putGetParty-uri.test.json 	\
	test/putScan-api.test.js		\
	test/putScan-api.test.json		\
	test/putScan-uri.test.js		\
	test/putScan-uri.test.json		

TFSOURCE=\
	party.tf

PACKAGE=party-0.0.1.zip

SUBPACKAGES=

############################################################

all: unit package

init: .init
init:
	npm install promise
	npm install string-hash
	npm install joi

.unit: node_modules/common
.unit: node_modules/methodRouter

npm.unit: node_modules/methodRouter
unit: .unit

package: .package

environment: .do_no_run

install: .do_no_run

integration: 

test: 

clean: .clean

veryclean: .veryclean

node_modules/common: ../common/common-0.0.1.tgz
	npm install -f ../common/common-0.0.1.tgz

node_modules/methodRouter: ../methodRouter/methodRouter-0.0.1.tgz
	npm install -f ../methodRouter/methodRouter-0.0.1.tgz

# $(PACKAGE): node_modules/common
# $(PACKAGE): node_modules/methodRouter

$(PACKAGE): $(SRC)
	$(call jsToZip, $(PACKAGE))


############################################################
include $(PACKAGEROOT)/config/make.footer


