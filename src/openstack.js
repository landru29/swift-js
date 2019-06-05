module.exports = {
    connect: (opts) => {
        const SwiftClient = require('openstack-swift-client');
        const KeystoneV3Authenticator = require('./KeystoneV3Authenticator');
        return new SwiftClient(new KeystoneV3Authenticator({
            endpointUrl: opts.swift.url,
            username: opts.swift.username,
            password: opts.swift.password,
            domainId: 'default',
          }));
    },
    createContainer: (client, name, opts) => {
        const containerName = `${opts.prefix}-${name}`;
        return client.list().then((data) => {
            if (data.reduce((all, elt) => all || elt.name === containerName, false) === false) {
                return client.create(containerName, true, {}).then(() => containerName);
            }
            return containerName;
        });
    },
    addFile: (client, username, name, filename, meta, opts) => {
        const fs = require('fs');
        const stream = fs.createReadStream(filename);
        const container = client.container(`${opts.prefix}-${username}`);
        return container.create(name, stream, meta).then(() => {
            return {
                url: `${opts.swift.public}/${opts.swift.domain}/${opts.prefix}-${username}/${name}`
            }
        });
    },
    readFiles: (client, username, prefix, marker, limit, opts) => {
        const container = client.container(`${opts.prefix}-${username}`);
        const query = {
            limit,
            prefix
        };
        if (marker !== null) {
            query.marker = marker;
        }
        return container.list({}, query);
    },
    deleteFile: (client, username, name, opts) => {
        const container = client.container(`${opts.prefix}-${username}`);
        return container.delete(name).then(() => {
            return true
        });
    }
}