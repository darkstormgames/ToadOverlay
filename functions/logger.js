/**
 * required modules
 */
//const eventLogger = require('node-windows').EventLogger;
const fs = require('fs');
//const logger = new eventLogger('ToadForStreams');

/**
 * 
 * @param {string} message 
 * @param {Discord.User} user 
 * @param {Discord.Guild} guild 
 */
function logMessage(message, user = null, guild = null) {
    var logTime = new Date();
    var datetime = '[' +
        logTime.getFullYear() + '.' +
        (logTime.getMonth()+1) + '.' +
        logTime.getDate() + ' ' +
        logTime.getHours() + ':' + 
        logTime.getMinutes() + ':' +
        logTime.getSeconds() + '] ';

    if (guild == null && user == null) {
        console.log(datetime + message);
        //fs.appendFile('all.log', datetime + message + '\n', () => {});
        //logger.info(message);
    }
    else if (guild == null && user != null) {
        console.log(datetime + '[USER: ' + user.username + ' (' + user.id + ')] ' + message);
        //fs.appendFile('all.log', datetime + '[USER: ' + user.toString() + '] ' + message + '\n', () => {});
        //logger.info('[USER: ' + user.toString() + '] ' + message);
    }
    else {
        console.log(datetime + '[USER: ' + user.username + ' (' + user.id + ')] [GUILD: ' + guild.name + ' (' + guild.id + ')] ' + message);
        //fs.appendFile('all.log', datetime + '[USER: ' + user.toString() + '] [GUILD: ' + guild.name + ' (' + guild.id + ')] ' + message + '\n', () => {});
        //logger.info('[USER: ' + user.toString() + '] [GUILD: ' + guild.name + ' (' + guild.id + ')] ' + message);
    }
}

// --------------------------------------------------

module.exports = {
    logMessage
};