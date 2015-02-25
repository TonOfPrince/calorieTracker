angular.module('calorieTrackerApp.login', [])

.controller('LoginCtrl', function($scope, $http, $state) {
  $scope.isMatch = true;
  $scope.login = function(id, password) {
    $http.post('/login', {id: id, password: password})
      // data is the response i get back from the server
      .success(function(data, status, headers, config) {
        $scope.isMatch = data['isMatch'];
        sessionStorage.token = data.token;
        $state.go('userPage');
      })
      .error(function(data, status, headers, config) {
        console.log('error');
      })
  }
})
