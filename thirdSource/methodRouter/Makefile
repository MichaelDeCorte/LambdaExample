PACKAGEROOT=/Users/mdecorte/Documents/Development/Lambda/thirdSource
include $(PACKAGEROOT)/config.make/make.header

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

all: 

all: node_modules/common

init: npm

npm:
	npm install
	npm install --save-dev joi
	npm install --save-dev promise # --save-dev because it's install with other packages
	npm install --save ../common
	npm link

unit:

package:

environment: 

install: 

integration: 

test: 

clean: 

veryclean: 

node_modules/common:
	npm install --save-dev ../common

############################################################
include $(PACKAGEROOT)/config.make/make.footer


