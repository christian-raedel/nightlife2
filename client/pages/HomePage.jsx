/** @jsx React.DOM */

(function () {
    'use strict';

    var remote = require('remote')
        , util = remote.require('./client/util');

    var Style  = require('../styles/page.less');

    var HomePage = React.createClass({
        render: function () {
            return (
                <div className="jumbotron">
                    <h1 className="greetz">{util.conf.getValue('greetz')}</h1>
                    <div className="pull-right">
                        <img className="img-circle" src={util.conf.getValue('logo')} />
                        <p><a className="btn btn-success" href="#/search" role="button">Los gehts!</a></p>
                    </div>
                </div>
            );
        }
    });

    module.exports = HomePage;
}());
