var calorieTracker = angular.module('calorieTrackerApp',
  ['ui.router',
   'ngCookies',
   'calorieTrackerApp.addEntry'
  ])
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/login");

  $stateProvider
    .state('signup', {
      url: '/signup',
      templateUrl: 'views/signup.html',
      // controller: 'LoginCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      // controller: 'LoginCtrl'
    })
    .state('calorieList', {
      url: '/calorieList',
      templateUrl: 'views/calorieList.html',
      // controller: 'LoginCtrl'
    })
    .state('addEntry', {
      url: '/addEntry',
      templateUrl: 'views/addEntry.html',
      controller: 'AddEntryCtrl'
    })
});
