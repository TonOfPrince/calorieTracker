var calorieTracker = angular.module('calorieTrackerApp',
  ['ui.router',
   'ngCookies',
   'calorieTrackerApp.userPage',
   'calorieTrackerApp.signUp',
   'calorieTrackerApp.login'
  ])
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
    // Initialize a new promise
    var deferred = $q.defer();

    // Make an AJAX call to check if the user is logged in
    $http.get('/loggedin').success(function(user){
      // Authenticated
      if (user !== '0') {
        /*$timeout(deferred.resolve, 0);*/
        console.log('we checked and you are logged in');
        deferred.resolve();
      }
      // Not Authenticated
      else {
        $rootScope.message = 'You need to log in.';
        //$timeout(function(){deferred.reject();}, 0);
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
    .state('calorieList', {
      url: '/calorieList',
      templateUrl: 'views/calorieList.html',
      resolve: {
        loggedin: checkLoggedin
      }
    })
    .state('userPage', {
      url: '/userPage',
      templateUrl: 'views/userPage.html',
      controller: 'UserPageCtrl',
      resolve: {
        loggedin: checkLoggedin
      }
    })
})
.run(function($rootScope, $http){
  $rootScope.message = '';

  // Logout function is available in any pages
  $rootScope.logout = function(){
    $rootScope.message = 'Logged out.';
    $http.post('/logout');
  };
});
