const path = require('path')
const webpack = require('webpack')
const cssnext = require('postcss-cssnext')


module.exports = {

    entry: {
        'index'       : './src/index.js',

        ...(
            process.env.NODE_ENV == 'production'
                ? {}
                : {
                    'test-spec'   : './src/test/spec/index.js',
                    'test-init'   : './src/test/runner/index.js',
                }
        )
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
                test: /\.css$/,
                loader: 'style!css'
            },

            {
                test: /\.mcss$/,
                loader: 'style!css?modules&importLoaders=1&localIdentName=[hash:base64:4]!postcss'
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

    postcss: () =>
        [ cssnext ]
    ,

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
