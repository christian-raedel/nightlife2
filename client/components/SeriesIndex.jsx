/** @jsx React.DOM */

(function () {
    'use strict';

    var remote   = require('remote')
        , util   = remote.require('./client/util')
        , client = remote.require('tvdb-api-client')
        , shell  = require('shell');

    var SeriesIndex = React.createClass({
        getInitialState: function () {
            return {supportedLanguages: []};
        },
        componentWillMount: function () {
            var self = this;
            util.conf.getValue('supportedLanguages')
            .then(function (languages) {
                util.logger.debug(languages);
                self.setState({supportedLanguages: languages});
            })
            .catch(util.errordlg)
            .done();
        },
        showDetails: function (item) {
            var url = util.engine.render('http://thetvdb.com/index.php?tab=series&id={{seriesId}}&lid={{languageId}}', {
                seriesId: item.id,
                languageId: _.find(this.state.supportedLanguages, {abbreviation: item.language}).id
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
                                <div className="panel-heading" style={{minHeight: '55px'}}>
                                    <h3 className="panel-title">
                                        {item.name}
                                        <div className="btn-group pull-right">
                                            <button type="button" className="btn btn-primary" onClick={this.showDetails.bind(null, item)}>
                                                <span className="glyphicon glyphicon-eye-open"></span>
                                            </button>
                                            <button type="button" className="btn btn-primary">
                                                <span className="glyphicon glyphicon-shopping-cart"></span>
                                            </button>
                                        </div>
                                    </h3>
                                </div>
                                <div className="panel-body">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th width="15%">ID:&nbsp;{item.id || '?'}</th>
                                                <th width="20%">Sprache:&nbsp;{_.find(this.state.supportedLanguages, {abbreviation: item.language}).name || '?'}</th>
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
                                                        {_.map(item.alias.split('|'), function (alias) {
                                                            if (alias.length) {
                                                                return (
                                                                    <li>{alias}</li>
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
