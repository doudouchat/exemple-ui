module.exports = {
    devServer: {
        proxy: {
            '/ExempleService': 'http://localhost:8086',
            '/ExempleAuthorization': 'http://localhost:8086',
        }
    }
};