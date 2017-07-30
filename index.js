var express = require('express')
var request = require("request");
var admin = require('firebase-admin')

var app = express()

var serviceAccount = require("./config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lunchbox-569d7.firebaseio.com"
});

var db = admin.database();
var ref = db.ref('Nihal')


app.get('/', function(req, res) {
  res.send('Hello World!')
  console.log("Hello World")
})

app.get('/cuisine', function(req, res) {
  console.log('test')

  var options = {
    method: 'GET',
    url: 'https://api.eatstreet.com/publicapi/v1/restaurant/search',
    qs: {
      method: 'delivery',
      'pickup-radius': '5',
      search: 'chinese',
      'street-address': '500 Ben Franklin Ct., San Mateo, CA, 94401',
      'access-token': 'eeef884f9fe78292'
    },
    headers: {
      'postman-token': 'b2176e9b-640d-3d43-a302-ee245ccb13b0',
      'cache-control': 'no-cache',
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    },
  };

  var restaurant = null

  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    body = JSON.parse(body).restaurants;
    var name = body[0].name;
    var apiKey = body[0].apiKey;

    var request = require("request");

    var options = {
      method: 'GET',
      url: 'https://api.eatstreet.com/publicapi/v1/restaurant/'+apiKey+'/menu',
      qs: {
        'access-token': 'eeef884f9fe78292',
        includeCustomizations: 'false'
      },
    };
    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      body = JSON.parse(body);
      console.log(body[0].items[0]);
    });
  });
});

app.listen(process.env.PORT, function() {
  console.log('Example app listening on port 3000!')
})
