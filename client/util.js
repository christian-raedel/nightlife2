(function () {
    'use strict';

    var CLogger  = require('node-clogger')
        , CConf  = require('node-cconf')
        , engine = require('dna').createDNA()
        , client = require('tvdb-api-client')
        , path   = require('path')
        , argv   = require('yargs').default('config', path.resolve(__dirname, '..', 'config.yml')).argv
        , dialog = require('dialog')
        , _      = require('lodash');

    var logger = new CLogger({name: 'nightlife2'});
    module.exports.logger = logger;

    var conf = new CConf('nightlife2', ['basepath', 'filename'], {
        supportedLanguages: client.fetchLanguages()
    }).load(argv.config);
    module.exports.conf = conf;

    var re = /\^|\.|\/|\:|\0|\*|\?|\\|\"|<|>|\|/g;
    engine.use('escape', function (value) {
        return value.toString().replace(re, '_');
    });

    engine.use('number', function (value, length) {
        value = value.toString();
        while (value.length !== length) {
            value = '0' + value;
        }
        return value;
    });

    module.exports.engine = engine;

    function errordlg(err) {
        dialog.showMessageBox({
            type: 'warning',
            buttons: ['Ok'],
            title: 'Fehler!',
            message: err.message,
            detail: err.stack
        });
    }

    module.exports.errordlg = errordlg;
}());
