# Makefile for web deployment

all: PutHTML

PutHTML:
	cp float.html /var/www/html/floatmaster/
	cp float.css /var/www/html/floatmaster/
	cp float.js /var/www/html/floatmaster/
	
	echo "Current contents of your HTML directory: "
	ls -l /var/www/html/floatmaster/
