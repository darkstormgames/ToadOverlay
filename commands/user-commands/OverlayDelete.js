/**
 * @description required modules
 */
const base = require('../../Functions/CommandsBase');

module.exports = {
    /**
    * @description The name and trigger of the command
    */
    name: 'delete-overlay',

    /**
    * @description Alternative trigger(s) for the command
    */
    alt: ['delete'],

    /**
    * @description Defines the type of the command
    * This field is used for validation
    */
    type: base.CommandTypeEnum.General,

    /**
    * @description Short description of the command
    */
    description: 'Delete your overlay from the server this command was executed from.',

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        base.log.logMessage('Executing command "delete-overlay"', 'delete-overlay', message.content, message.guild, message.channel, message.author);
        if (!args || args.length == 0) {
            base.query.execute('UPDATE ' + base.query.dbName + '.user_channel SET isActive = 0 WHERE user_id = ' + message.author.id + ' AND channel_id = ' + message.channel.id)
            .then((result) => {
                if (result.debug_error != null && result.error != null) {
                    message.channel.send('There was an error deleting your data...\n\nPlease try again.');
                    base.log.logMessage(result.debug_error, 'delete-overlay', result.error, message.guild, message.channel, message.author);
                    return;
                }
            })
            .then(() => base.query.execute('DELETE FROM ' + base.query.dbName + '.channel_profile' + 
                ' WHERE channel_id = ' + message.channel.id + 
                ' AND profile_id IN (SELECT id FROM ' + base.query.dbName + '.profile WHERE user_id = ' + message.author.id + ')')
                .then((result) => {
                    if (result.debug_error != null && result.error != null) {
                        message.channel.send('There was an error deleting your data...\n\nPlease try again.');
                        base.log.logMessage(result.debug_error, 'delete-overlay', result.error, message.guild, message.channel, message.author);
                    }
                    else {
                        message.channel.send(message.author.toString() + ' Your overlay for this channel has been deleted successfully.');
                    }
            }));
        }
        else if (args.length == 1 && /^<@!\d+>$/m.test(args[0]) && message.guild) {
            let guildUser = message.guild.member(message.author);
            if (guildUser.hasPermission('KICK_MEMBERS')) {
                let uId = args[0].split('!')[1].split('>')[0];
                base.query.execute('UPDATE ' + base.query.dbName + '.user_channel SET isActive = 0 WHERE user_id = ' + uId + ' AND channel_id = ' + message.channel.id)
                .then((result) => {
                    if (result.debug_error != null && result.error != null) {
                        message.channel.send('There was an error deleting the data...\n\nPlease try again.');
                        base.log.logMessage(result.debug_error, 'delete-overlay', result.error, message.guild, message.channel, message.author);
                    }
                })
                .then(() => base.query.execute('DELETE FROM ' + base.query.dbName + '.channel_profile' + 
                    ' WHERE channel_id = ' + message.channel.id + 
                    ' AND profile_id IN (SELECT id FROM ' + base.query.dbName + '.profile WHERE user_id = ' + uId + ')')
                    .then((result) => {
                        if (result.debug_error != null && result.error != null) {
                            message.channel.send('There was an error deleting your data...\n\nPlease try again.');
                            base.log.logMessage(result.debug_error, 'delete-overlay', result.error, message.guild, message.channel, message.author);
                        }
                        else {
                            base.log.logMessage('Executed command "delete-overlay" for user ' + args[0], 'delete-overlay', null, message.guild, message.channel, message.author);
                            message.channel.send(message.author.toString() + ' The overlay for the user ' + args[0] + ' in this channel has been deleted successfully.');
                        }
                }));
            }
            else {
                base.log.logMessage('Insufficient permissions.', 'delete-overlay', null, message.guild, message.channel, message.author);
                message.channel.send(message.author.toString() + ' You don´t have the permissions to perform this action!');
            }
        }
    }
};
