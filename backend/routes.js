/*jslint node: true */
'use strict';

var bodyParser = require('body-parser');

module.exports = function (app) {
	app.use(bodyParser.json());
	
	app.get('/greeting', function (req, res) {
		var qs = req.query;
		res.json({greeting: 'Hello ' + qs.name + '!'});
		res.end();
	});
};