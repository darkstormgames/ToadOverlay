const LogHelper = require('./LogHelper');
const LogLevel = require('./LogLevel');
const LogStatus = require('./LogStatus');
const chalk = require('chalk');
const log = console.log;

module.exports = {
  LogApplication: async (source, message, status, logLevel, stack) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;
    log(chalk.bgBlue(
          chalk.yellow('[' + LogHelper.getDatePrefix() + '] ') + 
          chalk.yellow(logLevel) + ' ' +
          chalk.magentaBright(source) + '\n' +
          chalk.white(message) + ' ' + 
          chalk.green(status) + 
          (stack != '' ? '\n' : '') +
          chalk.redBright(stack)
    ));
  },

  LogMessage: async (source, message, messageContext, status, logLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;
    log(chalk.bgGreen(
          chalk.yellow('[' + LogHelper.getDatePrefix() + '] ') + 
          chalk.yellow(logLevel) + ' ' +
          chalk.magentaBright(source) + '\n' +
          `[GUILD: ${messageContext.data.guild.name} (${messageContext.data.guild.id})] [CHANNEL: ${messageContext.data.channel.name} (${messageContext.data.channel.id})] [USER: ${messageContext.data.user.name} (${messageContext.data.user.id})]\n` +
          chalk.white(message) + ' ' + 
          chalk.blue(status) + ' ' + messageContext.message.content
    ));
  },

  LogCommand: async (source, message, commandContext, status, logLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;

  },

  LogDM: async (source, message, user, status, logLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;

  },

  LogModal: async (logLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;

  },

  LogReaction: async (logLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;

  },

  LogButton: async (logLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;

  }
}
