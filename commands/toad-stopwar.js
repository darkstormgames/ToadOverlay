/**
 * @description required modules
 */
const base = require('../functions/commandsBase');

/**
 * @description The name and trigger of the command
 */
const name = 'Stopped war.';

/**
 * @description Alternative trigger(s) for the command
 */
const alt = [];

/**
 * @description Defines the type of the command
 * This field is used for validation
 */
const type = base.CommandTypeEnum.ToadCommand;

/**
 * @description Short description of the command
 */
const description = '';

/**
 * @description execution of the command
 * @param {Discord.Message} message 
 * @param {string[]} args 
 */
function execute(message, args) {
    base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 0, current_guest = 0, last_updated = now() WHERE guild_id = ' + message.guild.id + ' AND channel_id = ' + message.channel.id + ' AND keep_results = 0;')
    .then((result) => {
        if (result.error && result.debug_error) {
            message.channel.send('There was an error resetting scores...\nPlease try again...');
            base.log.logMessage(result.debug_error, message.author, message.guild);
        }
        else {
            base.log.logMessage('Executed command "stopwar"', message.author, message.guild);
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