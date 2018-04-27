PACKAGEROOT=/Users/mdecorte/Documents/Development/Lambda/thirdSource
include $(PACKAGEROOT)/config/make.header

# LOG_LEVEL=trace
#############################################################
SRC= \
	src/party.js					\
	src/putParty.js

UNITTESTSRC= \
	test/putParty-unit.test.js		\
	test/putParty-unit.test.json

INTTESTSRC= \
	test/putParty-aws.test.js 		\
	test/putParty-aws.test.json

TFSOURCE=\
	party.tf

PACKAGE=party-0.0.1.zip

SUBPACKAGES=

############################################################

all: unit package integration test

init: .init
init:
	npm install string-hash
	npm install log-driver
	npm install promise
	npm install ../common/common-0.0.1.tgz

unit: .unit

package: .package

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


