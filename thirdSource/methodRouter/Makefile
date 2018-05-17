PACKAGEROOT=/Users/mdecorte/Documents/Development/Lambda/thirdSource
include $(PACKAGEROOT)/config/make.header

# LOG_LEVEL=error
#############################################################
SRC= \
	src/methodRouter.js

UNITTESTSRC= \
	test/methodRouter-unit.test.js

INTTESTSRC= 

TFSOURCE=

PACKAGE=methodRouter-0.0.1.zip

SUBPACKAGES=


############################################################

all: unit package integration test

init: .init
	npm install --save-dev joi
	npm install --save-dev promise # --save-dev because it's install with other packages
	npm install --save ../common
	npm link

.unit: node_modules/common
unit: .unit

package: .package

environment: .do_no_run

install: .do_no_run

integration: 

test: .test

clean: .clean

veryclean: .veryclean

node_modules/common:
	npm install --save-dev ../common

# node_modules/common: ../common/common-0.0.1.tgz
# 	npm install -f ../common/common-0.0.1.tgz

# $(PACKAGE): node_modules/common

$(PACKAGE): $(SRC)
	$(call jsToZip, $(PACKAGE))


############################################################
include $(PACKAGEROOT)/config/make.footer


