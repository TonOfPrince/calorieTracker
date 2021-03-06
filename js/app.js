var calorieTracker = angular.module('calorieTrackerApp',
  ['ui.router',
   'calorieTrackerApp.userPage',
   'calorieTrackerApp.signUp',
   'calorieTrackerApp.login'
  ])
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  // checks of a user is logged in
  var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
    // Initialize a new promise
    var deferred = $q.defer();
    // Make an AJAX call to check if the user is logged in
    $http.post('/authenticate', {token: sessionStorage.token}).success(function(data, status){
      // Authenticated
      if (status == 201) {
        console.log('we checked and you are logged in');
        deferred.resolve();
      }
      // Not Authenticated
      else {
        deferred.reject();
        $location.url('/login');
      }
    });
    return deferred.promise;
  };

  //================================================
  // Add an interceptor for AJAX errors
  //================================================
  $httpProvider.interceptors.push(function($q, $location) {
    return {
      response: function(response) {
        // do something on success
        return response;
      },
      responseError: function(response) {
        if (response.status === 401)
          $location.url('/login');
        return $q.reject(response);
      }
    };
  });

  $urlRouterProvider.otherwise("/login");

  $stateProvider
    .state('signUp', {
      url: '/signUp',
      templateUrl: 'views/signUp.html',
      controller: 'SignUpCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .state('userPage', {
      url: '/userPage',
      templateUrl: 'views/userPage.html',
      controller: 'UserPageCtrl',
      resolve: {
        loggedin: checkLoggedin
      }
    })
});
