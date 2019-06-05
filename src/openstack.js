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
        const containerName = `italie-${name}`;
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
        const container = client.container(`italie-${username}`);
        return container.create(name, stream, meta).then(() => {
            return {
                url: `https://storage.de1.cloud.ovh.net/v1/AUTH_3a41d7684b854e98b76a6a8b52ec32fd/italie-${username}/${name}`
            }
        });
    }
}