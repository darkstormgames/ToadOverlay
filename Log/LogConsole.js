const LogHelper = require('./LogHelper');
const LogLevel = require('./LogLevel');
const LogStatus = require('./LogStatus');
//import chalk;
//const chalk = require('chalk');
const log = console.log;

module.exports = {
  LogApplication: async (source, message, status, logLevel, stack = '') => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;
    
    console.log('attempt to log')
    console.log('[' + LogHelper.getDatePrefix() + '] ' + 
          logLevel + ' ' +
          source + '\n' +
          message + ' ' + 
          status + 
          (stack != '' ? '\n' : '') + stack);
  },

  LogMessage: async (source, message, messageContext, status, logLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;
    log('[' + LogHelper.getDatePrefix() + '] ' + 
          logLevel + ' ' +
          source + '\n' +
          `[GUILD: ${messageContext.data.guild.name} (${messageContext.data.guild.id})] [CHANNEL: ${messageContext.data.channel.name} (${messageContext.data.channel.id})] [USER: ${messageContext.data.user.name} (${messageContext.data.user.id})]\n` +
          message + ' ' + 
          status + ' ' + messageContext.message.content);
  },

  LogCommand: async (source, message, commandContext, status, logLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;

  },

  LogDM: async (source, message, content, user, status, logLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;
    log('[' + LogHelper.getDatePrefix() + '] ' + 
      logLevel + ' ' +
      source + '\n' +
      `[USER: ${user.name} (${user.id})]\n` +
      message + ' ' +
      status + ' ' + content);
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
