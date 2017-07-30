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


app.get('/', function (req, res) {
  res.send('Hello World!')
  console.log("Hello World")
})

app.get('/cuisine', function(req, res){
  console.log('test')

  var options = { method: 'GET',
    url: 'https://api.eatstreet.com/publicapi/v1/restaurant/search',
    qs: 
     { method: 'delivery',
       'pickup-radius': '5',
       search: 'chinese',
       'street-address': '10501 Stokes Avenue, Cupertino, CA, 95014',
       'access-token': 'eeef884f9fe78292' },
    headers: 
     { 'postman-token': 'b2176e9b-640d-3d43-a302-ee245ccb13b0',
       'cache-control': 'no-cache',
       'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  };
  
  var restaurants = null
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    restaurants = body;
  });
  
  console.log(restaurants)
  

});

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port 3000!')
})