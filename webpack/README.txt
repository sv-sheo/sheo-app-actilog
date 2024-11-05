HOW TO USE

from sheo SITE app root - i.e. /SITES/sheo/apps/some-app

run this command:

	node webpack <action> <mode>


action: possible values: run or watch
	
		run: 	create build once
		watch:	create build, start watching for changes AND boot up webpack-dev-server -> doesnt create file itself - serves it into memory for DEVELPMENT, to have final fila, use run

mode: possible values: dev or prod                  default dev

TL;DR

node webpack run            - DO NOT USE
node webpack run prod       - prod desktop

node webpack watch		    - USE FOR DEVELOPMENT
node webpack watch prod		- DO NOT USE