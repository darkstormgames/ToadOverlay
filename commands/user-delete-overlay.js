/**
 * @desc required modules
 */
const base = require('../functions/commandsBase');

/**
 * @desc The name and trigger of the command
 */
const name = 'delete-overlay';

/**
 * @desc Alternative trigger(s) for the command
 */
const alt = ['delete'];

/**
 * @desc Defines the type of the command
 * This field is used for validation
 */
const type = base.CommandTypeEnum.General;

/**
 * @desc Short description of the command
 */
const description = 'Delete your overlay from the server this command was executed from.';

/**
 * @desc execution of the command
 * @param {Discord.Message} message 
 * @param {string[]} args 
 */
function execute(message, args) {
    // Searching for existing entries in the database
    base.query.execute('DELETE FROM ' + base.query.dbName + '.user_data WHERE guild_id = ' + message.guild.id + ' AND user_id = ' + message.author.id + ' AND channel_id = ' + message.channel.id)
    .then((result) => {
        if (result.debug_error != null && result.error != null) {
            message.channel.send('There was an error deleting your data...\n\nPlease try again.');
            base.log.logMessage(result.debug_error, message.author.id);
        }
        else {
            base.log.logMessage('Executed command "delete-overlay"', message.author, message.guild);
            message.channel.send(message.author.toString() + ' Your overlay for this discord-server has been deleted successfully.');
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