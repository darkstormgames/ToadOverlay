/**
 * @description required modules
 */
const base = require('../functions/commandsBase');

/**
 * @description The name and trigger of the command
 */
const name = 'sethtml';

/**
 * @description Alternative trigger(s) for the command
 */
const alt = ['set-html'];

/**
 * @description Defines the type of the command
 * This field is used for validation
 */
const type = base.CommandTypeEnum.UserDM;

/**
 * @description Short description of the command
 */
const description = '';

/**
 * @description execution of the command
 * @param {Discord.Message} message 
 * @param {string} content 
 */
function execute(message, content) {
    base.query.execute("UPDATE " + base.query.dbName + ".user_data SET ol_html = '" + content + "' WHERE user_id = " + message.author.id)
    .then((result) => {
        if (result.error && result.debug_error) {
            message.author.send('There was an error updating your html...\nPlease try again later.');
            base.log.logMessage(result.debug_error, message.author.id);
        }
        else {
            message.author.send('Your HTML body has been updated. Refresh your overlay to see the changes.');
            base.log.logMessage('Executed command "sethtml"', message.author.id);
        }
    });
}

// --------------------------------------------------

module.exports = {
    name: name,
    alt: alt,
    type: type,
    description: description,
    execute: execute
};