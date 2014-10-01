// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // login and signup states
    .state('account', {
      abstract: true,
      url: '/account',
      templateUrl: 'templates/account.html'
    })

    .state('account.signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'SignupController'

    })

    .state('account.signup-facebook', {
      url: '/signup/facebook',
      templateUrl: 'templates/signup/facebook.html'
    })

    .state('account.signup-google', {
      url: '/signup/google',
      templateUrl: 'templates/signup/google.html'
    })

    .state('account.signup-fresh', {
      url: '/signup/fresh',
      templateUrl: 'templates/signup/fresh.html',
    })

    .state('account.login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginController'
    })

    // app states
    .state('app', {
      abstract: true,
      url: '/app',
      templateUrl: 'templates/app.html'
    })

    .state('app.favorites', {
      url: '/favorites',
      templateUrl: 'templates/favorites.html',
      controller: 'FavoritesController'
    })

    .state('app.recipes', {
      url: '/recipes/:id',
      templateUrl: 'templates/recipe.html',
      controller: 'RecipeController'
    })

    .state('app.settings', {
      url: '/settings',
      templateUrl: 'templates/settings.html',
      controller: 'SettingsController'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/account/login');

});

function ContentController($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
}