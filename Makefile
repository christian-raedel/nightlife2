all: clean install test

install:
	@echo "************************"
	@echo "* INSTALL DEPENDENCIES *"
	@echo "************************"
	@npm install --python=/usr/bin/python2.7

test:
	@echo "************************"
	@echo "* TEST LIBRARY         *"
	@echo "************************"
	@cat .dev-logo
	@./node_modules/.bin/mocha --recursive test/*.spec.js
	@./node_modules/.bin/webpack --progress

clean:
	@echo "************************"
	@echo "* CLEANUP DIRECTORY    *"
	@echo "************************"
	-@rm -rf ./node_modules
	-@rm -f ./client/bundle.js

.PHONY: all install test
