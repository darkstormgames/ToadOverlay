/**
 * @description required modules
 */
const https = require('https');
const URLBuilder = require('./URLBuilder');
const { registryType } = require('./SearchEnums');

const registryCategory = Object.freeze({
    'active': 0,
    'all': 0,
    '150cc': 1,
    '200cc': 2,
    'mktour_vs': 3,
    'historical': 4,
    'shadow': 4
});

function getData(uri) {
    return new Promise((resolve) => {
        if (uri.startsWith('https://')) {
            https.get(uri, (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    resolve(JSON.parse(data));
                });
            })
            .on('error', (err) => {
                console.log('Error fetching data!\n' + err.message);
                resolve(null);
            });
        }
        else {
            resolve(null);
        }
    });
}

module.exports = {
    registryType: registryType,
    registryCategory: registryCategory,

    getTeamById: (id) => { return getData(URLBuilder.buildRegistryTeamsURI(registryCategory['active'], id)); }
}
