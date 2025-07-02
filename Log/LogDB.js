const LogHelper = require('./LogHelper');
const LogLevel = require('./LogLevel');
const LogStatus = require('./LogStatus');
const LogFile = require('./LogFile');
const { LogApplication, LogDM, LogMessage, LogReaction } = require('../Data/SQLWrapper');

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

  LogDM: async (source, message, content, user, status, logLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;
    let log = LogDM.build({
      level: logLevel,
      status: status,
      source: source,
      message: message,
      content: content,
      user_id: user.id
    });
    await log.save()
    .catch((error) => {
      LogFile.LogDM('LogDB.LogDM', error, content, user, LogStatus.DBError, LogLevel.Error);
    });
  },

  LogModal: async () => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;

  },

  LogReaction: async (source, message, reactionData, status, logLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;
    let log = LogReaction.build({
      level: logLevel,
      status: status,
      source: source,
      message: message,
      emoji: reactionData.emoji,
      message_id: reactionData.messageId,
      user_id: reactionData.userId,
      channel_id: reactionData.channelId,
      guild_id: reactionData.guildId
    });
    await log.save()
    .catch((error) => {
      LogFile.LogReaction('LogDB.LogReaction', error, reactionData, LogStatus.DBError, LogLevel.Error);
    });
  },

  LogButton: async () => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;

  }
}
