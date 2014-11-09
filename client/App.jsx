/** @jsx React.DOM */

(function () {
    'use strict';

    var Router          = require('react-router')
        , Routes        = Router.Routes
        , Route         = Router.Route
        , DefaultRoute  = Router.DefaultRoute;

    var HomePage        = require('./pages/HomePage')
        , SearchPage    = require('./pages/SearchPage')
        , SettingsPage  = require('./pages/SettingsPage');

    var Style           = require('./styles/page.less');

    var App = React.createClass({
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
                                        {/**<li className="active"><a href="#/"><span className="glyphicon glyphicon-cloud"></span>&nbsp;Start</a></li>**/}
                                        <li><a href="#/search"><span className="glyphicon glyphicon-search"></span>&nbsp;Suche</a></li>
                                        <li><a href="#/settings"><span className="glyphicon glyphicon-cog"></span>&nbsp;Einstellungen</a></li>
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
            <Route name="app" path="/" handler={App}>
                <DefaultRoute handler={SearchPage} />
                <Route name="search" handler={SearchPage} />
                <Route name="settings" handler={SettingsPage} />
            </Route>
        </Routes>
    );

    React.render(Layout, document.body);
}());
