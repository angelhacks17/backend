var express = require('express')
var request = require("request");
var admin = require('firebase-admin')

var app = express()

app.set('port', (process.env.PORT || 5000));

var serviceAccount = require("./config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lunchbox-569d7.firebaseio.com"
});

var db = admin.database();
var ref = db.ref('Gautam').child('Cuisine')
var ACCESS_TOKEN;

app.get('/', function(req, res) {
  res.send('hello world')
})

app.get('/initial', function(req, res) {
  res.send("Greek");
  /*ref.child('initial').on("value", function(snapshot) {
    console.log(snapshot.val());
    //res.send(snapshot.val());
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });*/
});

app.get('/cuisine', function(req, res) {
  
  var options = {
    method: 'POST',
    url: 'https://api.yelp.com/oauth2/token',
    qs: {
      grant_type: 'client_credentials',
      client_id: 'vRSLRJhyDLQuyMD6K_4bBA',
      client_secret: '6VEdUwbuuvzmicA62x06asYwxX60r0rSav5SeXPkxDbzLsGaHDdZWM1TSnKpp4f3'
    }
  };
  request(options, function(error, response, body) {
    console.log(body);
    body = JSON.parse(body);
    ACCESS_TOKEN = body.access_token;
    console.log(ACCESS_TOKEN);
    
  });
  console.log("Hello World");
  
  console.log('test');
  var $data = {}

  var options = {
    method: 'GET',
    url: 'http://angelhacks17-imitra.c9users.io:8080/'
  }

  var recommended;
  
  request(options, function(error, response, body) {
   recommended = body;
   var options = {
    method: 'GET',
    url: 'https://api.yelp.com/v3/businesses/search',
    qs: {
      term: 'restaurants',
      latitude: 37.563106,
      longitude: -122.325028,
      radius: 4000,
      categories: recommended.toLowerCase(),
      limit: 3,
      sort_by: 'rating',
      open_now: true
    },
    'auth': {
      'bearer': ACCESS_TOKEN
    }
  };
  
  request(options, function(error, response, body) {
      body = JSON.parse(body);
      console.log(body.businesses[0]);
      var business = body.businesses[0];
      var recommendedString = '' + recommended;
      
      var data = {
          [recommendedString]: {
            'Meals': body.businesses
          }
      }
      
      ref.push(data);
      res.send(data);
    });
    
    
  
  });
  
   


});

app.get('/order', function(req, res) {
  var options = {
    method: 'POST',
    url: 'https://api.eatstreet.com/publicapi/v1/send-order',
    qs: {
      restarauntApiKey: '90fd4587554469b1f15b4f2e73e761809f4b4bcca52eedca',
      'items': [{
        "apiKey": "35194",
        "customizationChoices": [{
          "apiKey": "77227393"
        }],
        "comments": "Pile it high!"
      }],
      'method': "delivery",
      'payment': 'card',
      'access-token': 'eeef884f9fe78292',
      "test": "false",
      "card": {
        "apiKey": null
      },
      "address": {
        "apiKey": null
      },
      "recipient": {
        "apiKey": "485ca34bedf9153e7ecdb0c1c698d2cee41ee9406039e889"
      }
    },
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    console.log(body);

  });
});

app.listen(process.env.PORT, function() {
  console.log('Example app listening on port 3000!')
})
