const LogHelper = require('./LogHelper');
const LogLevel = require('./LogLevel');
const LogStatus = require('./LogStatus');
const LogFile = require('./LogFile');
const { LogApplication, LogMessage } = require('../../Data/SQLWrapper');

module.exports = {
  LogApplication: async (source, message, status, logLevel, stack) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;
    let log = LogApplication.build({
      level: logLevel,
      status: status,
      source: source,
      message: message,
      stack: stack
    });
    await log.save()
    .catch((error) => {
      LogFile.LogApplication('LogDB.LogApplication', error, LogStatus.DBError, LogLevel.Error, new Error().stack);
    });
  },

  LogMessage: async (source, message, messageContext, status, logLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;
    let log = LogMessage.build({
      level: logLevel,
      status: status,
      source: source,
      message: message,
      content: messageContext.message.content,
      user_id: messageContext.data.user.id,
      channel_id: messageContext.data.channel.id,
      guild_id: messageContext.data.guild.id,
    });
    await log.save()
    .catch((error) => {
      LogFile.LogMessage('LogDB.LogMessage', error, messageContext, LogStatus.DBError, LogLevel.Error);
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
