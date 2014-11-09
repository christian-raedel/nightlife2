(function () {
    'use strict';

    var Fluxxor  = require('fluxxor');

    var remote   = require('remote')
        , client = remote.require('tvdb-api-client')
        , util   = remote.require('./client/util');

    var constants = {
        FETCH_SERIES_ITEMS: 'FETCH_SERIES_ITEMS'
    };

    var SearchStore = Fluxxor.createStore({
        initialize: function () {
            this.serieslist = [];
            this.isRunning = false;
            this.bindActions(
                constants.FETCH_SERIES_ITEMS, this.onFetchSeriesItems
            );
        },
        onFetchSeriesItems: function (query) {
            this.isRunning = true;
            var self = this;
            client.fetchSeries(query.name, query.language)
            .then(function (serieslist) {
                self.serieslist = serieslist;
                self.isRunning = false;
                self.emit('change');
            })
            .catch(util.errordlg)
            .done();
        },
        getState: function () {
            return this.serieslist
        },
        getFetchStatus: function () {
            return this.isRunning;
        }
    });

    module.exports = SearchStore;

    var actions = {
        fetchSeriesItems: function (name) {
            this.dispatch(constants.FETCH_SERIES_ITEMS, {name: name, language: util.conf.getValue('language')});
        }
    };

    module.exports.actions = actions;
}());
