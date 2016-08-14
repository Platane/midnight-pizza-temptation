const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {

    entry: {
        'index'       : './src/index.js'
    },

    output: {
        path        : path.join(__dirname, 'dist'),
        filename    : '[name].js'
    },

    module: {

        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
            },

            {
                test: /\.html?$/,
                exclude: /node_modules/,
                loader: 'html-minify',
            },

            {
                test: /\.json$/,
                loader: 'file?name='+(process.env.PATHNAME||'/')+'[hash:3].[ext]',
            },

            {
                test: /\.(eot|ttf|woff|woff2|svg|gif|jpg|png)$/,
                loader: 'file?name='+(process.env.PATHNAME||'/')+'[hash:3].[ext]',
            },

        ],
    },

    plugins: [

        ...(

            process.env.NODE_ENV != 'production'
                ? []
                : [

                    new webpack.optimize.UglifyJsPlugin({ compress: {warnings: false} })
                    ,

                ]

        )
    ],
}
