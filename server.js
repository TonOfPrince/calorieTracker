var mongoose = require('mongoose');
// mongo schema models
var User = require('./models/user-model');
var Entry = require('./models/entry-model');
// express module
var express = require("express");
// better terminal logs
var morgan = require("morgan");
// allows use of tokens
var jwt = require("jsonwebtoken");
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

// Authenticates the user given a username and password
app.post('/authenticate', function(req, res) {
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    data = JSON.parse(data);
    // find a user with that token
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
            data: "Incorrect token"
          });
        }
      }
    });
  });
});

// saves a calorie entry to mongo
app.post('/saveEntry', function (req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.status(401);
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    data = JSON.parse(data);
    // find a user with that token
    User.findOne({token: data.token}, function(err, user) {
      if (user) {
        res.status(201);
        // make a new entry
        var newEntry = new Entry({
          user: user.username,
          date: data.date,
          time: data.time,
          text: data.comments,
          calories: data.calories
        });
        // save the entry
        newEntry.save(function(err, entrySave) {
          if (err) throw err;
          res.end(JSON.stringify({entry: entrySave}));

        });
      } else {
        res.status(401);
        res.json({
          data: "Incorrect token"
        });
      }
    });
  });
});

// updates a calorie entry in mongo
app.put('/updateEntry', function (req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.status(401);
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    data = JSON.parse(data);
    // find the entry
    Entry.findOne({_id: data.entry._id}, function(err, entry) {
      if (entry) {
        res.status(201);
        entry.date = data.date;
        entry.time = data.time;
        entry.text = data.comments;
        entry.calories = data.calories;
        // save the updated data
        entry.save();
        res.end();
      } else {
        res.end();
      }
    });
  });
});

// deletes an entry entry in mongo
app.delete('/deleteEntry', function(req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.status(201);
  // var data = "";
  // req.on('data', function(chunk) {
  //   data += chunk;
  // });
  req.on('end', function() {
    console.log(req.query.entry);
    // var data = JSON.parse(req.query);
    var data = JSON.parse(req.query.entry);

    // delete the entry
    Entry.find({_id: data._id}).remove().exec();
  });
  res.end();
});

// creates a new user in mongo
app.post('/createUser', function (req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.status(201);
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    data = JSON.parse(data);
    // find a user with those credentials
    User.findOne({ username: data.id}, function(err, userFind) {
      if (err) throw err;
      // create a user if one does not exist with that username
      if (userFind === null) {
        var newUser = new User({
          username: data.id,
          password: data.password,
          expectedCalories: data.calories,
          token: jwt.sign(data.id, "MY_SECRET")
        });
        // save the user
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

// logs a user in given a username and password
app.post('/login', function (req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.status(401);
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
        user.comparePassword(data.password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            var newToken = jwt.sign(user, "MY_SECRET");
            User.update({username: data.id}, {$set:{token: newToken}}, {upsert: true}, function(){});
            res.status(201);
            res.end(JSON.stringify({isMatch: isMatch, token: newToken}));
          } else {
            res.end(JSON.stringify({isMatch: isMatch}));
          }
        });
      } else {
        res.end(JSON.stringify({isMatch: false}));
      }
    });
  });
});

// grabs the user's expected number of daily calories
app.post('/expectedCalories', function(req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.status(401);
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    data = JSON.parse(data);
    // find the user based off a token
    User.findOne({token: data.token}, function(err, user) {
      // send back the expected calories for that user
      if (user) {
        res.status(201);
        res.end(JSON.stringify({expectedCalories: user.expectedCalories}));
      } else {
        res.end();
      }
    });
  });
});

// grabs all of a user's entries
app.post('/calories', function(req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.status(401);
  var data = "";
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    data = JSON.parse(data);
    // finds a user based off of a token
    User.findOne({token: data.token}, function(err, user) {
      if (user) {
        res.status(201);
        // finds all entries from that user
        Entry.find({user: user.username}, function(err, entries) {
          res.end(JSON.stringify({entries: entries, user: user.username}));
        });
      } else {
        res.end();
      }
    });
  });
});



//log where we are listening
console.log("Listening on http://" + ip + ":" + port);

app.listen(port, ip);
