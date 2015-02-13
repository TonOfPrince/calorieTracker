var calorieTracker = angular.module('calorieTrackerApp',
  ['ui.router',
   'ngCookies'
  ])
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/login");

  $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        // controller: 'LoginCtrl'
    })
});
