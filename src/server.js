module.exports = {
    server: (opts) => {
        const express = require('express');
        const app = express();

        app.use(function (req, res, next) {
            const authorization = req.get('authorization');
            if (!authorization) {
                res.setHeader('WWW-Authenticate', 'Basic realm="Italie"');
                res.status(401);
                res.send("Login first");
                return;
            }

            const user = Buffer.from(authorization.replace(/^basic\s*/i, ''), 'base64').toString().replace(/:.*/, '').toLowerCase();

            if (!opts.users.includes(user)) {
                res.setHeader('WWW-Authenticate', 'Basic realm="Italie"');
                res.status(401);
                res.send("Bad login");
                return;
            }

            req.user = user;

            next();
        });
    
        app.use(express.static('public'));
    
        app.listen(opts.port, () => {
            console.log(`Application running on port ${opts.port}`);
        });

        return app;
    }
};
