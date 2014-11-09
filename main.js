var app              = require('app')
    , BrowserWindow  = require('browser-window')
    , globalShortcut = require('global-shortcut')
    , path           = require('path');

var mainWindow = null;

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    mainWindow = new BrowserWindow({width: 1200, height: 1024});
    mainWindow.loadUrl('file://' + path.resolve(__dirname, 'public', 'index.html'));
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    globalShortcut.register('F12', function () {
        mainWindow.toggleDevTools();
    });
});
