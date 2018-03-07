
SRC=main.js
PACKAGE=HelloWorld.zip
TESTOUTPUT=testOutput.txt

all: install package

package: 
	@ARN=$$(aws codebuild start-build --project-name HelloWorld --output json  | sed -n 's@^[[:blank:]]*"arn":.*"\(.*\)"$$@\1@p'); \
	BUILDCOMPLETE=false; \
	while [ $$BUILDCOMPLETE == false ] ;\
	do \
		BUILDCOMPLETE=$$(aws codebuild batch-get-builds --ids $$ARN --output json | sed -n 's@[[:space:]]*"buildComplete": \(.*\),@\1@p') ; \
		echo Build In Progress ; \
		sleep 1; \
	done ; \
	BUILDSTATUS=$$(aws codebuild batch-get-builds --ids $$ARN --output json | sed -n 's@[[:space:]]*"buildStatus": "\(.*\)",@\1@p') ; \
	aws codebuild batch-get-builds --ids $$ARN --output json ; \
	echo $$BUILDSTATUS 

terraform.tfstate: $(PACKAGE)
	terraform apply

install: terraform.tfstate $(PACKAGE)

$(TESTOUTPUT): terraform.tfstate $(PACKAGE) 
	sh ./test.sh

test: $(TESTOUTPUT)

init:
	terraform init
	terraform get
	terraform refresh

clean:
	rm -f $(PACKAGE) $(TESTOUTPUT)

veryclean: 
	terraform destroy
	rm -f $(PACKAGE) $(TESTOUTPUT)

$(PACKAGE): $(SRC)
	zip -r $@ $<
