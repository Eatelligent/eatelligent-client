angular.module('starter.directives', [])
  .controller('SideBarController', ['$scope', function($scope) {
    var random = _.random(1, 50);    

    $scope.links = [
      {
        'url': '#/settings',
        'name': 'Settings'
      },
      {
        'url': '#/favorites',
        'name': 'Favorites'
      },
      {
        'url': '#/recipes/'+random,
        'name': 'Random Recipe'
      }
    ]
  }])
  .directive('sideBar', function() {
    return {
      templateUrl: 'templates/sidebar.html'
    }
  });
