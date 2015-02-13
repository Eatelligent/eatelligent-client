angular.module('starter.directives', [])
  .controller('SideBarController', ['$scope', function($scope) {
    var random = _.random(1, 50);

    $scope.links = [
      {
        'url': '#/app/history',
        'name': 'history'
      },
      {
        'url': '#/app/recommend',
        'name': 'recommend'
      },
      {
        'url': '#/app/search',
        'name': 'search'
      },
      {
        'url': '#/app/favorites',
        'name': 'favorites'
      },
      // {
      //   'url': '#/app/coldstart',
      //   'name': 'Coldstart'
      // },
      {
        'url': '#/app/shoppingcart',
        'name': 'shoppingCart'
      },
      {
        'url': '#/app/settings',
        'name': 'settings'
      },
      {
        'url': '#/app/logout',
        'name': 'signout'
      }
    ]
  }])
  .directive('sideBar', function() {
    return {
      templateUrl: 'templates/apps/sidebar.html'
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
