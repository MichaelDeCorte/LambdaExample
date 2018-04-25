PACKAGEROOT=/Users/mdecorte/Documents/Development/Lambda/thirdSource
include $(PACKAGEROOT)/config/make.header

#############################################################
SRC= \
	src/index.js					\
	src/methodRouter.js				\
	src/logger.js					\
	src/guid.js

UNITTESTSRC=

INTTESTSRC= 

TFSOURCE=

PACKAGE=common-0.0.1.zip

SUBPACKAGES=

NPMPACKAGES= \
	log-driver \
	promise

############################################################

all: unit package integration test

init: .init

unit: .unit

package: .package

environment: .do_no_run

install: .do_no_run

integration: 

test: .test

clean: .clean

veryclean: .veryclean

$(PACKAGE):: $(SRC)
	$(call jsToZip, $(PACKAGE))


############################################################
include $(PACKAGEROOT)/config/make.footer


