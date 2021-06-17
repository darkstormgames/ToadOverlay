const { SearchFilter, FilterTypes } = require('./SearchFilter');
const { registryType } = require('./SearchEnums');

module.exports = {
    buildRegistryTeamsURI: (category = registryCategory.active, id = 0, filter = []) => {
        let baseURI = 'https://www.mariokartcentral.com/mkc/api/registry/teams/';
        if (!id || id == null || id === 0) {
            baseURI += 'category/';
            switch (category) {
                case registryCategory.active:
                    baseURI += 'active';
                    break;
                case registryCategory.all:
                    baseURI += 'all';
                    break;
                case registryCategory['150cc']:
                    baseURI += '150cc';
                    break;
                case registryCategory['200cc']:
                    baseURI += '200cc';
                    break;
                case registryCategory.mktour_vs:
                    baseURI += 'mktour_vs';
                    break;
                case registryCategory.historical:
                case registryCategory.shadow:
                    baseURI += 'historical';
                    break;
                default:
                    baseURI += '150cc';
            }

            if (filter && filter.length > 0) {
                baseURI += '?';
                for (let i = 0; i < filter.length; i++) {
                    if (!(filter[i] instanceof SearchFilter)) {
                        continue;
                    }
                    if (filter[i].filterType != FilterTypes.Order && filter[i].filterType != FilterTypes.Language && filter[i].filterType != FilterTypes.Search) {
                        continue;
                    }
                    baseURI += filter[i].toString();
                    if (i != (filter.length - 1)) {
                        baseURI += '&';
                    }
                }
            }
        }
        else if (id && !isNaN(id)) {
            baseURI += id;
        }

        return baseURI;
    },


}