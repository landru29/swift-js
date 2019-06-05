module.exports = {
    initialize: (opts) => {
        const mkdirp = require('mkdirp');
        mkdirp.sync(opts.uploads, {});
    }
};
