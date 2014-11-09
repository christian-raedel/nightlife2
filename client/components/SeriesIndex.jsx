/** @jsx React.DOM */

(function () {
    'use strict';

    var remote = require('remote')
        , util = remote.require('./client/util');

    var SeriesIndex = React.createClass({
        render: function () {
            return (
                <section>
                    {_.map(this.props.data, function (item) {
                        return (
                            <div key={item.id.toString() + item.language}
                                className={'panel panel-' + (item.language === util.conf.getValue('language') ? 'success' : 'danger')}>
                                <div className="panel-heading">
                                    <h3 className="panel-title">{item.name}</h3>
                                </div>
                                <div className="panel-body">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th width="15%">ID:&nbsp;{item.id || '?'}</th>
                                                <th width="20%">Sprache:&nbsp;{item.language.toUpperCase() || '?'}</th>
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
