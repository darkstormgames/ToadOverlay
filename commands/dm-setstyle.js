/**
 * @desc required modules
 */
const base = require('../functions/commandsBase');

/**
 * @desc The name and trigger of the command
 */
const name = 'setstyle';

/**
 * @desc Alternative trigger(s) for the command
 */
const alt = ['set-style', 'set-styles', 'setstyles'];

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
    base.query.execute("UPDATE " + base.query.dbName + ".user_data SET ol_css = '" + content + "' WHERE user_id = " + message.author.id)
    .then((result) => {
        if (result.error && result.debug_error) {
            message.author.send('There was an error updating your styles...\nPlease try again later.');
            base.log.logMessage(result.debug_error, message.author.id);
        }
        else {
            message.author.send('Your CSS styles have been updated. Refresh your overlay to see the changes.');
            base.log.logMessage('Executed command "setstyle"', message.author.id);
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