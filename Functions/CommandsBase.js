module.exports = {
    log: require('./Logger'),
    db: require('./DBFunctions/SQLWrapper'),
    //query: require('./DBQueryHelper'),
    help: require('./HelpTexts'),
    CommandTypeEnum: Object.freeze({
        'General': 0, 
        'UserDM': 1,
        'ToadCommand': 2
    })
}
