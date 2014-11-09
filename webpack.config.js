var webpack = require('webpack');

module.exports = {
    entry: './client/App',
    output: {
        path: __dirname + '/public/js',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {test : /\.jsx$/, loader  : 'jsx'},
            {test : /\.css$/, loader  : 'style!css'},
            {test : /\.less$/, loader : 'style!css!less'},
            {test : /\.json$/, loader : 'json'},
            {test : /\.(md|txt|html)$/, loader: 'raw'}
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            '_'      : 'lodash',
            'React'  : 'react'
        })
    ],
    target: 'atom'
}
