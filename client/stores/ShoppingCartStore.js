(function () {
    'use strict';

    var Fluxxor  = require('fluxxor');

    var remote   = require('remote')
        , util   = remote.require('./client/util')
        , client = remote.require('tvdb-api-client')
        , glob   = remote.require('glob')
        , fs     = remote.require('fs-extra')
        , path   = remote.require('path')
        , q      = require('q');

    var constants = {
        ADD_CART_ITEM: 'ADD_CART_ITEM',
        REMOVE_CART_ITEM: 'REMOVE_CART_ITEM',
        CLEAR_CART_ITEMS: 'CLEAR_CART_ITEMS',
        SAVE_CART_ITEMS: 'SAVE_CART_ITEMS',
        ADD_FOLDERS_TO_CART_ITEM: 'ADD_FOLDERS_TO_CART_ITEM',
        RUN_TASKLIST: 'RUN_TASKLIST'
    };

    var ShoppingCartStore = Fluxxor.createStore({
        initialize: function () {
            this.cart = JSON.parse(localStorage.getItem('nightlife2:shoppingCart')) || [];
            this.progress = {min: 0, max: 100, count: 0};
            this.bindActions(
                constants.ADD_CART_ITEM, this.onAddCartItem,
                constants.REMOVE_CART_ITEM, this.onRemoveCartItem,
                constants.CLEAR_CART_ITEMS, this.onClearCartItems,
                constants.SAVE_CART_ITEMS, this.onSaveCartItems,
                constants.ADD_FOLDERS_TO_CART_ITEM, this.onAddFoldersToCartItem,
                constants.RUN_TASKLIST, this.onRunTasklist
            );
        },
        onAddCartItem: function (payload) {
            this.cart.push(payload.item);
            this.emit('change');
            this.onSaveCartItems();
        },
        onRemoveCartItem: function (payload) {
            delete payload.item.tasklist;
            this.cart = _.filter(this.cart, payload.item);
            this.emit('change');
            this.onSaveCartItems();
        },
        onClearCartItems: function () {
            this.cart = [];
            this.emit('change');
            this.onSaveCartItems();
        },
        onSaveCartItems: function () {
            localStorage.setItem('nightlife2:shoppingCart', JSON.stringify(this.cart));
        },
        onAddFoldersToCartItem: function (payload) {
            var item = _.find(this.cart, {id: payload.item.id, language: payload.item.language});
            if (item) {
                var queue = _.map(payload.folders, function (folder) {
                    return q.nfcall(glob, folder + '/**/*.+(' + util.conf.getValue('extensions') + ')');
                });
                var self = this;
                q.all(queue)
                .then(function (files) {
                    item.files = _.flatten(files);
                    util.logger.debug(item.files);
                    return item;
                })
                .then(function (item) {
                    return client.fetchEpisodes(item.id, item.language);
                })
                .then(function (episodeslist) {
                    item.episodes = episodeslist;
                    var re = /S(\d+)E(\d+)|(\d+)x(\d+)/i;
                    var tasklist = _.chain(item.files)
                    .map(function (file) {
                        var match = path.basename(file).match(re);
                        if (match && match.length) {
                            var seasonNumber = match[1] || match[3];
                            var episodeNumber = match[2] || match[4];
                            var episode = _.find(episodeslist, function (item) {
                                return item.season == seasonNumber && item.episode == episodeNumber;
                            });
                            if (episode) {
                                return {
                                    in: file,
                                    out: util.engine.render(util.conf.getValue('filename'), {
                                        series: item,
                                        episode: episode,
                                        extension: path.extname(file),
                                        basepath: util.conf.getValue('basepath')
                                    })
                                };
                            }
                        } else {
                            util.logger.debug('skip file:', file);
                        }
                    })
                    .filter(function (task) {
                        return task;
                    })
                    .value();
                    util.logger.debug(tasklist);
                    if (_.isArray(item.tasklist)) {
                        item.tasklist = item.tasklist.concat(tasklist);
                    } else {
                        item.tasklist = tasklist;
                    }
                    util.logger.debug(item.tasklist);
                    self.emit('change');
                    self.onSaveCartItems();
                })
                .catch(function (err) {
                    util.logger.error(err.stack);
                })
                .done();
            }
        },
        onRunTasklist: function () {
            var self = this;
            _.chain(this.cart)
            .reduce(function (prev, item) {
                return prev.concat(item.tasklist);
            }, [])
            .tap(function (map) {
                self.progress.max = map.length;
            })
            .reduce(function (prev, task) {
                return prev.then(q.nfcall(fs.ensureDir, path.dirname(task.out)))
                .then(q.nfbind(fs.copy, task.in, task.out))
                .then(function () {
                    self.progress.count += 1;
                    self.emit('change');
                    return self.progress;
                });
            }, q())
            .value()
            .then(function () {
                self.cart = _.filter(self.cart, function (item) {
                    return !_.isArray(item.tasklist);
                });
                self.emit('change');
            })
            .catch(function (err) {
                util.logger.error(err.stack);
            })
            .finally(function () {
                self.progress = {min: 0, max: 0, count: 0};
                self.emit('change');
            })
            .done();
        },
        getState: function () {
            return this.cart;
        },
        isCartItem: function (item) {
            return _.indexOf(this.cart, item) > -1;
        },
        getProgress: function () {
            return this.progress;
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
        },
        saveCartItems: function () {
            this.dispatch(constants.SAVE_CART_ITEMS);
        },
        addFoldersToCartItem: function (item, folders) {
            this.dispatch(constants.ADD_FOLDERS_TO_CART_ITEM, {item: item, folders: folders});
        },
        runTasklist: function () {
            this.dispatch(constants.RUN_TASKLIST);
        }
    };

    module.exports.actions = actions;
}());
