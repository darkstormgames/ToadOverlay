/**
 * @description required modules
 */
const base = require('../functions/commandsBase');

/**
 * @description The name and trigger of the command
 */
const name = 'delete-overlay';

/**
 * @description Alternative trigger(s) for the command
 */
const alt = ['delete'];

/**
 * @description Defines the type of the command
 * This field is used for validation
 */
const type = base.CommandTypeEnum.General;

/**
 * @description Short description of the command
 */
const description = 'Delete your overlay from the server this command was executed from.';

/**
 * @description execution of the command
 * @param {Discord.Message} message 
 * @param {string[]} args 
 */
function execute(message, args) {
    if (!args || args == '' || args[0] == '') {
        base.query.execute('DELETE FROM ' + base.query.dbName + '.user_data WHERE guild_id = ' + message.guild.id + ' AND user_id = ' + message.author.id + ' AND channel_id = ' + message.channel.id)
        .then((result) => {
            if (result.debug_error != null && result.error != null) {
                message.channel.send('There was an error deleting your data...\n\nPlease try again.');
                base.log.logMessage(result.debug_error, message.author.id);
            }
            else {
                base.log.logMessage('Executed command "delete-overlay"', message.author, message.guild);
                message.channel.send(message.author.toString() + ' Your overlay for this channel has been deleted successfully.');
            }
        });
    }
    else if (message.guild) {
        let guildUser = message.guild.member(message.author);
        if (guildUser.hasPermission('KICK_MEMBERS')) {
            let uId = args[0].split('!')[1].split('>')[0];
            base.query.execute('DELETE FROM ' + base.query.dbName + '.user_data WHERE guild_id = ' + message.guild.id + ' AND user_id = ' + uId + ' AND channel_id = ' + message.channel.id)
            .then((result) => {
                if (result.debug_error != null && result.error != null) {
                    message.channel.send('There was an error deleting the data...\n\nPlease try again.');
                    base.log.logMessage(result.debug_error, message.author.id);
                }
                else {
                    base.log.logMessage('Executed command "delete-overlay" for user ' + args[0], message.author, message.guild);
                    message.channel.send(message.author.toString() + ' The overlay for the user ' + args[0] + ' in this channel has been deleted successfully.');
                }
            });
        }
        else {
            base.log.logMessage('Insufficient permissions.', message.author);
            message.channel.send(message.author.toString() + ' You don´t have the permissions to perform this action!');
        }
    }
}

// --------------------------------------------------

module.exports = {
    name: name,
    alt: alt,
    type: type,
    description: description,
    execute: execute,
    guildOnly: true
};