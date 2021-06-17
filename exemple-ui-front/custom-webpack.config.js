const webpack = require('webpack')
module.exports = {
    devServer: {
        proxy: {
            '/ExempleService': 'http://localhost:8086',
            '/ExempleAuthorization': 'http://localhost:8086',
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        })
    ]
};