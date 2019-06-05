const { initialize } = require('./src/init');
const { server } = require('./src/server');
const { upload } = require('./src/upload');
const { api } = require('./src/api');
const { connect, createContainer } = require('./src/openstack');
const opts = require('./config.json');

(function () {
    initialize(opts);
    const expressApp = server(opts);
    const swiftClient = connect(opts);
    (opts.users || []).forEach((name) => {
        createContainer(swiftClient, name, opts).then((result) => {
            console.log(` * Create container ${result}`);
        }).catch((err) => {
            console.log(err);
        });
    });
    upload(expressApp, opts, swiftClient);
    api(expressApp, opts, swiftClient);
})();