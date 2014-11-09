(function () {
    'use strict';

    var Fluxxor  = require('fluxxor');

    var remote   = require('remote')
        , util   = remote.require('./client/util')
        , client = remote.require('tvdb-api-client');

    var constants = {
        ADD_LANGUAGE_ITEMS: 'ADD_LANGUAGE_ITEMS',
        CLEAR_LANGUAGE_ITEMS: 'CLEAR_LANGUAGE_ITEMS',
        LOAD_LANGUAGE_ITEMS: 'LOAD_LANGUAGE_ITEMS'
    };

    var LanguageStore = Fluxxor.createStore({
        initialize: function () {
            this.languages = [];
            this.bindActions(
                constants.ADD_LANGUAGE_ITEMS, this.onAddLanguageItems,
                constants.CLEAR_LANGUAGE_ITEMS, this.onClearLanguageItems,
                constants.LOAD_LANGUAGE_ITEMS, this.onLoadLanguageItems
            );
        },
        onAddLanguageItems: function (payload) {
            this.languages = _.chain(this.languages)
            .concat(payload.item)
            .uniq(function (item) {
                return item.id;
            })
            .value();
            this.emit('change');
        },
        onClearLanguageItems: function () {
            this.languages = [];
            this.emit('change');
        },
        onLoadLanguageItems: function () {
            var self = this;
            client.fetchLanguages()
            .then(function (languages) {
                self.languages = languages;
                self.emit('change');
            })
            .catch(util.errordlg)
            .done();
        },
        getState: function () {
            return this.languages;
        },
        getLanguage: function (abbreviation) {
            return _.find(this.languages, {abbreviation: abbreviation});
        }
    });

    module.exports = LanguageStore;

    var actions = {
        addLanguageItems: function (items) {
            this.dispatch(constants.ADD_LANGUAGE_ITEMS, {items: items});
        },
        clearLanguageItems: function () {
            this.dispatch(constants.CLEAR_LANGUAGE_ITEMS);
        },
        loadLanguageItems: function () {
            this.dispatch(constants.LOAD_LANGUAGE_ITEMS);
        }
    };

    module.exports.actions = actions;
}());
