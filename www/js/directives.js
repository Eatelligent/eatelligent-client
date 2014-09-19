angular.module('starter.directives', [])
  .controller('SideBarController', ['$scope', function($scope) {
    $scope.links = [
      {
        'url': '#/settings',
        'name': 'Settings'
      },
      {
        'url': '#/tab/favorites',
        'name': 'Favorites'
      }
    ]
  }])
  .directive('sideBar', function() {
    return {
      templateUrl: 'templates/sidebar.html'
    }
  });
