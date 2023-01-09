const chalk = require('chalk');
const helper = require('./LogHelper');
const log = console.log;

module.exports = {
    LogFileLoaded: (module, file) => {
        if (process.env.ENVIRONMENT != 'DEBUG') return;
        log(chalk.green(module + ': ') + chalk.blue(file));
    },




    LogMessage: (message, command, data = null, guild = null, channel = null, user = null) => {
        if (process.env.ENVIRONMENT != 'DEBUG') return;
        log(chalk.yellow(helper.getDatePrefix()) +
            chalk.black.bgWhite((guild ? '[GUILD: ' + guild.name + ' (' + guild.id + ')]' : '[GUILD: N/A]') + ' ') +
            chalk.black.bgWhite((channel ? '[CHANNEL: ' + channel.name + ' (' + channel.id + ')]' : '[CHANNEL: N/A]') + ' ') +
            chalk.black.bgWhite((user ? '[USER: ' + user.username + ' (' + user.id + ')]' : '[USER: N/A]')) + ' ' +
            chalk.green(command) + ' ' +
            chalk.magenta(message) + '\n' +
            chalk.redBright(data));
    },

    LogDM: (message, command, content = null, user = null) => {
        if (process.env.ENVIRONMENT != 'DEBUG') return;
        log(chalk.yellow(helper.getDatePrefix()) +
            chalk.white((user ? '[USER: ' + user.username + ' (' + user.id + ')] ' : '[USER: N/A] ')) +
            chalk.green(command) + ' ' +
            chalk.magenta(message) + '\n' +
            chalk.redBright(content));
    },

    LogWarReaction: (guild, channel, user, message, title, messageId) => {
        if (process.env.ENVIRONMENT != 'DEBUG') return;
        log(chalk.yellow(helper.getDatePrefix()) +
            chalk.white((guild ? '[GUILD: ' + guild.name + ' (' + guild.id + ')]' : '[GUILD: N/A]') + ' ') +
            chalk.white((channel ? '[CHANNEL: ' + channel.name + ' (' + channel.id + ')]' : '[CHANNEL: N/A]') + ' ') +
            chalk.white((user ? '[USER: ' + user.username + ' (' + user.id + ')]' : '[USER: N/A]')) + ' ' +
            chalk.green(message + (title ? ' for ' + title + ' (' + messageId + ')' : '')));
    },
}
