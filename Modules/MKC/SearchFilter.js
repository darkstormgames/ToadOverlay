const { registryType } = require('./SearchEnums');

const OrderValues = ['NA', 'ND', 'SA', 'SD', 'MA', 'MD', 'RA', 'RD', 'CD', 'CA', 'ED', 'EA', 'SFA', 'SFD', 'TFA', 'TFD', '3FA', '3FD', 'UFA', 'UFD'];
const OrderTypesTeams = Object.freeze({
    Name: 'NA',
    NameAsc: 'NA',
    NameDesc: 'ND',
    Status: 'SA',
    StatusAsc: 'SA',
    StatusDesc: 'SD',
    Members: 'MA',
    MembersAsc: 'MA',
    MembersDesc: 'MD',
    Registered: 'RA',
    RegisteredAsc: 'RA',
    RegisteredDesc: 'RD'
});
const OrderTypesPlayers = Object.freeze({
    Name: 'NA',
    NameAsc: 'NA',
    NameDesc: 'ND',
    FCSwitchAsc: 'SFA',
    FCSwitchDesc: 'SFD',
    FCTourAsc: 'TFA',
    FCTourDesc: 'TFD',
    FC3DSAsc: '3FA',
    FC3DSDesc: '3FD',
    FCNNIDAsc: 'UFA',
    FCNNIDDesc: 'UFD',
    Registered: 'RA',
    RegisteredAsc: 'RA',
    RegisteredDesc: 'RD'
});
const OrderTypesEventRegistrations = Object.freeze({
    Name: 'NA',
    NameAsc: 'NA',
    NameDesc: 'ND',
    PlayerCountAsc: 'CA',
    PlayerCountDesc: 'CD',
    EligibleAsc: 'EA',
    EligibleDesc: 'ED',
    RegisteredAsc: 'RA',
    RegisteredDesc: 'RD'
});

const BooleanValues = ['true', 'false', 'yes', 'no'];
const CountryValues = ['ZZ', 'AF', 'AL', 'DZ', 'AS', 'AD', 'AQ', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BB', 'BY', 'BE', 'BO', 'BQ', 'BR', 'IO', 'CA', 'CL', 'CN', 'CO', 'CG', 'CR', 'HR', 'CU', 'CY', 'CZ', 'DK', 'DO', 'EC', 'EG', 'SV', 'FI', 'FR', 'GF', 'PF', 'GE', 'DE', 'GR', 'GU', 'GT', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IE', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'LV', 'LB', 'LU', 'MG', 'MY', 'MT', 'MX', 'MA', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NO', 'PA', 'PY', 'PE', 'PH', 'PL', 'PT', 'PR', 'RO', 'RU', 'RE', 'SA', 'SL', 'SG', 'SK', 'SI', 'ZA', 'GS', 'KR', 'ES', 'SE', 'CH', 'TW', 'TH', 'TT', 'TN', 'VI', 'AE', 'GB', 'US', 'XX', 'UY', 'VE'];
const LanguageValues = ['all', 'English', 'French', 'German', 'Portuguese', 'Spanish', 'other'];
const LanguageTypes = Object.freeze({
    All: 'all',
    English: 'English',
    French: 'French',
    German: 'German',
    Portuguese: 'Portuguese',
    Spanish: 'Spanish',
    Other: 'other'
});

const FilterTypes = Object.freeze({
    Order: 0,
    Language: 1,
    Country: 2,
    IgnoreFilter: 3,
    Page: 4,
    CheckedIn: 7,
    Verified: 8,
    Search: 9
});

class SearchFilter {
    constructor(filterType, value) {
        this.filterType = filterType;
        this.value = value;
    }

    static detectRegistryFilter(type, value) {
        if (type == registryType.teams) {
            return this.detectRegistryTeamsFilter(value);
        }
        else if (type == registryType.players) {

        }
        else {
            return null;
        }
    }

    static detectRegistryTeamsFilter(value) {
        if (!value || (value && value.trim() == '')) return null;

        OrderValues.forEach((item) => {
            if (value.toLowerCase() == item.toLowerCase() || (OrderTypesTeams[value] && OrderTypesTeams[value] == item)) {
                return new SearchFilter(FilterTypes.Order, (value == item ? value : OrderTypesTeams[value]));
            }
        });
        LanguageValues.forEach((item) => {
            if (value.toLowerCase() == item.toLowerCase() || (LanguageTypes[value] && LanguageTypes[value] == item)) {
                return new SearchFilter(FilterTypes.Language, (value == item ? value : LanguageTypes[value]));
            }
        });
        return new SearchFilter(FilterTypes.Search, value);
    }

    toString() {
        let out = '';
        switch (this.filterType) {
            case FilterTypes.Order:
                out += 'order=';
                break;
            case FilterTypes.Language:
                out += 'language=';
                break;
            case FilterTypes.Country:
                out += 'country=';
                break;
            case FilterTypes.IgnoreFilter:
                out += 'ignore_filter=';
                break;
            case FilterTypes.Page:
                out += 'page=';
                break;
            case FilterTypes.CheckedIn:
                out += 'checked_in=';
                break;
            case FilterTypes.Verified:
                out += 'verified=';
                break;
            case FilterTypes.Search:
                out += 'search=';
                break;
            default:
                return out;
        }
        if (this.filterType == FilterTypes.Search) {
            out += this.value.trim().replace(' ', '%20');
        }
        else {
            out += this.value.trim();
        }
        return out;
    }
}

module.exports = {
    SearchFilter: SearchFilter,

    FilterTypes: FilterTypes,

}
