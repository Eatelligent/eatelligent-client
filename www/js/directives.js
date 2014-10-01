angular.module('starter.directives', [])
  .controller('SideBarController', ['$scope', function($scope) {
    var random = _.random(1, 50);    

    $scope.links = [
      {
        'url': '#/app/settings',
        'name': 'Settings'
      },
      {
        'url': '#/app/favorites',
        'name': 'Favorites'
      },
      {
        'url': '#/app/recipes/'+random,
        'name': 'Random Recipe'
      }
    ]
  }])
  .directive('sideBar', function() {
    return {
      templateUrl: 'templates/sidebar.html'
    }
  })

  .controller('Years', ['$scope', function($scope) {
    var years = [];
    _.each(_.range(1920, 2010), function(y) {
      years.push({
        year: y,
        selected: ''
      });

      if(y === 1990)
        years[years.length-1].selected = 'selected';
    });

    $scope.years = years; 
  }])
;
