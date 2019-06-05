const { initialize } = require('./src/init');
const { server } = require('./src/server');
const { upload } = require('./src/upload');
const opts = require('./config.json');

(function () {
    initialize(opts);
    const expressApp = server(opts);
    upload(expressApp, opts);
})();