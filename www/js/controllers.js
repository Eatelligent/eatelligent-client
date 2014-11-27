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
    email: 'tandeey@gmail.com',
    password: 'password'
  };
  // $scope.errormessage = '';


  $scope.login = function() {
    var auth = {
      email: $scope.user.email,
      password: $scope.user.password
    };
    console.log(auth);
    
    $http.post('http://localhost:9000/api/authenticate', auth)
      .success(function(data) {
        console.log('goal', data);
        window.location = '#/app/search'
      })
      .error(function(data) {
        $scope.errormessage = data.message;
      })
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

.controller('RecipeController', function($scope, $http, $ionicModal) {

  $http.get('http://localhost:9000/api/recipes/4')
    .success(function(data, status, headers, config) {
      $scope.recipename = data.recipe.name;
      $scope.procedure = data.recipe.procedure;
      $scope.ingredients = data.recipe.ingredients;
    })
    .error(function(data, status, headers, config) {
      console.log('error', data, status, headers, config);
    })

  $scope.globalRating = 3.5;

  $scope.rated = false;
  $scope.numStars = [1,2,3,4,5];
  $scope.rate = function(stars) {
    $scope.rated = true;
    $scope.numStarsRated = stars;
  };

  $scope.getStarClass = function(i) {
    if(!$scope.numStarsRated) {
      // Not rated, show global ratings

      if (Math.ceil($scope.globalRating) === i) {
        return 'ion-ios7-star-half';
      }

      if (i <= $scope.globalRating) {
        return 'ion-ios7-star';
      }
      return 'ion-ios7-star-outline';


      // if(i + 0.5 <= $scope.globalRating) {
      //   console.log('her');
      //   if ($scope.globalRating - 0.5 >= i) {
      //     return 'ion-ios7-star';
      //   } else {
      //     return 'ion-ios7-star-half';
      //   }
      // }
      // else if (i <= $scope.globalRating) {
      //   return 'ion-ios7-star';
      // } 
    } else {
      return $scope.numStarsRated >= i ? 'ion-ios7-star' : 'ion-ios7-star-outline';
    }
  };

  $ionicModal.fromTemplateUrl('templates/apps/nutrition.modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  // Determine how long the user have watched a recipe.
  var startTime = moment();
  var timer = setInterval(function() {
    $scope.totalTime = moment().diff(startTime, 'seconds');
    $scope.$apply();
  }, 1000)
  $scope.portions = 1;

  $scope.incrementPortions = function() {
    $scope.portions++;
  }

  $scope.decrementPortions = function() {
    $scope.portions = Math.max(1, $scope.portions - 1);
  }
})

.controller('ShoppingCartController', function($scope) {
  $scope.items = [
    {title: 'Ost', amount: '400g'},
    {title: 'Tomat', amount: '8 stk'},
    {title: 'Fisk', amount: '4 fileter'},
    {title: 'Kjøttdeig', amount: '1200g'},
    {title: 'Pepper', amount: '1 pose'}
  ]
})

.controller('SearchController', function($scope) {
  $scope.results = [
    {id: 1, title: 'Lasser', description: 'Du starter med en jevning av ...'},
    {id: 2, title: 'Lasser med god stemning', description: 'Du starter med en jevning av ...'},
    {id: 3, title: 'Suppa', description: 'Du starter med en jevning av ...'}
  ]
})

.controller('UserController', function($scope) {
  
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