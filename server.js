/*jslint node: true, nomen: true, es5: true*/
'use strict';

var express = require('express')
var app = express();
var chalk = require('chalk');
var port = 8080;

require('./backend/routes.js')(app);
require('./backend/paths.js')(app);

app.listen(port);
console.log(chalk.green("Server is now listening on port: ") + chalk.magenta(port));