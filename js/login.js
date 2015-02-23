angular.module('calorieTrackerApp.login', [])

.controller('LoginCtrl', function($scope, $http, $state, $cookieStore) {
  // angular.extend($scope, Login);
  $scope.isMatch = true;
  $scope.login = function(id, password) {
    $http.post('/login', {id: id, password: password})
      // data is the response i get back from the server
      .success(function(data, status, headers, config) {
        $scope.isMatch = data['isMatch'];
        $cookieStore.put('user', id);
        $state.go('userPage');
        console.log(data);
      })
      .error(function(data, status, headers, config) {
        console.log('error');
      })
  }
})

.factory('Login', function($http) {

  // return {
  //   login: login
  // }
})
