module.exports = {
    log: require('./Logger'),
    query: require('./DBQueryHelper'),
    CommandTypeEnum: Object.freeze({
        'General': 0, 
        'UserDM': 1,
        'ToadCommand': 2
    })
}
