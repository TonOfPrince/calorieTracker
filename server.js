var mongoose = require('mongoose');
var User = require('./models/user-model');
var Entry = require('./models/entry-model');

var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var cookieParser = require('cookie-parser');
var Q = require('q');
var app = express();

//port
var port = process.env.PORT || 3000;

//ip
var ip = "127.0.0.1";

app.use(express.static(__dirname));

app.use(morgan("dev"));
// CORS
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// connects to a mongoDB
var connStr = 'mongodb://localhost:27017/calorieTracker';
mongoose.connect(connStr, function(err) {
  if (err) throw err;
  console.log('Successfully connected to MongoDB');
});

app.post('/authenticate', function(req, res) {
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    data = JSON.parse(data);
    User.findOne({token: data.token}, function(err, user) {
      if (err) {
        res.json({
          type: false,
          data: "Error occured: " + err
        });
      } else {
        if (user) {
          res.status(201);
          res.json({
            data: user,
          });
        } else {
          res.status(401);
          res.json({
            data: "Incorrect email/password"
          });
        }
      }
    });
  });
});

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
    User.findOne({token: data.token}, function(err, user) {
      var newEntry = new Entry({
        user: user.username,
        date: data.date,
        time: data.time,
        text: data.comments,
        calories: data.calories
      });
      newEntry.save(function(err, entrySave) {
        if (err) throw err;
        res.end(JSON.stringify({user: entrySave.user, date: entrySave.date, text: entrySave.text, calories: entrySave.calories}));
      });
    });
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
    User.findOne({ username: data.id}, function(err, userFind) {
      if (err) throw err;
      if (userFind === null) {
        var newUser = new User({
          username: data.id,
          password: data.password,
          expectedCalories: data.calories,
          token: jwt.sign(data.id, "MY_SECRET")
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
    User.findOne({ username: data.id}, function(err, user) {
      if (err) throw err;
      // test a matching password
      if (user) {
        user.comparePassword(data['password'], function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            console.log('creating new token');
            var newToken = jwt.sign(user, "MY_SECRET");
            User.update({username: data['id']}, {$set:{token: newToken}}, {upsert: true}, function(){});
            res.end(JSON.stringify({isMatch: isMatch, token: newToken}));
          } else {
            res.end(JSON.stringify({isMatch: isMatch}));
          }
        });
      }
    });
  });
});

app.post('/expectedCalories', function(req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.status(201);
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    data = JSON.parse(data);
    User.findOne({token: data.token}, function(err, user) {
      console.log(user);
      res.end(JSON.stringify({expectedCalories: user.expectedCalories}));
    });
  });
});

app.post('/calories', function(req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.status(201);
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    data = JSON.parse(data);
    User.findOne({token: data.token}, function(err, user) {
      Entry.find({user: user.username}, function(err, entries) {
        res.end(JSON.stringify({entries: entries, user: user.username}));
      });
    })
  });
});

app.post('/deleteEntry', function(req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.status(201);
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    data = JSON.parse(data);
    console.log(data._id);
    Entry.find({_id: data._id}).remove().exec();
  });
  res.end();
});

//log where we are listening
console.log("Listening on http://" + ip + ":" + port);

app.listen(port, ip);
