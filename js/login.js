angular.module('calorieTrackerApp.login', [])

.controller('LoginCtrl', function($scope, $http, $state) {
  $scope.isMatch = true;
  // logs the user in
  $scope.login = function(id, password) {
    $http.post('/login', {id: id, password: password})
      // data is the response i get back from the server
      .success(function(data, status, headers, config) {
        $scope.isMatch = data.isMatch;
        // stores a new token
        sessionStorage.token = data.token;
        // goes to the user page
        $state.go('userPage');
      });
  }
})
