/**
 * required modules
 */
const fs = require('fs');
const { foldersplit, workingdirectory } = require('../config.json');

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
    * @param {Discord.User} user
    * @param {Discord.Guild} guild
    */
    logMessage: (message, user = null, guild = null, channel = null) => {
        let datetime = getDatePrefix();

        if (guild == null && user == null) {
            fs.appendFile(workingdirectory + foldersplit + 'bot.log', datetime + message + '\n', (err) => {
                if (err) console.log(err);
            });
        }
        else if (guild == null && user != null) {
            fs.appendFile(workingdirectory + foldersplit + 'bot.log', datetime + '[USER: ' + user.username + ' (' + user.id + ')] ' + message + '\n', (err) => {
                if (err) console.log(err);
            });
        }
        else if (guild != null && user != null && channel == null) {
            fs.appendFile(workingdirectory + foldersplit + 'bot.log', datetime + '[GUILD: ' + guild.name + ' (' + guild.id + ')] [USER: ' + user.username + ' (' + user.id + ')] ' + message + '\n', (err) => {
                if (err) console.log(err);
            });
        }
        else {
            fs.appendFile(workingdirectory + foldersplit + 'bot.log', datetime + '[GUILD: ' + guild.name + ' (' + guild.id + ')] [CHANNEL: ' + channel.name + ' (' + channel.id + ')] [USER: ' + user.username + ' (' + user.id + ')] ' + message + '\n', (err) => {
                if (err) console.log(err);
            });
        }

        if (message.toString().includes('Cannot enqueue Handshake after fatal error')) {
            process.exit(4313);
        }
    },

    logDM: (message, user = null) => {
        let datetime = getDatePrefix();

        if (user != null) {
            console.log(datetime + '[USER: ' + user.username + ' (' + user.id + ')] ' + message);
            fs.appendFile(workingdirectory + foldersplit + 'bot.log', datetime + '[USER: ' + user.username + ' (' + user.id + ')] ' + message + '\n', (err) => {
                if (err) console.log(err);
            });
        }
        else {
            console.log(datetime + message);
            fs.appendFile(workingdirectory + foldersplit + 'bot.log', datetime + message + '\n', (err) => {
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
        fs.appendFile(workingdirectory + foldersplit + 'scheduleTemp' + foldersplit + guild.id + foldersplit + 
            'activity_' + logTime.getFullYear().toString() + pad_with_zeroes((logTime.getMonth()+1), 2) + '.log', 
            datetime + '[GUILD: ' + guild.name + ' (' + guild.id + ')] [CHANNEL: ' + channel.name + ' (' + channel.id + ')] [USER: ' + user.username + ' (' + user.id + ')] ' + message + '\n', (err) => {
                if (err) console.log(err);
        });
    }
};
