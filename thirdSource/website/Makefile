PACKAGEROOT=/Users/mdecorte/Documents/Development/Lambda/thirdSource

include $(PACKAGEROOT)/config.make/make.header

SRC=

UNITTESTSRC= 

INTTESTSRC= 

TFSOURCE=\
	terraform.tf

PACKAGE=

SUBPACKAGES=

HASHFILE=.package.file


############################################################

init: 
init:
	npm install --save-dev
	npm install --save-dev @angular/cli

# 	npm install typescript@">=3.1.1 <3.3.0" 
# 	npm install --save-dev @angular/cli
# 	npm install --save-dev @angular/compiler
# 	npm install --save-dev @angular/compiler-cli
# 	npm install --save-dev @angular-devkit/build-angular
# 	npm install --save-dev @angular/core
# 	npm install --save-dev @angular/common
# 	npm install --save-dev @angular/router
# 	npm install --save-dev @angular/platform-browser
# 	npm install --save-dev @angular/forms
# 	npm install --save-dev @angular/platform-browser-dynamic
# #	npm install --save-dev @angular/platform-browser-dynamic/testing


	# npm install --save-dev
	# npm install typescript@2
	# npm install --save-dev @angular/cli@1.5
	# npm install --save-dev @angular/compiler
	# npm install --save-dev @angular/compiler-cli
	# npm install --save-dev @angular-devkit/build-angular
	# npm install --save-dev @angular/core
	# npm install --save-dev @angular/common
	# npm install --save-dev @angular/router
	# npm install --save-dev @angular/platform-browser
	# npm install --save-dev @angular/forms
	# npm install --save-dev @angular/platform-browser-dynamic
	# npm install --save-dev @angular/platform-browser-dynamic/testing



unit: 

package: $(HASHFILE)

$(HASHFILE): dist $(shell find src -name '*.js' -o -name '*.ts' -o -name '*.html' -o -name '*.png' -o -name '*.jpg' -o -name '*.pdf' -o -name '*.svg' -o -name '*.')
	ng build
	echo >> $(HASHFILE) # change the hash value
	touch .package.file


environment: 

install: 

integration: 

test: 
test: test.website

test.website:
	echo ng test

clean: clean.local

clean.local:
	rm -f $(HASHFILE)
	rm -rf dist/*

veryclean: 

include $(PACKAGEROOT)/config.make/make.footer
