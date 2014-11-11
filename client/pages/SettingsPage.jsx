/** @jsx React.DOM */

(function () {
    'use strict';

    var remote = require('remote')
        , util = remote.require('./client/util');

    var SettingsPage = React.createClass({
        getInitialState: function () {
            return {config: util.conf.config};
        },
        updateConfig: function (key, ev) {
            var value = ev.target.value.trim();
            var int = _.parseInt(value);
            if (!_.isNaN(int)) {
                value = int;
            }
            util.conf.setValue(key, value);
            this.setState({config: util.conf.config});
        },
        saveSettings: function () {
            util.saveConf();
        },
        render: function () {
            return (
                <section>
                    <div className="panel panel-primary">
                        <div className="panel-heading">
                            <h2 className="panel-title">Einstellungen</h2>
                        </div>
                        <div className="panel-body">
                            <form role="form">
                                <div className="form-group">
                                    <label htmlFor="language">Sprache:</label>
                                    <input type="text" className="form-control" id="language"
                                        value={this.state.config.language} onChange={this.updateConfig.bind(null, 'language')} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="basepath">Medienordner:</label>
                                    <input type="text" className="form-control" id="basepath"
                                        value={this.state.config.basepath} onChange={this.updateConfig.bind(null, 'basepath')} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="filename">Vorlage für den Dateinamen:</label>
                                    <input type="text" className="form-control" id="filename"
                                        value={this.state.config.filename} onChange={this.updateConfig.bind(null, 'filename')} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="extensions">Suche nur Dateinamen mit diesen Dateiendungen:</label>
                                    <input type="text" className="form-control" id="extensions"
                                        value={this.state.config.extensions} onChange={this.updateConfig.bind(null, 'extensions')} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="concurrent-operations">Anzahl gleichzeitiger Dateioperationen:</label>
                                    <input type="text" className="form-control" id="concurrent-operations"
                                        value={this.state.config.concurrentOperations} onChange={this.updateConfig.bind(null, 'concurrentOperations')} />
                                </div>
                            </form>
                        </div>
                        <div className="panel-footer">
                            <button type="button" className="btn btn-primary" onClick={this.saveSettings}>
                                <span className="glyphicon glyphicon-floppy-disk"></span>&nbsp;Speichern
                            </button>
                        </div>
                    </div>
                </section>
            );
        }
    });

    module.exports = SettingsPage;
}());
