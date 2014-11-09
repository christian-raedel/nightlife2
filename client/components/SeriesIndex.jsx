/** @jsx React.DOM */

(function () {
    'use strict';

    var remote            = require('remote')
        , util            = remote.require('./client/util')
        , client          = remote.require('tvdb-api-client')
        , shell           = require('shell');

    var Fluxxor           = require('fluxxor')
        , FluxMixin       = Fluxxor.FluxMixin(React)
        , StoreWatchMixin = Fluxxor.StoreWatchMixin;

    var SeriesIndex = React.createClass({
        mixins: [FluxMixin, StoreWatchMixin('LanguageStore', 'ShoppingCartStore')],
        getStateFromFlux: function () {
            var flux = this.getFlux();
            return {
                supportedLanguages: flux.store('LanguageStore').getState(),
                shoppingCart: flux.store('ShoppingCartStore').getState()
            };
        },
        componentWillMount: function () {
            this.getFlux().actions.loadLanguageItems();
        },
        showDetails: function (item) {
            var url = util.engine.render('http://thetvdb.com/index.php?tab=series&id={{seriesId}}&lid={{languageId}}', {
                seriesId: item.id,
                languageId: this.getFlux().store('LanguageStore').getLanguage(item.language).id
            });
            shell.openExternal(url);
        },
        render: function () {
            return (
                <section>
                    {_.map(this.props.data, function (item) {
                        return (
                            <div key={item.id.toString() + item.language}
                                className={'panel panel-' + (item.language === util.conf.getValue('language') ? 'success' : 'danger')}>
                                <div className="panel-heading" style={{minHeight: '69px'}}>
                                    <div className="panel-title">
                                        <h2 className="col-md-10">{item.name}</h2>
                                        <div className="btn-group pull-right">
                                            <button type="button" className="btn btn-primary" onClick={this.showDetails.bind(null, item)}>
                                                <span className="glyphicon glyphicon-eye-open"></span>
                                            </button>
                                            {
                                                this.getFlux().store('ShoppingCartStore').isCartItem(item) ?
                                                    <button type="button" className="btn btn-primary" disabled="disabled">
                                                        <span className="glyphicon glyphicon-check"></span>
                                                    </button>
                                                    :
                                                    <button type="button" className="btn btn-primary"
                                                        onClick={this.getFlux().actions.addCartItem.bind(null, item)}>
                                                        <span className="glyphicon glyphicon-shopping-cart"></span>
                                                    </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="panel-body">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th width="15%">ID:&nbsp;{item.id || '?'}</th>
                                                <th width="20%">Sprache:&nbsp;{this.getFlux().store('LanguageStore').getLanguage(item.language).name || '?'}</th>
                                                <th width="45%">Sender:&nbsp;{item.network || '?'}</th>
                                                <th width="20%">Erstausstrahlung:&nbsp;{item.firstAired || '?'}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Inhalt:</td>
                                                <td colSpan="3">{item.overview || 'Keine Inhaltsangabe verfügbar.'}</td>
                                            </tr>
                                            <tr style={item.alias.length ? {} : {display: 'none'}}>
                                                <td>Alternative Titel:</td>
                                                <td colSpan="3">
                                                    <ul>
                                                        {_.map(item.alias.split('|'), function (alias, idx) {
                                                            if (alias.length) {
                                                                return (
                                                                    <li key={idx}>{alias}</li>
                                                                );
                                                            }
                                                        })}
                                                    </ul>
                                                </td>
                                            </tr>
                                            <tr style={item.banner.length ? {} : {display: 'none'}}>
                                                <td colSpan="4">
                                                    <img className="thumbnail center-block" src={'http://thetvdb.com/banners/' + item.banner} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    }, this)}
                </section>
            );
        }
    });

    module.exports = SeriesIndex;
}());
