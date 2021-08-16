const Discord = require('discord.js');
const Data = require('../../Modules/Data/SQLWrapper');
const Log = require('../../Modules/Log/Logger');

module.exports = {
    name: 'delete-overlay',
    alt: ['delete'],
    description: 'Delete your overlay from the server this command was executed from.',

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        if (!args || args.length == 0) {
            Data.ExecuteQuery('UPDATE ' + process.env.SQL_NAME + '.user_channel SET isActive = 0 WHERE user_id = ' + message.author.id + ' AND channel_id = ' + message.channel.id, 
            (error) => {
                message.channel.send('There was an error deleting your data...\n\nPlease try again.');
                Log.logMessage('There was an error deleting your data...', 'delete-overlay', error, message.guild, message.channel, message.author);
                return;
            })
            .then(() => Data.ExecuteQuery('DELETE FROM ' + process.env.SQL_NAME + '.channel_profile' + 
                ' WHERE channel_id = ' + message.channel.id + 
                ' AND profile_id IN (SELECT id FROM ' + process.env.SQL_NAME + '.profile WHERE user_id = ' + message.author.id + ')', 
                (error) => {
                    message.channel.send('There was an error deleting your data...\n\nPlease try again.');
                    Log.logMessage('There was an error deleting your data...', 'delete-overlay', error, message.guild, message.channel, message.author);
                })
                .then((result) => {
                    if (result == true) {
                        message.channel.send(message.author.toString() + ' Your overlay for this channel has been deleted successfully.');
                    }
            }));
        }
        else if (args.length == 1 && /^<@!\d+>$/m.test(args[0]) && message.guild) {
            let guildUser = message.guild.member(message.author);
            if (guildUser.hasPermission('KICK_MEMBERS')) {
                let uId = args[0].split('!')[1].split('>')[0];
                Data.ExecuteQuery('UPDATE ' + process.env.SQL_NAME + '.user_channel SET isActive = 0 WHERE user_id = ' + uId + ' AND channel_id = ' + message.channel.id, 
                (error) => {
                    message.channel.send('There was an error deleting the data...\n\nPlease try again.');
                    Log.logMessage('There was an error deleting your data...', 'delete-overlay', error, message.guild, message.channel, message.author);
                })
                .then(() => Data.ExecuteQuery('DELETE FROM ' + process.env.SQL_NAME + '.channel_profile' + 
                    ' WHERE channel_id = ' + message.channel.id + 
                    ' AND profile_id IN (SELECT id FROM ' + process.env.SQL_NAME + '.profile WHERE user_id = ' + uId + ')', 
                    (error) => {
                        message.channel.send('There was an error deleting your data...\n\nPlease try again.');
                        Log.logMessage('There was an error deleting your data...', 'delete-overlay', error, message.guild, message.channel, message.author);
                    })
                    .then((result) => {
                        if (result == true) {
                            Log.logMessage('Executed command "delete-overlay" for user ' + args[0], 'delete-overlay', null, message.guild, message.channel, message.author);
                            message.channel.send(message.author.toString() + ' The overlay for the user ' + args[0] + ' in this channel has been deleted successfully.');
                        }
                }));
            }
            else {
                Log.logMessage('Insufficient permissions.', 'delete-overlay', null, message.guild, message.channel, message.author);
                message.channel.send(message.author.toString() + ' You don´t have the permissions to perform this action!');
            }
        }
    }
};
