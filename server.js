var mongoose = require('mongoose');
var User = require('./models/user-model');
var Calorie = require('./models/entry-model');

var express = require("express");
var app = express();

//port
var port = 3000;

//ip
var ip = "127.0.0.1";

app.use(express.static(__dirname));

var messages = []

var connStr = 'mongodb://localhost:27017/calorieTracker';
mongoose.connect(connStr, function(err) {
  if (err) throw err;
  console.log('Successfully connected to MongoDB');
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
    // data['objectId'] = objectId++;
    // messages.push(data);
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
    var newUser = new User({
      username: data['id'],
      password: data['password'],
      calories: data['calories']
    });

    newUser.save(function(err) {
      if (err) throw err;

      //fetch user and test password verification
      // User.findOne({ username: data['id']}, function(err, user) {
      //   if (err) throw err;

      //   // test a matching password
      //   user.comparePassword('Password123', function(err, isMatch) {
      //     if (err) throw err;
      //     console.log('Password123:', isMatch);
      //   });

      //   user.comparePassword('123Password', function(err, isMatch) {
      //     if (err) throw err;
      //     console.log('123Password:', isMatch);
      //   })
      // });
    });


    res.end(JSON.stringify({results: data}));
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
    console.log(data);
    console.log(data['password'])

    User.findOne({ username: data['id']}, function(err, user) {
      if (err) throw err;
      console.log(user);

      // test a matching password
      user.comparePassword(data['password'], function(err, isMatch) {
        if (err) throw err;
        console.log(data['password'], isMatch);
      });

    });

    res.end(JSON.stringify({results: messages}));
  });
});

//log where we are listening
console.log("Listening on http://" + ip + ":" + port);

app.listen(port, ip);




// create a new user
// var testUser = new User({
//   username: 'jmar777',
//   password: 'Password123'
// })

// // save user to database
// testUser.save(function(err) {
//   if (err) throw err;

//   //fetch user and test password verification
  // User.findOne({ username: 'jmar777'}, function(err, user) {
  //   if (err) throw err;

  //   // test a matching password
  //   user.comparePassword('Password123', function(err, isMatch) {
  //     if (err) throw err;
  //     console.log('Password123:', isMatch);
  //   });

  //   user.comparePassword('123Password', function(err, isMatch) {
  //     if (err) throw err;
  //     console.log('123Password:', isMatch);
  //   })
  // });
// });
