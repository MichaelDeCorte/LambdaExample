PACKAGEROOT=/Users/mdecorte/Documents/Development/Lambda/thirdSource
include $(PACKAGEROOT)/config.make/make.header

#############################################################

# LOG_LEVEL=trace

SRC= \
	src/authenticateTestUser.js


UNITTESTSRC= \
	test/authenticateTestUser.unit.test.js

INTTESTSRC= 

TFSOURCE=

PACKAGE=common_test-0.0.1.zip

SUBPACKAGES=

############################################################

all: 

all: node_modules/common

init: npm

npm:
	npm install
	npm install promise
	npm install joi

unit: 

package: 

environment: 

install: 

integration: 

test: 

clean: 

veryclean: 

node_modules/common: ../common
	npm install ../common

$(PACKAGE): node_modules/common


############################################################
include $(PACKAGEROOT)/config.make/make.footer


