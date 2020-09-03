const log = require('../functions/logger');
const query = require('../functions/query');

const CommandTypeEnum = Object.freeze({
    'General': 0, 
    'UserDM': 1,
    'ToadCommand': 2
});

module.exports = {
    log,
    query,
    CommandTypeEnum
}