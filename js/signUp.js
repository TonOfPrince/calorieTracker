angular.module('calorieTrackerApp.signUp', [])

.controller('SignUpCtrl', function($scope, $http, $state) {
  $scope.createUser = function(id, password, confirmation, calories) {
    $http.post('/createUser', {id: id, password: password, confirmation: confirmation, calories: calories})
      // data is the response i get back from the server
      .success(function(data, status, headers, config) {
        // check if the user is already in the database
        if (data.newUser === false) {
          $scope.userExists = true;
          console.log('user already exists!');
        } else {
          $scope.userExists = false;
          console.log('new user!');
          sessionStorage.token = data.token;
          $state.go('userPage');
        }
      })
      .error(function(data, status, headers, config) {
        console.log('error');
      })
  }
});
