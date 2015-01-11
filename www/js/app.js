// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'pascalprecht.translate', 'starter.controllers', 'starter.services', 'starter.directives', 'ngCookies'])
.run(function($ionicPlatform, $http, $cookies) {

  $http.defaults.headers.post['id'] = $cookies.csrftoken;
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
      // StatusBar.hide();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $translateProvider, $httpProvider) {

  $httpProvider.defaults.withCredentials = true;
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
      templateUrl: 'templates/account/facebook.html'
    })

    .state('account.signup-google', {
      url: '/signup/google',
      templateUrl: 'templates/account/google.html'
    })

    .state('account.signup-fresh', {
      url: '/signup/fresh',
      templateUrl: 'templates/account/fresh.html',
    })

    .state('account.login', {
      url: '/login',
      templateUrl: 'templates/account/login.html',
      controller: 'LoginController'
    })

    // app states
    .state('app', {
      abstract: true,
      url: '/app',
      templateUrl: 'templates/app.html'
    })

    .state('app.coldstart', {
      url: '/coldstart',
      templateUrl: 'templates/apps/coldstart.html',
      controller: 'ColdstartController'
    })

    .state('app.favorites', {
      url: '/favorites',
      templateUrl: 'templates/apps/favorites.html',
      controller: 'FavoritesController'
    })

    .state('app.recipes', {
      url: '/recipes/:id',
      templateUrl: 'templates/apps/recipe.html',
      controller: 'RecipeController'
    })

    .state('app.shoppingcart', {
      url: '/shoppingcart',
      templateUrl: 'templates/apps/shoppingcart.html',
      controller: 'ShoppingCartController'
    })

    .state('app.search', {
      url: '/search',
      templateUrl: 'templates/apps/search.html',
      controller: 'SearchController'
    })

    .state('app.user', {
      url: '/user/:id',
      templateUrl: 'templates/apps/user.html',
      controller: 'UserController'
    })

    .state('app.settings', {
      url: '/settings',
      templateUrl: 'templates/apps/settings.html',
      controller: 'SettingsController'
    })

    .state('app.logout', {
      url: '/logout',
      controller: 'SignoutController'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/account/login');

  // i18n
  $translateProvider.translations('en', window.__translations_en);
  $translateProvider.translations('no', window.__translations_no);

  $translateProvider.preferredLanguage('en');
});

function ContentController($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
}