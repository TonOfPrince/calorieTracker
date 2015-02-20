angular.module('calorieTrackerApp.signUp', [])

.controller('SignUpCtrl', function($scope, $http) {
  // angular.extend($scope, SignUp);
  $scope.createUser = function(id, password, confirmation, calories) {
    $http.post('/createUser', {id: id, password: password, confirmation: confirmation, calories: calories})
      // data is the response i get back from the server
      .success(function(data, status, headers, config) {
        // check if the user is already in the database
        console.log(data);
        if (data['newUser'] === false) {
          $scope.userExists = true;
          console.log('user already exists!');
        } else {
          $scope.userExists = false;
          console.log('new user!');
        }
      })
      .error(function(data, status, headers, config) {
        console.log('error');
      })
  }
})

.factory('SignUp', function($http) {
  // var createUser = function(id, password, confirmation, calories, exists) {
  //   $http.post('/createUser', {id: id, password: password, confirmation: confirmation, calories: calories})
  //     // data is the response i get back from the server
  //     .success(function(data, status, headers, config) {
  //       // check if the user is already in the databse
  //       if (data['newUser'] === false) {
  //         exists = true;
  //         console.log('user already exists!');
  //       } else {
  //         console.log('new user!');
  //       }
  //     })
  //     .error(function(data, status, headers, config) {
  //       console.log('error');
  //     })
  // }
  // return {
  //   createUser: createUser
  // }
})
