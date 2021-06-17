/**
 * required modules
 */
const fs = require('fs');
const query = require('./query');
// const { v4: uuid } = require('uuid');
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
    * @param {string} message
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

        if (message.toString().includes('Cannot enqueue Handshake after fatal error')) {
            process.exit(4313);
        }
    },

    logDM: (message, user = null) => {
        let datetime = getDatePrefix();

        if (user != null) {
            console.log(datetime + '[USER: ' + user.username + ' (' + user.id + ')] ' + message);
            fs.appendFile(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'bot.log', datetime + '[USER: ' + user.username + ' (' + user.id + ')] ' + message + '\n', (err) => {
                if (err) console.log(err);
            });
        }
        else {
            console.log(datetime + message);
            fs.appendFile(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'bot.log', datetime + message + '\n', (err) => {
                if (err) console.log(err);
            });
        }

        if (message.toString().includes('Cannot enqueue Handshake after fatal error')) {
            process.exit(4313);
        }
    },

    logWarData: (guild, channel, user, message) => {
        let datetime = getDatePrefix();

        let logTime = new Date();
        fs.appendFile(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + guild.id + process.env.DIR_SPLIT + 
            'activity_' + logTime.getFullYear().toString() + pad_with_zeroes((logTime.getMonth()+1), 2) + '.log', 
            datetime + '[GUILD: ' + guild.name + ' (' + guild.id + ')] [CHANNEL: ' + channel.name + ' (' + channel.id + ')] [USER: ' + user.username + ' (' + user.id + ')] ' + message + '\n', (err) => {
                if (err) console.log(err);
        });
    }
};
