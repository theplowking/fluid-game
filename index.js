var express = require('express');
var server = express();

const port = 3000;

server.use('/', express.static(__dirname + '/src'));


server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });