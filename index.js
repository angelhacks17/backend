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
var ref = db.ref('Gautam');


app.get('/', function(req, res) {
  res.send('Hello World!')
  console.log("Hello World")
})

app.get('/initial', function(req, res) {
  ref.child('initial').on("value", function(snapshot) {
    console.log(snapshot.val());
    res.send(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});

app.get('/cuisine', function(req, res) {
  console.log('test')

  var options = {
    method: 'GET',
    url: 'http://angelhacks17-imitra.c9users.io:8080/'
  }
  
  var recommended;
  
  request(options, function(error, response, body) {
      recommended = body;
  });
  

  var options = {
    method: 'GET',
    url: 'https://api.eatstreet.com/publicapi/v1/restaurant/search',
    qs: {
      method: 'delivery',
      'pickup-radius': '5',
      search: recommended,
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
      console.log('output' + JSON.stringify(body[0].items[0]));
      res.send(JSON.stringify(body[0].items[0]));
    });
  });
});

app.listen(process.env.PORT, function() {
  console.log('Example app listening on port 3000!')
})
