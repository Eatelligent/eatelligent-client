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
  $http.get(settings.apiUrl + '/signOut')
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

  $scope.empty = false;
  $scope.checkEmpty = function(items) {
    if(items.length === 0) {
      $scope.empty = true;
    } else {
      $scope.empty = false;
    }
  };

  $http.get(settings.apiUrl + '/api/favorites/recipes')
    .success(function(response) {
      response.favorites.forEach(function(recipe) { // create thumbnail
        recipe.image = recipe.image || '/img/ionic.png';
        recipe.image = recipe.image.replace(/(v[0-9]*)/, 'w_100,h_100,c_fill');
      });

      $scope.items = response.favorites;
      $scope.checkEmpty($scope.items);
    })
    .error(function(data) {
      console.log('Favorites error', JSON.stringify(data));
    });

  $scope.delete = function(item, index) {
    $scope.items.splice(index, 1);
    $http.delete(settings.apiUrl + '/api/favorites/recipes/' + item.id, {})
      .error(function(data) {
        console.log('Error removing from favorites', JSON.stringify(data));
      });
    $scope.checkEmpty($scope.items);
  };
})

.controller('RecipeController', function($stateParams, $scope, $http, $ionicModal) {
  var id = parseInt($stateParams.id, 10);

  $http.get(settings.apiUrl + '/api/recipes/' + id)
    .success(function(data, status, headers, config) {
      $scope.recipename = data.recipe.name;
      $scope.procedure = data.recipe.procedure;
      $scope.ingredients = data.recipe.ingredients;
      $scope.image = data.recipe.image;
      $scope.recipehours = Math.floor(data.recipe.time / 60);
      $scope.recipeminutes = data.recipe.time % 60;
      $scope.spicy = data.recipe.spicy;

      // $scope.rated = true;
      // $scope.numStarsRated = 1;
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
  }, 1000);

  $scope.portions = 1;

  $scope.incrementPortions = function() {
    $scope.portions++;
  };

  $scope.decrementPortions = function() {
    $scope.portions = Math.max(1, $scope.portions - 1);
  };

  $scope.isFavorite = true;
  $http.get(settings.apiUrl + '/api/favorites/recipes')
    .success(function(response) {
      $scope.isFavorite = _.reduce(response.favorites, function(memo, fav) {
        return memo || fav.id === id;
      }, false);
    });

  $scope.addToFavorites = function() {
    $http.post(settings.apiUrl + '/api/favorites/recipes', {recipeId: id})
      .success(function() {
        window.location = '#/app/favorites';
      })

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
  
  $scope.hasSearched = false;
  $scope.search = function(obj) {
    var q = obj.query;

    $http.get(settings.apiUrl + '/api/recipes?published=true&deleted=false&q=' + q)
      .success(function(response) {
        response.recipes.forEach(function(recipe) { // create thumbnail
          recipe.image = recipe.image || '/img/ionic.png';
          recipe.image = recipe.image.replace(/(v[0-9]*)/, 'w_100,h_100,c_fill');
          $scope.hasSearched = true;
        });

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

})

.controller('CardsCtrl', function($scope, TDCardDelegate) {
  var cardTypes = [
    { image: 'img/lasagne-02_6.jpg' },
    { image: 'img/lasagne-02_6.jpg' },
    { image: 'img/lasagne-02_6.jpg' }
  ];

  $scope.cardDestroyed = function(index) {
    console.log('$scope.cardDestroyed', arguments);
    $scope.cards.splice(index, 1);
  };

  $scope.addCard = function() {
    var newCard = {
      image: 'img/ionic.png',
      id: Math.random()
    };
    $scope.cards.push(newCard); // angular.extend({}, newCard));
  }

  $scope.cardSwiped = function() {
    console.log('swipe', arguments);
  }

  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
  };

  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
  };

  $scope.cards = [];
  for(var i = 0; i < 3; i++) 
    $scope.addCard();

  $scope.$watch('cards', function(newArray) {
    if(newArray.length === 0) {
      console.log('done, finn på noe anna');
    }
  }, true);
})

// .controller('CardCtrl', function($scope, TDCardDelegate) {
//   console.log('cardctrl', TDCardDelegate);
//   // $scope.cardSwipedLeft = function(index) {
//   //   console.log('LEFT SWIPE');
//   //   $scope.addCard();
//   //   // $scope.addCard();
//   // };
//   // $scope.cardSwiped = function() {
//   //   console.log('$scope.cardSwiped');
//   // }
// })

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