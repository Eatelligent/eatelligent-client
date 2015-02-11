var signout = function($http, $location) {
  $http.get(settings.apiUrl + '/signOut')
  $location.path('/account/login');
};

var authCheck = function($http) {
  $http.get(settings.apiUrl + '/api/user')
    .error(function(data, status) {
      window.location = '#/account/login';
    });
};

angular.module('starter.controllers', [])

// .controller('SignupController', function($scope, $http, $location) {
//   $scope.redirect = function(location) {
//     window.location = '#/account/signup/'+location;
//   };
// })

.controller('SignupControllerFresh', function($scope, $http, $location) {
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
      $http.post(settings.apiUrl + '/api/users', $scope.user)
        .success(function(response) {
          $http.post(settings.apiUrl + '/api/authenticate', {
            email: $scope.user.email,
            password: $scope.user.password
          })
          .success(function(data) {
            $location.path('/app/coldstart');
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
  $scope.loading = false;
  // $scope.errormessage = '';

  $scope.checkIfAuthed = function() {
    $http.get(settings.apiUrl + '/api/user')
      .success(function(data) {
        $location.path('/app/search');
      });
  };

  $scope.login = function() {
    var auth = {
      email: $scope.user.email,
      password: $scope.user.password
    };

    $scope.loading = true;
    $http.post(settings.apiUrl + '/api/authenticate', auth)
      .success(function(data) {
        $location.path('/app/search');
      })
      .error(function(data, b, c) {
        $scope.loading = false;
        console.log('Login error', JSON.stringify(data), data);
        $scope.errormessage = data.message || 'Something went wrong';
      });
  };
})

.controller('SignoutController', function($http, $location) {
  signout($http, $location);
})

.controller('FavoritesController', function($scope, $http) {
  authCheck($http);

  $scope.loading = true;
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
    })
    .then(function() {
      $scope.loading = false;
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

.controller('RecipeController', function($stateParams, $scope, $http, ShoppingCart) {
  authCheck($http);

  $scope.loading = true;
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

      // $scope.rated = true; // todo show rated on load
      // $scope.numStarsRated = 1;

      if(data.recipe.currentUserRating) {
        $scope.rated = true;
        $scope.numStarsRated = data.recipe.currentUserRating;
      } else {
        $scope.globalRating = data.recipe.averageRating;
      }

    })
    .error(function(data, status, headers, config) {
      console.log('error', JSON.stringify(data), status, headers, config);
    })
    .then(function() {
      $scope.loading = false;
    })

  $scope.globalRating = 3.5;

  $scope.rated = false;
  $scope.numStars = [1,2,3,4,5];
  $scope.rate = function(stars) {
    $scope.rated = true;
    $scope.numStarsRated = stars;

    $http.post(settings.apiUrl + '/api/ratings/recipes', {recipeId: id, rating: stars})
      .success(function() {
        // todo
      })
      .error(function(data) {
        console.log('Error posting recipe rating', JSON.stringify(data));
      });
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
    } else {
      return $scope.numStarsRated >= i ? 'ion-ios7-star' : 'ion-ios7-star-outline';
    }
  };

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
      });
  };

  $scope.addToShoppingCart = function() {
    var ingredients = $scope.ingredients.map(function(ing) {
      return {
        title: ing.name,
        amount: ($scope.portions * ing.amount) + ' ' + ing.unit
      };
    });

    ShoppingCart.add(ingredients);
    window.location = '#/app/shoppingcart';
  };
})

.controller('ShoppingCartController', function($scope, $http, ShoppingCart) {
  authCheck($http);

  $scope.items = ShoppingCart.all();
  $scope.empty = !$scope.items.length;

  $scope.checkBoxChanged = function(item) {
    $scope.completed = $scope.completed || [];
    $scope.completed.push(item)
  }

  $scope.clearCompleted = function() {
    $scope.completed = $scope.completed || [];

    $scope.completed.forEach(function(item) {
      ShoppingCart.remove(item);
    });
    $scope.items = ShoppingCart.all();
    $scope.empty = !$scope.items.length;
  }
})

.controller('SearchController', function($scope, $http) {
  authCheck($http);
  $scope.hasSearched = false;
  $scope.loading = true;

  var handleResponse = function(response) {
    response.recipes.forEach(function(recipe) { // create thumbnail
      recipe.image = recipe.image || '/img/ionic.png';
      recipe.image = recipe.image.replace(/(v[0-9]*)/, 'w_100,h_100,c_fill');
      $scope.hasSearched = true;
    });

    $scope.results = response.recipes;
  };

  $http.get(settings.apiUrl + '/api/recipes?published=true&deleted=false&limit=10')
    .success(handleResponse)
    .error(function() {
      authCheck($http);
    })
    .then(function() {
      $scope.loading = false;
    });


  $scope.search = function(obj) {
    var q = obj.query;
    $scope.loading = true;

    $http.get(settings.apiUrl + '/api/recipes?published=true&deleted=false&q=' + q)
      .success(handleResponse)
      .error(function(data, status) {
        console.log('Error searching for recipe', JSON.stringify(data), 'Status:', status);
      })
      .then(function() {
        $scope.loading = false;
      });
  };

  // TODO: Sette $scope.results til ei top 10 liste når ingenting er utfylt. (Kanskje siste søk etter det)
})

.controller('RecommenderController', function($scope, $http, $location) {

  $scope.loading = true;

  $scope.infoShown = localStorage.getItem('mealchooser-recommender-info-not-shown');
  $scope.removeInfo = function() {
    localStorage.setItem('mealchooser-recommender-info-not-shown', false);
    $scope.infoShown = true;
  };

  $scope.confirmRecommendation = function() {
    var choice = $scope.recommendations[0];

    // TODO: Send inn hvilken som ble valgt til AI-endpoint

    $location.path('/app/recipes/'+choice.recipe.id);
  };
  $scope.declineReommendation = function() {
    $scope.recommendations.splice(0, 1);
  };

  $scope.name = '';
  $scope.image = '';
  $scope.description = '';

  $http.get(settings.apiUrl + '/api/recommendation/recipes')
    .success(function(response) {
      $scope.recommendations = response.recommendations;
    })
    .error(function(data) {
      console.log('Recommendation error', JSON.stringify(data));
    })
    .then(function() {
      $scope.loading = false;
    });

  $scope.$watch('recommendations', function(newArray) {
    if(newArray && newArray.length) {
      var recipe = newArray[0].recipe;
      $scope.name = recipe.name;
      $scope.image = (recipe.image || '').replace(/(v[0-9]*)/, 'w_300,h_300,c_fill');
      $scope.description = recipe.description;
      $scope.empty = false;
    } else if(newArray && newArray.length == 0) {
      console.log('ferdig');
      $scope.empty = true;
    }
  }, true);
})

.controller('ColdstartController', function($scope, $http) {
  authCheck($http);

  // $http.get(settings.apiUrl + '/api/coldstart')
  //   .success(function(response) {
  //   })

  // TODO: get cold start shit
})

.controller('CardsCtrl', function($scope, $http, $location, TDCardDelegate) {
  $scope.loading = true;

  $scope.cards = [];
  $http.get(settings.apiUrl + '/api/coldstart')
    .success(function(response) {
      var array = [];
      response.choices.forEach(function(choice) {
        array.push({
          image: choice.image,
          description: choice.description,
          id: choice.id
        });
      });

      $scope.cards = array;
      $scope.loading = false;
    });

  $scope.cardDestroyed = function(index) {
    console.log('$scope.cardDestroyed', arguments);
    $scope.cards.splice(index, 1);
  };

  $scope.cardSwiped = function() {}

  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE', arguments);
    var cards = $scope.cards[index];
    $http.post(settings.apiUrl + '/api/coldstart', {coldStartId: cards.id, answer: true});
  };

  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
    var cards = $scope.cards[index];
    $http.post(settings.apiUrl + '/api/coldstart', {coldStartId: cards.id, answer: false});
  };


  $scope.$watch('cards', function(newArray, old) {
    console.log(arguments);
    if(newArray.length === 0 && old.length === 1) {
      // console.log('done, finn på noe anna');
      $location.path('/app/recommend');
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
  authCheck($http);

  $scope.settings = {
    email: 'pelle@krogstad.no',
    name: 'Pelle Krogstad',
    allergies: {}
  };

  $scope.allergyChange = function(what) {
    $scope.settings.allergies[what] = 'vasadasdl'
  }
});
