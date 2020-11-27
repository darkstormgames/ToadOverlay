/**
 * @desc required modules
 */
const base = require('../functions/commandsBase');

/**
 * @desc The name and trigger of the command
 */
const name = 'Started war between';

/**
 * @desc Alternative trigger(s) for the command
 */
const alt = [];

/**
 * @desc Defines the type of the command
 * This field is used for validation
 */
const type = base.CommandTypeEnum.ToadCommand;

/**
 * @desc Short description of the command
 */
const description = '';

/**
 * @desc execution of the command
 * @param {Discord.Message} message 
 * @param {string[]} args 
 */
function execute(message, args) {
    base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 0, current_guest = 0, last_updated = now() WHERE guild_id = ' + message.guild.id + ' AND channel_id = ' + message.channel.id + ';')
    .then((result) => {
        if (result.error && result.debug_error) {
            message.channel.send('There was an error setting up a new war...\nPlease try again...');
            base.log.logMessage(result.debug_error, message.author.id);
        }
        else {
            base.log.logMessage('Executed command "startwar"', message.author, message.guild);
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