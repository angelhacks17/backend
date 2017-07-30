var config = require('./config');
var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();

app.use(express.static('public'));


app.get('/', function(req, res) {
  console.log("test");
  res.render(path.join(__dirname, 'views', 'login.ejs'));
});


app.listen(process.env.PORT, function(err) {
  if (err) {
    return console.error(err);
  }
  console.log('app listening on ' + config.PORT);
})
