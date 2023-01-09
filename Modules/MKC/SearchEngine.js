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

    getTeamById: (id) => { return getData(URLBuilder.buildRegistryTeamsURI(registryCategory['active'], id)); },


    getActiveTeams: () => { return getData('https://www.mariokartcentral.com/mkc/api/registry/teams/category/active'); },
    get150ccTeams: () => { return getData('https://www.mariokartcentral.com/mkc/api/registry/teams/category/150cc'); },
    get200ccTeams: () => { return getData('https://www.mariokartcentral.com/mkc/api/registry/teams/category/200cc'); },
    getMKTourTeams: () => { return getData('https://www.mariokartcentral.com/mkc/api/registry/teams/category/mktour_vs'); },
    getHistoricalTeams: () => { return getData('https://www.mariokartcentral.com/mkc/api/registry/teams/category/historical'); },
}
