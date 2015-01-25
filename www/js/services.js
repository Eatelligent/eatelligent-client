angular.module('starter.services', [])

.factory('ShoppingCart', function() {
  var cart = JSON.parse(localStorage.getItem('mealchooser-shoppingcart')) || [];

  return {
    all: function() {
      return cart;
    },

    add: function(items) {
      items.forEach(function(item) {
        cart.push(item);
      });
      localStorage.setItem('mealchooser-shoppingcart', JSON.stringify(cart))
    },

    remove: function(item) {
      cart.forEach(function(cartitem, i) {
        if(item.$$hashKey === cartitem.$$hashKey) {
          cart.splice(i, 1);
        }
      });

      localStorage.setItem('mealchooser-shoppingcart', JSON.stringify(cart));
    }
  }
})
;
