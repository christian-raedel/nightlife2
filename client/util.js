(function () {
    'use strict';

    var CLogger  = require('node-clogger')
        , CConf  = require('node-cconf')
        , engine = require('dna').createDNA()
        , client = require('tvdb-api-client')
        , path   = require('path')
        , argv   = require('yargs').default('config', path.resolve(__dirname, '..', 'config.yml')).boolean('debug').parse(process.argv.slice(1))
        , dialog = require('dialog')
        , _      = require('lodash');

    var logger = new CLogger({name: 'nightlife2'});
    module.exports.logger = logger;

    var conf = new CConf('nightlife2', ['basepath', 'filename', 'extensions']).load(argv.config);
    module.exports.conf = conf;

    function saveConf() {
        try {
            conf.save(argv.config);
        } catch (err) {
            errordlg(err);
        }
    }
    module.exports.saveConf = saveConf;

    logger.debug(argv);
    if (argv.debug) {
        logger.warn('running in debug mode; copy operations are disabled!');
    }
    module.exports.argv = argv;

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

    function random() {
        return _.random(2, Math.pow(2, 53)).toString();
    }

    module.exports.random = random;
}());
