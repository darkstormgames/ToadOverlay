module.exports = {
    log: require('../functions/logger'),
    query: require('../functions/query'),
    CommandTypeEnum: Object.freeze({
        'General': 0, 
        'UserDM': 1,
        'ToadCommand': 2
    })
}