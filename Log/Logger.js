const Discord = require('discord.js');
const { MessageContext } = require('../ClientHandlers/MessageContext');

const LogLevel = require('./LogLevel');
const LogStatus = require('./LogStatus');
const LogConsole = require('./LogConsole');
const LogNoSQL = require('./LogNoSQL');
const LogFile = require('./LogFile');

module.exports = {
  /**
   * 
   * @param {String} source 
   * @param {String} message 
   * @param {LogStatus} status 
   * @param {LogLevel} logLevel 
   * @param {String} stack 
   * @param {boolean} useDB
   */
  LogApplication: async (source, message, status = LogStatus.None, logLevel = LogLevel.Info, stack = '', useDB = true) => {
    if (process.env.ENVIRONMENT == 'DEVELOPMENT') {
      LogConsole.LogApplication(source, message, status, logLevel, stack);
    }
    if (process.env.LOGLEVEL == 'DEBUG') {
      LogFile.LogApplication(source, message, status, logLevel, stack);
    }
    if (useDB == true && logLevel != LogLevel.Trace) {
      LogNoSQL.LogApplication(source, message, status, logLevel, stack);
    }
  },
 /**
  * 
  * @param {string} source 
  * @param {string} message 
  * @param {MessageContext} messageContext 
  * @param {LogStatus} status 
  * @param {LogLevel} logLevel 
  */
  LogMessage: async (source, message, messageContext, status = LogStatus.None, logLevel = LogLevel.Info) => {
    if (process.env.ENVIRONMENT == 'DEVELOPMENT') {
      LogConsole.LogMessage(source, message, messageContext, status, logLevel);
    }
    if (process.env.LOGLEVEL == 'DEBUG') {
      LogFile.LogMessage(source, message, messageContext, status, logLevel);
    }
    LogNoSQL.LogMessage(source, message, messageContext, status, logLevel);
  },

  LogCommand: async (source, message, commandContext, status = LogStatus.None, logLevel = LogLevel.Info) => {
    
  },

  /**
   * 
   * @param {string} source 
   * @param {Discord.Message} message 
   * @param {Discord.User} user 
   * @param {LogStatus} status 
   * @param {LogLevel} LogLevel 
   */
  LogDM: async (source, message, content, user, status = LogStatus.None, logLevel = LogLevel.Info) => {
    if (process.env.ENVIRONMENT == 'DEVELOPMENT') {
      LogConsole.LogDM(source, message, content, user, status, logLevel);
    }
    if (process.env.LOGLEVEL == 'DEBUG') {
      LogFile.LogDM(source, message, content, user, status, logLevel);
    }
    LogNoSQL.LogDM(source, message, content, user, status, logLevel);
  },

  LogModal: async () => {

  },

  LogReaction: async (source, message, reactionData, status = LogStatus.None, logLevel = LogLevel.Info) => {
    if (process.env.ENVIRONMENT == 'DEVELOPMENT') {
      LogConsole.LogReaction(source, message, reactionData, status, logLevel);
    }
    if (process.env.LOGLEVEL == 'DEBUG') {
      LogFile.LogReaction(source, message, reactionData, status, logLevel);
    }
    LogNoSQL.LogReaction(source, message, reactionData, status, logLevel);
  },

  LogButton: async () => {

  },

  /**
   * @type {LogLevel}
   */
  LogLevel: LogLevel,
  /**
   * @type {LogStatus}
   */
  LogStatus: LogStatus
}