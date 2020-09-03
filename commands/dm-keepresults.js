/**
 * @desc required modules
 */
const base = require('../functions/commandsBase');

/**
 * @desc The name and trigger of the command
 */
const name = 'keepresults';

/**
 * @desc Alternative trigger(s) for the command
 */
const alt = ['keepresult'];

/**
 * @desc Defines the type of the command
 * This field is used for validation
 */
const type = base.CommandTypeEnum.UserDM;

/**
 * @desc Short description of the command
 */
const description = '';

/**
 * @desc execution of the command
 * @param {Discord.Message} message 
 * @param {string[]} args 
 */
function execute(message, content) {
    if (content == 0 || content == 1) {
        base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET keep_results = "' + content + '" WHERE user_id = ' + message.author.id)
        .then((result) => {
            if (result.error && result.debug_error) {
                message.author.send('There was an error changing settings...\nPlease try again later.');
                base.log.logMessage(result.debug_error, message.author.id);
            }
            else {
                message.author.send('Setting has been changed successfully.');
                base.log.logMessage('Executed command "keepresults"', message.author.id);
            }
        });
    }
    else {
        message.author.send('The provided parameter is invalid.');
        base.log.logMessage('Executed command "keepresults" with invalid parameter.', message.author.id);
    }
}

// --------------------------------------------------

module.exports = {
    name: name,
    alt: alt,
    type: type,
    description: description,
    execute: execute
};