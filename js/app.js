var calorieTracker = angular.module('calorieTrackerApp',
  ['ui.router',
   'ngCookies',
   'calorieTrackerApp.addEntry',
   'calorieTrackerApp.signUp'
  ])
.config(function($stateProvider, $urlRouterProvider) {
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
