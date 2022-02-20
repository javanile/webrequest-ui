#!make

## ===
## NPM
## ===

publish:
	@git add .
	@git commit -am "Commit before publish"
	@npm unpublish webrequest-ui@$$(npm pkg get version)
	@npm version patch
	@npm publish

## ======
## Docker
## ======

stop:
	@docker stop $$(docker ps | grep ":8080" | cut -c1-12)

## ====
## Test
## ====

test-form:
	@docker run --rm -it -d -p 8080:80 -v $$PWD:/usr/local/apache2/htdocs httpd:alpine > /dev/null
	@echo "Visit http://localhost:8080/test/webrequest-form.html to upgrade core form"
