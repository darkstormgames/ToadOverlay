/**
 * required modules
 */
const fs = require('fs');

module.exports = {
    /**
    * @param {string} message 
    * @param {Discord.User} user 
    * @param {Discord.Guild} guild 
    */
    logMessage: (message, user = null, guild = null, channel = null) => {
        let logTime = new Date();
        let datetime = '[' +
            logTime.getFullYear() + '.' +
            (logTime.getMonth()+1) + '.' +
            logTime.getDate() + ' ' +
            logTime.getHours() + ':' + 
            logTime.getMinutes() + ':' +
            logTime.getSeconds() + '] ';
    
        if (guild == null && user == null) {
            console.log(datetime + message);
        }
        else if (guild == null && user != null) {
            console.log(datetime + '[USER: ' + user.username + ' (' + user.id + ')] ' + message);
        }
        else if (guild != null && user != null && channel == null) {
            console.log(datetime + '[USER: ' + user.username + ' (' + user.id + ')] [GUILD: ' + guild.name + ' (' + guild.id + ')] ' + message);
        }
        else {
            console.log(datetime + '[USER: ' + user.username + ' (' + user.id + ')] [GUILD: ' + guild.name + ' (' + guild.id + ')] [CHANNEL: ' + channel.name + ' (' + channel.id + ')] ' + message);
        }
    
        if (message.toString().includes('Cannot enqueue Handshake after fatal error')) {
            process.exit(4313);
        }
    }
};