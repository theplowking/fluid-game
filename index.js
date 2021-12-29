var express = require('express');
var server = express();

server.use('/', express.static(__dirname + '/src'));


server.listen(process.env.PORT || 8080);