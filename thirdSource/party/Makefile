PACKAGEROOT=/Users/mdecorte/Documents/Development/Lambda/thirdSource
include $(PACKAGEROOT)/config/make.header

#############################################################

# LOG_LEVEL=trace

SRC= \
	src/party.js					\
	src/getParty.js					\
	src/putParty.js

UNITTESTSRC= \
	test/getParty-unit.test.js		\
	test/getParty-unit.test.json	\
	test/putParty-unit.test.js		\
	test/putParty-unit.test.json

INTTESTSRC= \
	test/putGetParty-aws.test.js 	\
	test/putGetParty-aws.test.json	\
	test/putGetParty-service.test.js 	\
	test/putGetParty-service.test.json 

TFSOURCE=\
	party.tf

PACKAGE=party-0.0.1.zip

SUBPACKAGES=

############################################################

all: unit package integration test

init: .init
init:
	npm install promise
	npm install string-hash

node_modules/common: ../common/common-0.0.1.tgz
	set -v; npm install -f ../common/common-0.0.1.tgz

.unit: node_modules/common
unit: .unit

package: .package
package: node_modules/common

environment: .do_no_run

install: .do_no_run

integration: .integration

test: .test

clean: .clean

veryclean: .veryclean

$(PACKAGE):: ../common/common-0.0.1.tgz
	npm install $?

$(PACKAGE):: $(SRC)
	$(call jsToZip, $(PACKAGE))


############################################################
include $(PACKAGEROOT)/config/make.footer


