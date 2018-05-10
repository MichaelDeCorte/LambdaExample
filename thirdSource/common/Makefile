PACKAGEROOT=/Users/mdecorte/Documents/Development/Lambda/thirdSource
include $(PACKAGEROOT)/config/make.header

# LOG_LEVEL=error
#############################################################
SRC= \
	src/index.js					\
	src/methodRouter.js				\
	src/logger.js					\
	src/validator.js				\
	src/guid.js

UNITTESTSRC= \
	test/guid-unit.test.js			\
	test/methodRouter-unit.test.js

INTTESTSRC= 

TFSOURCE=

PACKAGE=common-0.0.1.zip

SUBPACKAGES=


############################################################

all: unit package integration test

init: .init
	npm install log-driver  
	npm install --save-dev joi
	npm install --save-dev promise # --save-dev because it's install with other packages
	npm link

unit: .unit

package: .package

environment: .do_no_run

install: .do_no_run

integration: 

test: .test

clean: .clean

veryclean: .veryclean

$(PACKAGE): $(SRC)
	$(call jsToZip, $(PACKAGE))


############################################################
include $(PACKAGEROOT)/config/make.footer


