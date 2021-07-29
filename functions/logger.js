/**
 * required modules
 */
const fs = require('fs');
const query = require('./query');
const { v4: uuid } = require('uuid');

function pad_with_zeroes(number, length) {
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}

function getDatePrefix() {
    let logTime = new Date();
    return '[' +
        logTime.getFullYear() + '.' +
        pad_with_zeroes((logTime.getMonth()+1), 2) + '.' +
        pad_with_zeroes(logTime.getDate(), 2) + ' ' +
        pad_with_zeroes(logTime.getHours(), 2) + ':' +
        pad_with_zeroes(logTime.getMinutes(), 2) + ':' +
        pad_with_zeroes(logTime.getSeconds(), 2) + '] ';
}

module.exports = {
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
        query.execute('INSERT INTO ' + process.env.SQL_NAME + '.log_commands (id, guild_id, channel_id, user_id, env_type, command, message, data) VALUES ("' + 
            uuid() + '",' +
            (guild ? guild.id : 'NULL') + ', ' +
            (channel ? channel.id : 'NULL') + ', ' +
            (user ? user.id : 'NULL') + ', "' +
            process.env.ENVIRONMENT + '", "' +
            command + '", "' +
            message + '", ' +
            (data ? '"' + data + '"' : 'NULL') + ');');

        let datetime = getDatePrefix();
        console.log(datetime + (guild ? '[GUILD: ' + guild.name + ' (' + guild.id + ')]' : '[GUILD: N/A]') + ' ' +
            (channel ? '[CHANNEL: ' + channel.name + ' (' + channel.id + ')]' : '[CHANNEL: N/A]') + ' ' +
            (user ? '[USER: ' + user.username + ' (' + user.id + ')]' : '[USER: N/A]') + ' ' + 
            command + ' ' + message);
        fs.appendFile(process.env.DIR_LOGS + process.env.DIR_SPLIT + 'commands_' + process.env.ENVIRONMENT + '_' + logTime.getFullYear().toString() + pad_with_zeroes((logTime.getMonth()+1), 2) + '.log',
            datetime + (guild ? '[GUILD: ' + guild.name + ' (' + guild.id + ')]' : '[GUILD: N/A]') + ' ' +
            (channel ? '[CHANNEL: ' + channel.name + ' (' + channel.id + ')]' : '[CHANNEL: N/A]') + ' ' +
            (user ? '[USER: ' + user.username + ' (' + user.id + ')]' : '[USER: N/A]') + ' ' + 
            command + ' ' + 
            message + '\n');

        if (message.toString().includes('Cannot enqueue Handshake after fatal error')) {
            process.exit(4313);
        }
    },

    /**
     * Logs commands from direct messages
     * @param {string} message 
     * @param {Discord.User} user 
     */
    logDM: (message, user = null) => {
        let datetime = getDatePrefix();

        if (user != null) {
            console.log(datetime + '[USER: ' + user.username + ' (' + user.id + ')] ' + message);
            fs.appendFile(process.env.DIR_LOGS + process.env.DIR_SPLIT + 'directMessage_' + process.env.ENVIRONMENT + '_' + logTime.getFullYear().toString() + pad_with_zeroes((logTime.getMonth()+1), 2) + '.log', 
                datetime + '[USER: ' + user.username + ' (' + user.id + ')] ' + message + '\n', (err) => {
                    if (err) console.log(err);
            });
        }
        else {
            console.log(datetime + message);
            fs.appendFile(process.env.DIR_LOGS + process.env.DIR_SPLIT + 'directMessage_' + process.env.ENVIRONMENT + '_' + logTime.getFullYear().toString() + pad_with_zeroes((logTime.getMonth()+1), 2) + '.log', 
                datetime + message + '\n', (err) => {
                    if (err) console.log(err);
            });
        }

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
    logWarData: (guild, channel, user, message) => {
        let datetime = getDatePrefix();

        let logTime = new Date();
        fs.appendFile(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + guild.id + process.env.DIR_SPLIT + 
            'activity_' + process.env.ENVIRONMENT + '_' + logTime.getFullYear().toString() + pad_with_zeroes((logTime.getMonth()+1), 2) + '.log', 
            datetime + '[CHANNEL: ' + channel.name + ' (' + channel.id + ')] [USER: ' + user.username + ' (' + user.id + ')] ' + message + '\n', (err) => {
                if (err) console.log(err);
        });
    }
};
