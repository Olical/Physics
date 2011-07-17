default: validate compress
develop: validate

validate:
	@@echo 'Validating'
	@@node build/validate.js Physics.js;

compress:
	@@echo 'Compressing'
	@@java -jar build/compiler.jar --js Physics.js --js_output_file Physics.min.js