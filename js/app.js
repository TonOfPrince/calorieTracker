var calorieTracker = angular.module('calorieTrackerApp',
  ['ui.router',
   'ngCookies',
   'calorieTrackerApp.userPage',
   'calorieTrackerApp.signUp',
   'calorieTrackerApp.login'
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
      controller: 'LoginCtrl'
    })
    .state('calorieList', {
      url: '/calorieList',
      templateUrl: 'views/calorieList.html',
    })
    .state('userPage', {
      url: '/userPage',
      templateUrl: 'views/userPage.html',
      controller: 'UserPageCtrl'
    })
});
