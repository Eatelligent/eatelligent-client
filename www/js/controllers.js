angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
})

// this guy

.controller('SignupController', function($scope, $http, $location) {
  $scope.redirect = function(location) {
    window.location = '#/account/signup/'+location;
  }
})

.controller('LoginController', function($scope, $http, $location) {
  $scope.user = {
    email: '',
    password: ''
  };
})

.controller('FavoritesController', function($scope, $http) {
  $scope.items = [
    {title: 'Lasser', description: 'Du starter med en jevning av...', id: _.uniqueId(), img: '/img/lasagne-02_6.jpg'},
    {title: 'Lasser', description: 'Du starter med en jevning av...', id: _.uniqueId(), img: '/img/lasagne-02_6.jpg'},
    {title: 'Lasser', description: 'Du starter med en jevning av...', id: _.uniqueId(), img: '/img/lasagne-02_6.jpg'},
    {title: 'Lasser', description: 'Du starter med en jevning av...', id: _.uniqueId(), img: '/img/lasagne-02_6.jpg'},
    {title: 'Lasser', description: 'Du starter med en jevning av...', id: _.uniqueId(), img: '/img/lasagne-02_6.jpg'},
    {title: 'Lasser', description: 'Du starter med en jevning av...', id: _.uniqueId(), img: '/img/lasagne-02_6.jpg'},
    {title: 'Lasser', description: 'Du starter med en jevning av...', id: _.uniqueId(), img: '/img/lasagne-02_6.jpg'},
    {title: 'Lasser', description: 'Du starter med en jevning av...', id: _.uniqueId(), img: '/img/lasagne-02_6.jpg'}
  ]
  $scope.delete = function(item) {
    // delete item from favs
    console.log(item);
  }
})

.controller('RecipeController', function($scope, $http) {
  console.log($http, $scope);
})

.controller('SettingsController', function($scope, $http) {
  console.log('SettingsController');

  $scope.settings = {
    email: 'pelle@krogstad.no',
    name: 'Pelle Krogstad',
    allergies: {}
  };

  $scope.allergyChange = function(what) {
    $scope.settings.allergies[what] = 'vasadasdl'
    console.log($scope.settings);
  }

});