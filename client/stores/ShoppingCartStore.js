(function () {
    'use strict';

    var Fluxxor = require('fluxxor');

    var constants = {
        ADD_CART_ITEM: 'ADD_CART_ITEM',
        REMOVE_CART_ITEM: 'REMOVE_CART_ITEM',
        CLEAR_CART_ITEMS: 'CLEAR_CART_ITEMS'
    };

    var ShoppingCartStore = Fluxxor.createStore({
        initialize: function () {
            this.cart = [];
            this.bindActions(
                constants.ADD_CART_ITEM, this.onAddCartItem,
                constants.REMOVE_CART_ITEM, this.onRemoveCartItem,
                constants.CLEAR_CART_ITEMS, this.onClearCartItems
            );
        },
        onAddCartItem: function (payload) {
            this.cart.push(payload.item);
            this.emit('change');
        },
        onRemoveCartItem: function (payload) {
            this.cart = _.filter(this.cart, function (item) {
                return item.id !== payload.item.id;
            });
            this.emit('change');
        },
        onClearCartItems: function () {
            this.cart = [];
            this.emit('change');
        },
        getState: function () {
            return this.cart;
        },
        isCartItem: function (item) {
            return _.indexOf(this.cart, item) > -1;
        }
    });

    module.exports = ShoppingCartStore;

    var actions = {
        addCartItem: function (item) {
            this.dispatch(constants.ADD_CART_ITEM, {item: item});
        },
        removeCartItem: function (item) {
            this.dispatch(constants.REMOVE_CART_ITEM, {item: item});
        },
        clearCartItems: function () {
            this.dispatch(constants.CLEAR_CART_ITEMS);
        }
    };

    module.exports.actions = actions;
}());
