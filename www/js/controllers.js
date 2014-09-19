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

.controller('FavoritesController', function($scope, $http) {
  console.log('heiaa');

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
});