/*jslint node: true, nomen: true, es5: true*/
'use strict';

var express = require('express');
var app = express();
var chalk = require('chalk');
var port = 8080;

require('./backend/routes.js')(app);

app.use(express.static(__dirname + '/public'));
app.use('/angular', express.static(__dirname + '/node_modules/angular'));
app.use('/angular-animate', express.static(__dirname + '/node_modules/angular-animate'));
app.use('/angular-aria', express.static(__dirname + '/node_modules/angular-aria'));
app.use('/angular-route', express.static(__dirname + '/node_modules/angular-route'));
app.use('/angular-material', express.static(__dirname + '/node_modules/angular-material'));
app.use('/angular-material-icons', express.static(__dirname + '/node_modules/angular-material-icons'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/favicon.ico', express.static(__dirname + '/images/favicon.ico'));

app.listen(port);
console.log(chalk.green("Server is now listening on port: ") + chalk.magenta(port));