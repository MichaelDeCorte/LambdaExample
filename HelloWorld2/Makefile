
SRC=main.js
PACKAGE=HelloWorld.zip
TESTOUTPUT=testOutput.txt

all: install package

$(PACKAGE): $(SRC)
	zip -r $@ $<

package: $(PACKAGE)

terraform.tfstate: $(PACKAGE)
	terraform apply

install: terraform.tfstate $(PACKAGE)

$(TESTOUTPUT): terraform.tfstate $(PACKAGE) 
	sh ./test.sh

test: $(TESTOUTPUT)

init:
	terraform init
	terraform get

clean:
	rm -f $(PACKAGE) $(TESTOUTPUT)

veryclean: 
	terraform destroy
	rm -f $(PACKAGE) $(TESTOUTPUT)

