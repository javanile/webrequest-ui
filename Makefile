#!make

## ======
## GitHub
## ======

push: build
	@git add .
	@git commit -am "New release" || true
	@git push

## ===
## NPM
## ===

build:
	@npm run build

publish:
	@git add .
	@git commit -am "Commit before publish" || true
	@npm unpublish -f webrequest-ui@$$(npm pkg get version | cut -d'"' -f2) || true
	@npm version patch
	@npm publish

## ======
## Docker
## ======

stop:
	@docker stop $$(docker ps | grep ":8080" | cut -c1-12) || true

## ====
## Test
## ====

test-form: stop
	@docker run --rm -it -d -p 8080:80 -v $$PWD:/usr/local/apache2/htdocs httpd:alpine > /dev/null
	@echo "Visit http://localhost:8080/test/webrequest-form.html to upgrade core form"
