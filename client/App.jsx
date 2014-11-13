/** @jsx React.DOM */

(function () {
    'use strict';

    var Router             = require('react-router')
        , Routes           = Router.Routes
        , Route            = Router.Route
        , DefaultRoute     = Router.DefaultRoute;

    var HomePage           = require('./pages/HomePage')
        , SearchPage       = require('./pages/SearchPage')
        , ShoppingCartPage = require('./pages/ShoppingCartPage')
        , SettingsPage     = require('./pages/SettingsPage');

    var Style              = require('./styles/page.less');

    var Stores             = require('./stores/Stores');

    var Fluxxor            = require('fluxxor')
        , FluxMixin        = Fluxxor.FluxMixin(React)
        , StoreWatchMixin  = Fluxxor.StoreWatchMixin;

    var Mousetrap          = require('mousetrap');

    var App = React.createClass({
        mixins: [FluxMixin, StoreWatchMixin('LanguageStore', 'ShoppingCartStore', 'SearchStore')],
        getStateFromFlux: function () {
            var flux = this.getFlux();
            return {
                supportedLanguages: flux.store('LanguageStore').getState(),
                shoppingCart: flux.store('ShoppingCartStore').getState(),
                serieslist: flux.store('SearchStore').getState()
            };
        },
        componentDidMount: function () {
            Mousetrap.bind('/', function () {
                window.location.href = '#/search';
            });
            Mousetrap.bind('ctrl+w', function () {
                window.location.href = '#/shopping-cart';
            });
        },
        activateLink: function (ev) {
            $('ul.nav.navbar-nav>li').removeClass('active');
            $(ev.target).parents('li').addClass('active');
        },
        render: function () {
            return (
                <section className="container">
                    <header className="row">
                        <nav className="navbar navbar-inverse" role="navigation">
                            <div className="container-fluid">
                                <div className="navbar-header">
                                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse">
                                        <span className="sr-only">Navigator</span>
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                    </button>
                                    <a className="navbar-brand" href="#/">Nightlife 2</a>
                                </div>
                                <div className="collapse navbar-collapse" id="navbar-collapse">
                                    <ul className="nav navbar-nav">
                                        <li>
                                            <a href="#/search" onClick={this.activateLink}>
                                                <span className="glyphicon glyphicon-search"></span>&nbsp;Suche
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#/shopping-cart" onClick={this.activateLink}>
                                                <span className="glyphicon glyphicon-shopping-cart"></span>&nbsp;Warenkorb
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#/settings" onClick={this.activateLink}>
                                                <span className="glyphicon glyphicon-cog"></span>&nbsp;Einstellungen
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </header>
                    <this.props.activeRouteHandler />
                </section>
            );
        }
    });

    var Layout = (
        <Routes>
            <Route name="app" path="/" handler={App} flux={Stores}>
                <DefaultRoute handler={HomePage} />
                <Route name="search" handler={SearchPage} />
                <Route name="shopping-cart" handler={ShoppingCartPage} />
                <Route name="settings" handler={SettingsPage} />
            </Route>
        </Routes>
    );

    React.render(Layout, document.body);
}());
