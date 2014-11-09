/** @jsx React.DOM */

(function () {
    'use strict';

    var remote      = require('remote')
        , util      = remote.require('./client/util')
        , client    = remote.require('tvdb-api-client');

    var SeriesIndex = require('../components/SeriesIndex');

    var SearchPage = React.createClass({
        getInitialState: function () {
            return {serieslist: [], queryStarted: false, query: ''};
        },
        componentDidMount: function () {
            this.refs.query.getDOMNode().focus();
        },
        handleKeyPress: function (ev) {
            if (ev.which === 13) {
                this.searchSeries();
            }
        },
        queryChange: function (ev) {
            this.setState({query: ev.target.value, queryStarted: false});
        },
        searchSeries: function (ev) {
            var self = this;
            client.fetchSeries(this.state.query, util.conf.getValue('language'))
            .then(function (serieslist) {
                self.setState({serieslist: serieslist, queryStarted: !serieslist.length});
                util.logger.debug(serieslist);
            })
            .catch(util.errordlg)
            .done();
        },
        render: function () {
            return (
                <section>
                    <div className="panel panel-primary">
                        <div className="panel-heading">
                            <h3 className="panel-title">
                                Seriensuche:&nbsp;
                                <span className="badge badge-primary">
                                    {this.state.serieslist.length ? this.state.serieslist.length : null}
                                </span>
                            </h3>
                        </div>
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="input-group">
                                        <input ref="query" type="text" className="form-control" placeholder="Serienname"
                                            onKeyPress={this.handleKeyPress} onChange={this.queryChange} />
                                        <span className="input-group-btn">
                                            <button className="btn btn-success" type="button" onClick={this.searchSeries}>
                                                <span className="glyphicon glyphicon-search"></span>&nbsp;Los!
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'alert alert-warning ' + (this.state.queryStarted && !this.state.serieslist.length ? 'show' : 'hide')}
                        role="alert">
                        <p>Es wurden keine Serien unter dem Namen &ldquo;{this.state.query}&rdquo; gefunden.</p>
                    </div>
                    <div className={'' + (this.state.serieslist.length ? 'show' : 'hide')}>
                        <SeriesIndex data={this.state.serieslist} />
                    </div>
                </section>
            );
        }
    });

    module.exports = SearchPage;
}());
