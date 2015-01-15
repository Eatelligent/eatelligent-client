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
  };
})

.controller('SignupControllerFresh', function($scope, $http) {
  $scope.user = {
    email: ''
  };

  $scope.isValid = function() {
    var errors = $scope.errors = [];
    if ($scope.user.password !== $scope.user.password2) {
      errors.push({type: 'password', text: 'disjointPasswords'});
    } else if (!$scope.user.password || !$scope.user.password2) {
      errors.push({type: 'password', text: 'emptyPassword'});
    } else if ($scope.user.password.length === 0 || $scope.user.password2.length === 0) {
      errors.push({type: 'password', text: 'emptyPassword'});
    }

    if ($scope.user.email.indexOf('@') === -1) {
      errors.push({type: 'email', text: 'noAlpha'});
    }

    return errors.length === 0;
  };

  $scope.signup = function() {
    if ($scope.isValid()) {
      console.log('valid');
      $http.post(settings.apiUrl + '/api/users', $scope.user)
        .success(function(response) {
          $http.post(settings.apiUrl + '/api/authenticate', {
            email: $scope.user.email,
            password: $scope.user.password
          })
          .success(function(data) {
            window.location = '#/app/search';
          })
        })
        .error(function(data) {
          console.log('Signup error:', JSON.stringify(data));
        })
    } else {
      console.log('errors', $scope.errors);
    }

  };
})

.controller('LoginController', function($scope, $http, $location) {
  $scope.user = {
    email: 'admin@admin.com',
    password: 'admin'
  };
  // $scope.errormessage = '';

  $scope.checkIfAuthed = function() {
    $http.get(settings.apiUrl + '/api/user')
      .success(function(data) {
        window.location = '#/app/search'
      });
  };

  $scope.login = function() {
    var auth = {
      email: $scope.user.email,
      password: $scope.user.password
    };
    console.log('AUTH', JSON.stringify(auth));
    console.log(settings.apiUrl);
    
    $http.post(settings.apiUrl + '/api/authenticate', auth)
      .success(function(data) {
        console.log('good', JSON.stringify(data));
        window.location = '#/app/search';
        $location.path('/app/search')
      })
      .error(function(data) {
        console.log('piss', JSON.stringify(data));
        $scope.errormessage = data.message;
      });
  };
})

.controller('SignoutController', function($http, $location) {
  console.log('SignoutController');
  $http.get(settings.apiUrl+ '/signOut')
    .success(function(data, status, headers, config) {
      // $location.path('#/account/login').replace();
      window.location = '#/account/login'
      window.location.reload();
    })
    .error(function() {
      // $location.path('#/account/login').replace();
      window.location = '#/account/login'
      window.location.reload();
    });
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

  $http.get(settings.apiUrl + '/api/recipes/4')
    .success(function(data, status, headers, config) {
      $scope.recipename = data.recipe.name;
      $scope.procedure = data.recipe.procedure;
      $scope.ingredients = data.recipe.ingredients;
    })
    .error(function(data, status, headers, config) {
      console.log('error', JSON.stringify(data), status, headers, config);
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

.controller('SearchController', function($scope, $http) {

  // $http.get(settings.apiUrl + '/api/user') // TODO: Finne en plass å ha den kontinuerlige sjekken for om du er logga inn.
  //   .success(function(data) {
  //     console.log('success', data);
  //   })
  //   .error(function(data, status) {
  //     console.log('Error fetching user', JSON.stringify(data), 'Status:', status);
  //   });
  $scope.search = function(obj) {
    var q = obj.query;

    $http.get(settings.apiUrl + '/api/recipes/' + q)
      .success(function(response) {
        $scope.results = response.recipes;
      })
      .error(function(response) {
        console.log('Error searching for recipe', JSON.stringify(response), 'Status:', status);
      });
  };

  // TODO: Sette $scope.results til ei top 10 liste når ingenting er utfylt. (Kanskje siste søk etter det)
})

.controller('UserController', function($scope) {
  
})

.controller('ColdstartController', function($scope, $http) {
  var cardTypes = [
    { image: 'lib/ionic-contrib-tinder-cards/demo/max.jpg' },
    { image: 'lib/ionic-contrib-tinder-cards/demo/ben.png' },
    { image: 'lib/ionic-contrib-tinder-cards/demo/perry.jpg' },
  ];

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.addCard = function() {
    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    newCard.id = Math.random();
    $scope.cards.unshift(angular.extend({}, newCard));
  }
  $scope.cardSwiped = function() {
    console.log('$scope.cardSwiped');
  }

  $scope.cards = [];
  for(var i = 0; i < 3; i++) $scope.addCard();
})

.controller('CardCtrl', function($scope, TDCardDelegate) {
  console.log('cardctrl');
  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
    $scope.addCard();
  };
  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
    $scope.addCard();
  };

  $scope.cardSwiped = function() {
    console.log('$scope.cardSwiped');
  }
})

.controller('SettingsController', function($scope, $http) {
  $scope.settings = {
    email: 'pelle@krogstad.no',
    name: 'Pelle Krogstad',
    allergies: {}
  };

  $scope.allergyChange = function(what) {
    $scope.settings.allergies[what] = 'vasadasdl'
  }
});