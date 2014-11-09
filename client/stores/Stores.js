(function () {
    'use strict';

    var remote              = require('remote')
        , util              = remote.require('./client/util')
        , Fluxxor           = require('fluxxor');

    var LanguageStore       = require('./LanguageStore')
        , ShoppingCartStore = require('./ShoppingCartStore')
        , SearchStore       = require('./SearchStore');

    var stores = {
        LanguageStore: new LanguageStore(),
        ShoppingCartStore: new ShoppingCartStore(),
        SearchStore: new SearchStore()
    };

    var actions = _.merge(
        {},
        LanguageStore.actions,
        ShoppingCartStore.actions,
        SearchStore.actions
    );

    var flux = new Fluxxor.Flux(stores, actions);

    flux.on('dispatch', function (type, payload) {
        util.logger.info('[Dispatch]', type, payload);
    });

    module.exports = flux;
}());
