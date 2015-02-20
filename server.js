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
var morgan = require("morgan");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
// var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var Q = require('q');
var app = express();

//port
var port = process.env.PORT || 3000;

//ip
var ip = "127.0.0.1";

app.use(express.static(__dirname));
// app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});


var messages = [];

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

// app.post('/authenticate', function(req, res) {
//   User.findOne({username: req.body.id, password: req.body.password}, function(err, user) {
//     if (err) {
//       res.json({
//         type: false,
//         data: "Error occured: " + err
//       });
//     } else {
//       if (user) {
//         res.json({
//           type: true,
//           data: user,
//           token: user.token
//         });
//       } else {
//         res.json({
//           type: false,
//           data: "Incorrect email/password"
//         });
//       }
//     }
//   });
// });

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
    console.log('data ', data);
    User.findOne({ username: data['id']}, function(err, userFind) {
      if (err) throw err;
      if (userFind === null) {
        var newUser = new User({
          username: data['id'],
          password: data['password'],
          expectedCalories: data['calories'],
          // token: genuuid()
          token: jwt.sign(data['id'], "MY_SECRET")
        });
        newUser.save(function(err, userSave) {
          if (err) throw err;
          res.end(JSON.stringify({newUser: true, token: userSave.token}));
        });
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
          // User.update({username: data['id']}, {token: jwt.sign(user, "MY_SECRET")})
          res.end(JSON.stringify({isMatch: isMatch, token: jwt.sign(user, "MY_SECRET")}));
        } else {
          // console.log('session ' + JSON.stringify(req.session));
          res.end(JSON.stringify({isMatch: isMatch}));
        }

      });

    });

  });
});

//log where we are listening
console.log("Listening on http://" + ip + ":" + port);

app.listen(port, ip);
