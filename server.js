var mongoose = require('mongoose');
var User = require('./models/user-model');
var Calorie = require('./models/entry-model');

var express = require("express");
// var exphbs = require('express-handlebars'),
// var logger = require('morgan'),
// var cookieParser = require('cookie-parser'),
// var bodyParser = require('body-parser'),
// var methodOverride = require('method-override'),
// var session = require('express-session'),
// var passport = require('passport'),
// var LocalStrategy = require('passport-local'),
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var Q = require('q');
var app = express();

//port
var port = 3000;

//ip
var ip = "127.0.0.1";

app.use(express.static(__dirname));
app.use(cookieParser());


var messages = []

var connStr = 'mongodb://localhost:27017/calorieTracker';
mongoose.connect(connStr, function(err) {
  if (err) throw err;
  console.log('Successfully connected to MongoDB');
});

var genuuid = function() {
  var s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// app.use(session({
//   genid: function(req) {
//     return genuuid()
//   },
//   secret: 'closed doors',
//   resave: false,
//   saveUninitialized: false,
//   store: new MongoStore({url: connStr})
// }));

app.post('/saveEntry', function (req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.status(201);
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    data = JSON.parse(data);
    console.log(data);
    res.end(JSON.stringify({results: messages}));
  });
});

app.post('/createUser', function (req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.status(201);
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    data = JSON.parse(data);
    console.log(data['id']);
    console.log(data);
    User.findOne({ username: data['id']}, function(err, user) {
      if (err) throw err;
      if (user === null) {
        var newUser = new User({
          username: data['id'],
          password: data['password'],
          expectedCalories: data['calories']
        });
        newUser.save(function(err) {
          if (err) throw err;
        });
        res.end(JSON.stringify({newUser: true}));
      } else {
        res.end(JSON.stringify({newUser: false}));
      }
    })
  });
});

app.post('/login', function (req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.status(201);
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    data = JSON.parse(data);

    User.findOne({ username: data['id']}, function(err, user) {
      if (err) throw err;
      console.log(user);
      // test a matching password
      user.comparePassword(data['password'], function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          Q.fcall(function() {
            console.log('session starter');
            app.use(session({
              genid: function(req) {
                return genuuid()
              },
              secret: 'closed doors',
              resave: false,
              saveUninitialized: false,
              store: new MongoStore({url: connStr})
            }));
          }).then(function() {
            console.log('session ' + JSON.stringify(req.session));
            res.end(JSON.stringify({isMatch: isMatch}));
          })
        } else {
          console.log('session ' + JSON.stringify(req.session));
          res.end(JSON.stringify({isMatch: isMatch}));
        }

      });

    });

  });
});

//log where we are listening
console.log("Listening on http://" + ip + ":" + port);

app.listen(port, ip);
