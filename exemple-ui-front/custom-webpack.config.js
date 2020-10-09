module.exports = {
    devServer: {
        proxy: {
            '/ExempleService': 'http://localhost:8080',
            '/ExempleAuthorization': 'http://localhost:8080',
        }
    }
};