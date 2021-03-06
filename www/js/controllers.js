var signout = function($http, $location) {
  $http.get(settings.apiUrl + '/signOut')
    .success(function() {
      $location.path('/account/login');
    })
    .error(function() {
      $location.path('/account/login');
    });
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

.controller('ContentController', function ContentController($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

.controller('SignupControllerFresh', function($scope, $http, $location, $translate) {
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

  var errorscope;

  if($translate.preferredLanguage() === 'en') {
    errorscope = window.__translations_en.signup.fresh.errors;
  } else {
    errorscope = window.__translations_no.signup.fresh.errors;
  }

  $scope.signup = function() {
    if ($scope.isValid()) {
      $scope.loading = true;

      $http.post(settings.apiUrl + '/api/users', $scope.user)
        .success(function(response) {
          $scope.loading = false;

          $http.post(settings.apiUrl + '/api/authenticate', {
            email: $scope.user.email,
            password: $scope.user.password
          })
          .success(function(data) {
            localStorage.setItem('mealchooser-email', $scope.user.email);
            localStorage.setItem('mealchooser-password', $scope.user.password);

            $location.path('/app/coldstart');
          })
        })
        .error(function(data) {
          $scope.loading = false;
          if(data.message === 'Execution exception[[DuplicateException: User already exists.]]') {
            $scope.errormessage = errorscope.userexists;
          } else {
            $scope.errormessage = errorscope.generic;
          }

          console.log('Signup error:', JSON.stringify(data));
        })
    } else {
      console.log('errors', $scope.errors);
    }
  };
  if (window.analytics)
    window.analytics.trackView('SignupController');
})

.controller('LoginController', function($scope, $http, $location, $translate) {

  if(!!localStorage.getItem('mealchooser-reset-password')) {
    $scope.errormessage = 'reset true';
    localStorage.removeItem('mealchooser-reset-password');
    if($translate.preferredLanguage() === 'en') {
      $scope.errormessage = window.__translations_en.forgot.doneMessage;
    } else {
      $scope.errormessage = window.__translations_no.forgot.doneMessage;
    }
  }

  $scope.user = {
    email: localStorage.getItem('mealchooser-email') || '',
    password: localStorage.getItem('mealchooser-password') || ''
  };
  $scope.loading = false;


  $scope.checkIfAuthed = function() {
    $scope.initialLoading = true;
    $http.get(settings.apiUrl + '/api/user')
      .success(function(data) {
        $location.path('/app/recommend');
        setTimeout(function() {
          $scope.initialLoading = false;
        }, 0)
      })
      .error(function() {
        $scope.initialLoading = false;
      });
  };

  $scope.login = function() {
    var auth = {
      email: $scope.user.email,
      password: $scope.user.password
    };

    localStorage.setItem('mealchooser-email', auth.email.toLowerCase());

    $scope.loading = true;
    $http.post(settings.apiUrl + '/api/authenticate', auth)
      .success(function(data) {
        localStorage.setItem('mealchooser-password', auth.password);
        $location.path('/app/recommend');
      })
      .error(function(data, b, c) {
        $scope.loading = false;
        console.log('Login error', JSON.stringify(data), data);

        var translations;
        if($translate.preferredLanguage() === 'en') {
          translations = window.__translations_en;
        } else {
          translations = window.__translations_no;
        }


        if(!window.isOnline()) {
          $scope.errormessage = translations.generic.noInternetHeader;
        } else {

          if(data.message === 'Authenticated, but not authorized') {
            console.log('ok=');
            $scope.errormessage = translations.login.wrongpworuser;
          } else {
            $scope.errormessage = data.message || 'Noe fikk feil, prøv igjen senere';
          }

          console.log($scope.errormessage);
        }
      });
  };
  if (window.analytics)
    window.analytics.trackView('LoginController');
})

.controller('ForgotController', function($scope, $http, $location) {

  $scope.email = localStorage.getItem('mealchooser-email') || '';

  $scope.sendEmail = function() {
    $scope.loading = true;
    $http.post(settings.apiUrl + '/api/reset', {email: $scope.email})
      .success(function() {
        localStorage.setItem('mealchooser-reset-password', true);
        $location.path('/account/login');

        $scope.loading = false;
      })
      .error(function(data) {
        $scope.loading = false;
        console.log('Reset password error', JSON.stringify(data));
      })
  }
  if (window.analytics)
    window.analytics.trackView('ForgotPasswordController');
})

.controller('SignoutController', function($http, $location) {
  signout($http, $location);
  if (window.analytics)
    window.analytics.trackView('SignoutController');
})

.controller('HistoryController', function($scope, $http) {
  if(!window.isOnline()) {
    $scope.noInternet = true;
    $scope.loading = true;
    return;
  }

  authCheck($http);
  $scope.loading = true;

  $http.get(settings.apiUrl + '/api/recipes/viewed')
    .success(function(response) {
      $scope.items = response.viewedRecipes.map(function(view) {
        view.recipe.image = view.recipe.image.replace(/(v[0-9]*)/, 'w_100,h_100,c_fill');
        return view;
      });
      $scope.empty = ($scope.items.length === 0);
    })
    .error(function(data) {
      console.log('History error', JSON.stringify(data));
      $scope.empty = true;
    })
    .then(function() {
      $scope.loading = false;
    });

  if (window.analytics)
    window.analytics.trackView('HistoryController');
})

.controller('FavoritesController', function($scope, $http) {
  if(!window.isOnline()) {
    $scope.noInternet = true;
    $scope.loading = true;
    return;
  }

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

  if (window.analytics)
    window.analytics.trackView('FavoritesController');
})

.controller('RecipeController', function($stateParams, $scope, $http, ShoppingCart) {

  if(!window.isOnline()) {
    $scope.noInternet = true;
    $scope.loading = true;
    return;
  }

  authCheck($http);

  $scope.loading = true;
  $scope.info = true;
  var id = parseInt($stateParams.id, 10);

  $http.get(settings.apiUrl + '/api/recipes/' + id)
    .success(function(data, status, headers, config) {
      $scope.recipename = data.recipe.name;
      $scope.procedure = data.recipe.procedure;
      $scope.ingredients = data.recipe.ingredients;
      $scope.image = data.recipe.image.replace(/(v[0-9]*)/, 'w_500,h_280,c_fill');
      $scope.recipehours = Math.floor(data.recipe.time / 60);
      $scope.recipeminutes = data.recipe.time % 60;
      $scope.spicy = data.recipe.spicy;
      $scope.source = data.recipe.source;


      if(data.recipe.currentUserRating) {
        $scope.rated = true;
        $scope.info = false;
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

  // $scope.info = !localStorage.getItem('mealchooser-recipe-info-shown');
  $scope.removeInfo = function() {
    localStorage.setItem('mealchooser-recipe-info-shown', true);
    $scope.info = false;
  };

  $scope.globalRating = 3.5;

  $scope.rated = false;
  $scope.numStars = [1,2,3,4,5];
  $scope.rate = function(stars) {
    $scope.rated = true;
    $scope.info = false;
    $scope.numStarsRated = stars;

    $http.post(settings.apiUrl + '/api/ratings/recipes', {recipeId: id, rating: stars})
      .success(function() { /* todo */ })
      .error(function(data) {
        console.log('Error posting recipe rating', JSON.stringify(data));
      });


    if (window.analytics)
      window.analytics.trackEvent('Rating', 'RecipeRating', $scope.recipename, stars);
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

  $scope.$on('$locationChangeStart', function( event ) {
    $http.post(settings.apiUrl + '/api/recipes/viewed', {recipeId: id, duration: $scope.totalTime})
  });

  $scope.portions = 4;

  $scope.incrementPortions = function() {
    $scope.portions++;
  };

  $scope.decrementPortions = function() {
    $scope.portions = Math.max(1, $scope.portions - 1);
  };

  $scope.convertToFraction = function(a, b) {
    return (new Fraction(a * b).toString())
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
        amount: ($scope.portions * ing.amount),
        unit: ing.unit
      };
    });

    ShoppingCart.add(ingredients);
    window.location = '#/app/shoppingcart';
  };

  $scope.sourceCliked = function() {
    window.open($scope.source, '_system');
  };

  if (window.analytics)
    window.analytics.trackView('RecipeController');
})

.controller('ShoppingCartController', function($scope, ShoppingCart) {
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

  $scope.truncateTitle = function(title) {
    if(title.length > 15) {
      return title.substr(0, 15) + '...';
    }
    return title;
  }

  if (window.analytics)
    window.analytics.trackView('ShoppingCartController')
})

.controller('SearchController', function($scope, $http) {
  if(!window.isOnline()) {
    $scope.noInternet = true;
    $scope.loading = true;
    return;
  }

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

    if (window.analytics)
      window.analytics.trackEvent('Search', 'Search', 'User searched for: ' + q, 5);
  };

  if (window.analytics)
    window.analytics.trackView('SearchController')
})

.controller('RecommenderController', function($scope, $http, $location) {
  if(!window.isOnline()) {
    $scope.noInternet = true;
    $scope.loading = true;
    return;
  }

  $scope.loading = true;

  $scope.infoShown = localStorage.getItem('mealchooser-recommender-info-not-shown');
  $scope.removeInfo = function() {
    localStorage.setItem('mealchooser-recommender-info-not-shown', false);
    $scope.infoShown = true;
  };

  $scope.confirmRecommendation = function() {
    var id = $scope.recommendations[0].recipe.id;
    $http.post(settings.apiUrl + '/api/ratings/recipes/binary', {recipeId: id, rating: true})
    $location.path('/app/recipes/'+id);
    window.analytics.trackEvent('Recommendation', 'YesNo', 'YesNoRating', 1);
  };
  $scope.declineReommendation = function() {
    var id = $scope.recommendations[0].recipe.id;
    $http.post(settings.apiUrl + '/api/ratings/recipes/binary', {recipeId: id, rating: false})
    $scope.recommendations.splice(0, 1);

    window.analytics.trackEvent('Recommendation', 'YesNo', 'YesNoRating', 0);
  };

  $scope.name = '';
  $scope.image = '';
  $scope.description = '';

  $http.get(settings.apiUrl + '/api/recommendation/recipes')
    .success(function(response) {
      $scope.recommendations = response.recommendations;
      $scope.loading = false;
    })
    .error(function(data) {
      console.log('Recommendation error', JSON.stringify(data));
      $scope.loading = false;
      $scope.empty = true;
    })

  $scope.$watch('recommendations', function(newArray) {
    if(newArray && newArray.length) {
      var recipe = newArray[0].recipe;
      $scope.name = recipe.name;
      $scope.image = (recipe.image || '').replace(/(v[0-9]*)/, 'w_300,h_300,c_fill');
      $scope.description = recipe.description;
      $scope.empty = false;
    } else if(newArray && newArray.length == 0) {
      $scope.empty = true;
    }
  }, true);

  $scope.showDescription = function() {
    $scope.showFullDescription = true;
  };

  $scope.getDescriptionClass = function() {
    return $scope.showFullDescription ? 'showFullDescription' : '';
  };

  if (window.analytics)
    window.analytics.trackView('RecommenderController')
})

.controller('ColdstartController', function($scope, $http) {
  authCheck($http);
  if (window.analytics)
    window.analytics.trackView('ColdstartController')
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
    $scope.cards.splice(index, 1);
  };

  $scope.cardSwiped = function() {}


  $scope._xhr;


  $scope.cardSwipedRight = function(index) {
    var cards = $scope.cards[index];
    $scope._xhr = $http.post(settings.apiUrl + '/api/coldstart', {coldStartId: cards.id, answer: true});
  };

  $scope.cardSwipedLeft = function(index) {
    var cards = $scope.cards[index];
    $scope._xhr = $http.post(settings.apiUrl + '/api/coldstart', {coldStartId: cards.id, answer: false});
  };


  $scope.$watch('cards', function(newArray, old) {
    if(newArray.length === 0 && old.length === 1) {

      var fn = function() {
        $scope.loading = false;
        $location.path('/app/recommend');
      }

      $scope._xhr.success(fn).error(fn);
    }
  }, true);
})

.controller('SettingsController', function($scope, $http, $ionicModal, $translate, $ionicPopup, $location) {
  authCheck($http);

  var convertGender = function(sex) {
    return sex;
    if(typeof sex === 'boolean') { return sex ? 'male' : 'female' }
    return sex === 'male';
  };

  $scope.settings = {
    // email: 'pelle@krogstad.no',
    // name: 'Pelle Krogstad',
    allergies: {}
  };

  $http.get(settings.apiUrl + '/api/user')
    .success(function(response) {
      var user = response.user;
      user.sex = convertGender(user.sex);

      $scope.user = user;
      $scope.settings.email = user.email;
      $scope.settings.name = user.firstName + ' ' + user.lastName;
    })

  $scope.change = function() {
    if($scope.user.yearBorn) { $scope.user.yearBorn = parseInt($scope.user.yearBorn); }
    $http.put(settings.apiUrl + '/api/user', $scope.user)
      .error(function(data) {
        console.log('Error updating user', JSON.stringify(data));
      });
  };

  $ionicModal.fromTemplateUrl('templates/apps/about.modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.loading = true;
    $scope.modal = modal;

    var lang = $translate.preferredLanguage() === 'en' ? 'EN-en' : 'NO-no';

    $http.get(settings.apiUrl + '/about')
      .success(function(response) {
        $scope.abouttext = response;
        $scope.loading = false;
      })
      .error(function(data) {
        $scope.abouttext = 'Error fetching';
        console.log('Error fetching about', JSON.stringify(data));
        $scope.loading = false;
      })
  });

  $scope.showAboutModal = function() {
    $scope.modal.show();
  }
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  var strings;
  if($translate.preferredLanguage() === 'en') {
    strings = window.__translations_en;
  } else {
    strings = window.__translations_no;
  }

  $scope.resetKnowledgeBase = function() {
    var title = strings.settings.resetMyAIWarningHeader;
    var template = strings.settings.resetMyAIWarningDescription;
    var confirmPopup = $ionicPopup.confirm({
      title: title,
      template: template,
      buttons: [
        {
          type: 'button-default',
          text: 'No',
          onTap: function() { return false; }
        },
        {
          type: 'button-positive',
          text: 'Yes',
          onTap: function() { return true; }
        }
      ]
    });
    confirmPopup.then(function(res) {
      if(res) {
        // TODO: Send request to remove all AI-collections.
      }
    });
  };

  $scope.resetLocalStorage = function() {
    var title = strings.settings.resetLocalStorageHeader;
    var template = strings.settings.resetLocalStorageDescription;
    var confirmPopup = $ionicPopup.confirm({
      title: title,
      template: template,
      buttons: [
        {
          type: 'button-default',
          text: 'No',
          onTap: function() { return false; }
        },
        {
          type: 'button-positive',
          text: 'Yes',
          onTap: function() { return true; }
        }
      ]
    });
    confirmPopup.then(function(res) {
      if(res) {
        localStorage.clear();
        $location.path('/app/coldstart');
      }
    });
  };

  if (window.analytics)
    window.analytics.trackView('SettingsController')
});
