angular.module('calorieTrackerApp.login', [])

.controller('LoginCtrl', function($scope, $http, Login) {
  angular.extend($scope, Login);
})

.factory('Login', function($http) {
  var login = function(id, password) {
    $http.post('/login', {id: id, password: password})
      .success(function(data, status, headers, config) {
        console.log('success');
        console.log(id);
        console.log(password);
      })
      .error(function(data, status, headers, config) {
        console.log('error');
      })
  }
  return {
    login: login
  }
})
