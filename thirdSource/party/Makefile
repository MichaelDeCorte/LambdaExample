PACKAGEROOT=/Users/mdecorte/Documents/Development/Lambda/thirdSource
include $(PACKAGEROOT)/config/make.header

#############################################################
SRC= \
	src/party.js					\
	src/logger.js						\
	src/guid.js

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

NPMPACKAGES= string-hash log-driver

############################################################

$(PACKAGE): $(SRC)
	$(jsToZip)


############################################################
include $(PACKAGEROOT)/config/make.footer


