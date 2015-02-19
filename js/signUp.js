angular.module('calorieTrackerApp.signUp', [])

.controller('SignUpCtrl', function($scope, $http, SignUp) {
  angular.extend($scope, SignUp);
})

.factory('SignUp', function($http) {
  var createUser = function(id, password, confirmation, calories) {
    $http.post('/createUser', {id: id, password: password, confirmation: confirmation, calories: calories})
      // data is the response i get back from the server
      .success(function(data, status, headers, config) {
        console.log('success');
        console.log(id);
        console.log(password);
        console.log(confirmation);
        console.log(calories);
      })
      .error(function(data, status, headers, config) {
        console.log('error');
      })
  }
  return {
    createUser: createUser
  }
})
