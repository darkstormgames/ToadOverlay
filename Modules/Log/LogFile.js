const fs = require('fs');
const LogConsole = require('./LogConsole');
const LogHelper = require('./LogHelper');
const LogLevel = require('./LogLevel');
const LogStatus = require('./LogStatus');
const LogType = require('./LogType');

module.exports = {
  LogApplication: async (source, message, status, logLevel, stack) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;
    let content = `\n[${LogHelper.getDatePrefix()}]\t[${logLevel}]\t${source}\n` +
                  `[${status}]\t${message}` + (stack != '' ? '\n' : '') + stack + '\n';
    fs.appendFile(LogHelper.getFileName(LogType.Application), content, (err) => {
      if (err) LogConsole.LogApplication('LogFile.LogApplication', err.message, LogStatus.Error, LogLevel.Error, err.stack);
    });
  },

  LogMessage: async (source, message, messageContext, status, logLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;
    let content = `\n[${LogHelper.getDatePrefix()}]\t[${logLevel}]\t${source}\n` +
                  `[GUILD: ${messageContext.data.guild.name} (${messageContext.data.guild.id})] [CHANNEL: ${messageContext.data.channel.name} (${messageContext.data.channel.id})] [USER: ${messageContext.data.user.name} (${messageContext.data.user.id})]\n` +
                  `[${status}]\t${message}\t${messageContext.message.content}` + '\n';
    fs.appendFile(LogHelper.getFileName(LogType.Message), content, (err) => {
      if (err) LogConsole.LogMessage('LogFile.LogMessage', err.message, messageContext, LogStatus.Error, LogLevel.Error);
    });
  },

  LogCommand: async (source, message, commandContext, status, logLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;

  },

  LogDM: async (source, message, user, status, LogLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;

  },

  LogModal: async () => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;

  },

  LogReaction: async () => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;

  },

  LogButton: async () => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;

  }
}
