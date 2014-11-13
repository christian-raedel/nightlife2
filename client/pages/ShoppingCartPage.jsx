/** @jsx React.DOM */

(function () {
    'use strict';

    var Fluxxor           = require('fluxxor')
        , FluxMixin       = Fluxxor.FluxMixin(React)
        , StoreWatchMixin = Fluxxor.StoreWatchMixin;

    var remote            = require('remote')
        , util            = remote.require('./client/util')
        , dialog          = remote.require('dialog');

    var Mousetrap         = require('mousetrap');

    var ShoppingCartPage = React.createClass({
        mixins: [FluxMixin, StoreWatchMixin('ShoppingCartStore')],
        getStateFromFlux: function () {
            var flux = this.getFlux();
            return {
                shoppingCart: flux.store('ShoppingCartStore').getState(),
                progress: flux.store('ShoppingCartStore').getProgress()
            };
        },
        componentDidMount: function () {
            var self = this;
            _.range(1, 10).map(function (key) {
                Mousetrap.bind('ctrl+' + key, function () {
                    if (self.state.shoppingCart[key - 1]) {
                        self.openDirectory(self.state.shoppingCart[key - 1]);
                    }
                });
            });
            Mousetrap.bind('ctrl+s', function () {
                if (self.state.shoppingCart.length && !self.state.progress.count) {
                    self.getFlux().actions.fastRunTasklist();
                }
            });
            Mousetrap.bind('ctrl+l', function () {
                if (self.state.shoppingCart.length && !self.state.progress.count) {
                    self.getFlux().actions.clearCartItems();
                }
            });
        },
        openDirectory: function (item, ev) {
            var self = this;
            dialog.showOpenDialog({
                title: 'Ordner hinzufügen',
                properties: ['openDirectory', 'multiSelections']
            }, function (folders) {
                self.getFlux().actions.addFoldersToCartItem(item, folders);
            });
        },
        render: function () {
            return (
                <section>
                    <div className="panel panel-success">
                        <div className="panel-heading" style={{minHeight: '69px'}}>
                            <div className="panel-title">
                                <h2 className="col-md-10">Aufgaben auf Warenkorb anwenden:</h2>
                                {
                                    this.state.shoppingCart.length && !this.state.progress.count ?
                                        <div className="btn-group pull-right">
                                            <button type="button" className="btn btn-success"
                                                onClick={this.getFlux().actions.clearCartItems}>
                                                <span className="glyphicon glyphicon-trash"></span>
                                            </button>
                                            <button type="button" className="btn btn-success"
                                                onClick={this.getFlux().actions.fastRunTasklist}>
                                                <span className="glyphicon glyphicon-play"></span>
                                            </button>
                                        </div>
                                        :
                                        <div className="btn-group pull-right">
                                            <button type="button" className="btn btn-success" disabled="disabled">
                                                <span className="glyphicon glyphicon-trash"></span>
                                            </button>
                                            <button type="button" className="btn btn-success" disabled="disabled">
                                                <span className="glyphicon glyphicon-play"></span>
                                            </button>
                                        </div>
                                }
                            </div>
                        </div>
                        <div className="panel-body">
                            <div className="progress">
                                <div className="progress-bar progress-bar-success progress-bar-striped" role="progressbar"
                                    style={{width: Math.round(this.state.progress.finished * 100 / this.state.progress.max) + '%'}}>
                                    <span>{Math.round(this.state.progress.finished * 100 / this.state.progress.max) + '%'}</span>
                                </div>
                                <div className="progress-bar progress-bar-warning progress-bar-striped active" role="progressbar"
                                    style={{width: Math.round(this.state.progress.count * 100 / this.state.progress.max) + '%'}}>
                                </div>
                            </div>
                        </div>
                        {
                            this.state.progress.task ?
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td width="10%"><b>Kopiere</b></td>
                                            <td width="90%">{this.state.progress.task.in}</td>
                                        </tr>
                                        <tr>
                                            <td width="10%"><b>nach</b></td>
                                            <td width="90%">{this.state.progress.task.out}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                :
                                <div />
                        }
                    </div>
                    {
                        this.state.shoppingCart.length ?
                        _.map(this.state.shoppingCart, function (item) {
                            return (
                                <div key={util.random()} className="panel panel-primary">
                                    <div className="panel-heading" style={{minHeight: '69px'}}>
                                        <div className="panel-title">
                                            <h2 className="col-md-10">{item.name}</h2>
                                            <div className="btn-group pull-right">
                                                <button type="button" className="btn btn-primary"
                                                    onClick={this.getFlux().actions.removeCartItem.bind(null, item)}>
                                                    <span className="glyphicon glyphicon-trash"></span>
                                                </button>
                                                <button type="button" className="btn btn-primary"
                                                    onClick={this.openDirectory.bind(null, item)}>
                                                    <span className="glyphicon glyphicon-film"></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        (item.tasklist && item.tasklist.length) ?
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th width="47%">Alter Dateiname:</th>
                                                        <th width="6%"><span className="glyphicon glyphicon-random"></span></th>
                                                        <th width="47%">Neuer Dateiname:</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {_.map(item.tasklist, function (task) {
                                                        return (
                                                            <tr key={util.random()}>
                                                                <td>{task.in}</td>
                                                                <td>
                                                                    <span className={'glyphicon glyphicon-' + (task.in === task.out ? 'resize-horizontal' : 'arrow-right')}>
                                                                    </span>
                                                                </td>
                                                                <td>{task.out}</td>
                                                            </tr>
                                                        );
                                                    }, this)}
                                                </tbody>
                                            </table>
                                            :
                                            <div className="alert alert-warning">
                                                <p>Momentan werden keine Dateien für diese Serie bearbeitet. Klicke auf &ldquo;Ordner hinzufügen&rdquo;!</p>
                                            </div>
                                    }
                                </div>
                            );
                        }, this)
                        :
                        <div className="alert alert-warning">
                            <p className="center-block">Es befindet sich keine einzige Serie im Warenkorb!</p>
                        </div>
                    }
                </section>
            );
        }
    });

    module.exports = ShoppingCartPage;
}());
