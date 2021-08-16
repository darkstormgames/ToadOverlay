const Discord = require('discord.js');
const fs = require('fs');
const dbLog = require('../Data/Entity/LogCommands');
const helper = require('./LogHelper');
const Debug = require('./DebugLogger');

module.exports = {
    Debug: Debug,

    /**
    * Logs nearly everything...
    * @param {string} message
    * @param {string} command
    * @param {any} data
    * @param {Discord.Guild} guild
    * @param {Discord.Channel} channel
    * @param {Discord.User} user
    */
    logMessage: (message, command, data = null, guild = null, channel = null, user = null) => {
        Debug.LogMessage(message, command, data, guild, channel, user);

        let logTime = new Date();
        fs.appendFile(process.env.DIR_LOGS + process.env.DIR_SPLIT + 'commands_' + process.env.ENVIRONMENT + '_' + 
                        logTime.getFullYear().toString() + helper.pad_with_zeroes((logTime.getMonth()+1), 2) + '.log',
            helper.getDatePrefix() + (guild ? '[GUILD: ' + guild.name + ' (' + guild.id + ')]' : '[GUILD: N/A]') + ' ' +
            (channel ? '[CHANNEL: ' + channel.name + ' (' + channel.id + ')]' : '[CHANNEL: N/A]') + ' ' +
            (user ? '[USER: ' + user.username + ' (' + user.id + ')]' : '[USER: N/A]') + ' ' +
            command + ' ' +
            message + '\n', (err) => {
                if (err && process.env.ENVIRONMENT == 'DEBUG') console.log(err);
        });

        dbLog.AddNew(message, command, data, guild, channel, user, 
            (error) => {
                fs.appendFile(process.env.DIR_LOGS + process.env.DIR_SPLIT + 'commands_' + process.env.ENVIRONMENT + '_' + 
                                logTime.getFullYear().toString() + helper.pad_with_zeroes((logTime.getMonth()+1), 2) + '.log',
                    helper.getDatePrefix() + 'Error writing to database!\n' + error, (err) => {
                        if (process.env.ENVIRONMENT == 'DEBUG') console.log(helper.getDatePrefix() + 'Couldn\'t write to file!\n' + er);
                    });
                if (process.env.ENVIRONMENT == 'DEBUG') console.log(helper.getDatePrefix() + 'Couldn\'t write to database!\n' + error);
            });

        if (message.toString().includes('Cannot enqueue Handshake after fatal error')) {
            process.exit(4313);
        }
    },

    /**
     * Logs commands from direct messages
     * @param {string} message 
     * @param {Discord.User} user 
     */
    logDM: (message, command, content, user = null) => {
        Debug.LogDM(message, command, content, user);

        let logTime = new Date();
        fs.appendFile(process.env.DIR_LOGS + process.env.DIR_SPLIT + 'directMessage_' + process.env.ENVIRONMENT + '_' + 
                         logTime.getFullYear().toString() + helper.pad_with_zeroes((logTime.getMonth()+1), 2) + '.log', 
            helper.getDatePrefix() + (user ? '[USER: ' + user.username + ' (' + user.id + ')] ' : '[USER: N/A] ') + 
            message + '\n' + content + '\n', 
            (err) => {
                if (err) console.log(err);
        });

        if (message.toString().includes('Cannot enqueue Handshake after fatal error')) {
            process.exit(4313);
        }
    },

    /**
     * Logs reactions for scheduling
     * @param {Discord.Guild} guild 
     * @param {Discord.Channel} channel 
     * @param {Discord.User} user 
     * @param {string} message 
     */
    logWarData: (guild, channel, user, message, title, messageId) => {
        Debug.LogWarReaction(guild, channel, user, message, title, messageId);

        let logTime = new Date();
        fs.appendFile(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + guild.id + process.env.DIR_SPLIT + 
                         'activity_' + process.env.ENVIRONMENT + '_' + logTime.getFullYear().toString() + helper.pad_with_zeroes((logTime.getMonth()+1), 2) + '.log', 
            helper.getDatePrefix() + '[CHANNEL: ' + channel.name + ' (' + channel.id + ')] [USER: ' + user.username + ' (' + user.id + ')] ' + message + (title ? ' for ' + title + ' (' + messageId + ')' : '') + '\n', (err) => {
                if (err) console.log(err);
        });

    }
};
