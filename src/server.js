module.exports = {
    server: (opts) => {
        const express = require('express');
        const app = express();
    
        app.use(express.static('public'));
    
        app.listen(opts.port, () => {
            console.log(`Italie running on port ${opts.port}`);
        });

        return app;
    }
};
