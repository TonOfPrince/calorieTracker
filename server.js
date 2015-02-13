var mongoose = require('mongoose');
var User = require('./user-model');

var connStr = 'mongodb://localhost:27017/calorieTracker';
mongoose.connect(connStr, function(err) {
  if (err) throw err;
  console.log('Successfully connected to MongoDB');
})

// create a new user
// var testUser = new User({
//   username: 'jmar777',
//   password: 'Password123'
// })

// // save user to database
// testUser.save(function(err) {
//   if (err) throw err;

//   //fetch user and test password verification
//   User.findOne({ username: 'jmar777'}, function(err, user) {
//     if (err) throw err;

//     // test a matching password
//     user.comparePassword('Password123', function(err, isMatch) {
//       if (err) throw err;
//       console.log('Password123:', isMatch);
//     });

//     user.comparePassword('123Password', function(err, isMatch) {
//       if (err) throw err;
//       console.log('123Password:', isMatch);
//     })
//   });
// });
