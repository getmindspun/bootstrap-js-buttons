module.exports = {
    mode: 'production',
    entry: './index.js',
    devtool: 'source-map',
    output: {
        path: __dirname + '/dist/',
        filename: 'bootstrap-js-buttons.min.js',
        library: {
            name: 'bs',
            type: 'assign-properties'
        }
    }
};
