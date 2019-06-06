module.exports = {
    api: (app, opts, swiftClient) => {
        const { readFiles, deleteFile } = require('./openstack');
        app.get('/albums', function (req, res) {
            res.json(opts.users);
        });

        app.get('/albums/:name', function (req, res) {
            const limit = parseInt(req.query.limit, 10) || 40;
            const marker = req.query.marker || null;

            readFiles(swiftClient, req.params.name, 'thumb_', marker, limit, opts).then((data) => {
                res.json(data.map((file) => ({
                    thumb: `${opts.swift.public}/${opts.swift.domain}/${opts.prefix}-${req.params.name}/${file.name}`,
                    file: `${opts.swift.public}/${opts.swift.domain}/${opts.prefix}-${req.params.name}/${file.name.replace(/^thumb_/, '')}`,
                    thumbName: file.name,
                    filename: file.name.replace(/^thumb_/, '')
                })));
            });
        });

        app.delete('/albums/:name/:file', function (req, res) {
            if (req.params.name.toLowerCase() === req.user) {
                deleteFile(swiftClient, req.params.name, req.params.file, opts).then(() => {
                    deleteFile(swiftClient, req.params.name, `thumb_${req.params.file}`, opts).then(() => {
                        res.json({ok: true});
                    });
                });
            } else {
                res.json({ok: false});
            }
        });
    }
}