const LogHelper = require('./LogHelper');
const LogLevel = require('./LogLevel');
const LogStatus = require('./LogStatus');
const LogFile = require('./LogFile');
const { nosqlController } = require('../Data/NoSQLController');

/**
 * NoSQL-based logging implementation
 * Replaces MySQL database operations with SQLite storage
 */
module.exports = {
  /**
   * Log application events to NoSQL database
   * @param {string} source - Source of the log entry
   * @param {string} message - Log message
   * @param {string} status - Log status
   * @param {string} logLevel - Log level
   * @param {string} stack - Stack trace (optional)
   */
  LogApplication: async (source, message, status, logLevel, stack = '') => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;

    try {
      // Ensure controller is initialized
      if (!nosqlController.initialized) {
        await nosqlController.initialize();
      }

      // Insert log entry
      const logId = nosqlController.insertApplicationLog(
        logLevel,
        status,
        source,
        message,
        stack
      );

      // Log success if in debug mode
      if (process.env.LOGLEVEL === 'DEBUG') {
        console.log(`LogNoSQL: Application log inserted with ID ${logId}`);
      }
    } catch (error) {
      // Fallback to file logging on database error
      console.error('LogNoSQL.LogApplication: Database error, falling back to file logging:', error);
      LogFile.LogApplication('LogNoSQL.LogApplication', `Database error: ${error.message}`, LogStatus.DBError, LogLevel.Error, new Error().stack);
      LogFile.LogApplication(source, message, status, logLevel, stack);
    }
  },

  /**
   * Log Discord message events to NoSQL database
   * @param {string} source - Source of the log entry
   * @param {string} message - Log message
   * @param {Object} messageContext - Discord message context
   * @param {string} status - Log status
   * @param {string} logLevel - Log level
   */
  LogMessage: async (source, message, messageContext, status, logLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;

    try {
      // Ensure controller is initialized
      if (!nosqlController.initialized) {
        await nosqlController.initialize();
      }

      // Insert log entry
      const logId = nosqlController.insertMessageLog(
        logLevel,
        status,
        source,
        message,
        messageContext.message.content,
        messageContext.data.user.id,
        messageContext.data.channel.id,
        messageContext.data.guild.id
      );

      // Log success if in debug mode
      if (process.env.LOGLEVEL === 'DEBUG') {
        console.log(`LogNoSQL: Message log inserted with ID ${logId}`);
      }
    } catch (error) {
      // Fallback to file logging on database error
      console.error('LogNoSQL.LogMessage: Database error, falling back to file logging:', error);
      LogFile.LogMessage('LogNoSQL.LogMessage', `Database error: ${error.message}`, messageContext, LogStatus.DBError, LogLevel.Error);
      LogFile.LogMessage(source, message, messageContext, status, logLevel);
    }
  },

  /**
   * Log command events to NoSQL database
   * @param {string} source - Source of the log entry
   * @param {string} message - Log message
   * @param {Object} commandContext - Command context
   * @param {string} status - Log status
   * @param {string} logLevel - Log level
   */
  LogCommand: async (source, message, commandContext, status, logLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;
    
    // Command logging not implemented yet in original system
    // This is a placeholder for future implementation
    console.log('LogNoSQL.LogCommand: Command logging not yet implemented');
  },

  /**
   * Log direct message events to NoSQL database
   * @param {string} source - Source of the log entry
   * @param {string} message - Log message
   * @param {string} content - DM content
   * @param {Object} user - Discord user object
   * @param {string} status - Log status
   * @param {string} logLevel - Log level
   */
  LogDM: async (source, message, content, user, status, logLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;

    try {
      // Ensure controller is initialized
      if (!nosqlController.initialized) {
        await nosqlController.initialize();
      }

      // Insert log entry
      const logId = nosqlController.insertDMLog(
        logLevel,
        status,
        source,
        message,
        content,
        user.id
      );

      // Log success if in debug mode
      if (process.env.LOGLEVEL === 'DEBUG') {
        console.log(`LogNoSQL: DM log inserted with ID ${logId}`);
      }
    } catch (error) {
      // Fallback to file logging on database error
      console.error('LogNoSQL.LogDM: Database error, falling back to file logging:', error);
      LogFile.LogDM('LogNoSQL.LogDM', `Database error: ${error.message}`, content, user, LogStatus.DBError, LogLevel.Error);
      LogFile.LogDM(source, message, content, user, status, logLevel);
    }
  },

  /**
   * Log modal events to NoSQL database
   */
  LogModal: async () => {
    // Modal logging not implemented yet in original system
    // This is a placeholder for future implementation
    console.log('LogNoSQL.LogModal: Modal logging not yet implemented');
  },

  /**
   * Log reaction events to NoSQL database
   * @param {string} source - Source of the log entry
   * @param {string} message - Log message
   * @param {Object} reactionData - Reaction data object
   * @param {string} status - Log status
   * @param {string} logLevel - Log level
   */
  LogReaction: async (source, message, reactionData, status, logLevel) => {
    if (!LogHelper.isValidLogLevel(logLevel)) return;

    try {
      // Ensure controller is initialized
      if (!nosqlController.initialized) {
        await nosqlController.initialize();
      }

      // Insert log entry
      const logId = nosqlController.insertReactionLog(
        logLevel,
        status,
        source,
        message,
        reactionData.emoji,
        reactionData.messageId,
        reactionData.userId,
        reactionData.channelId,
        reactionData.guildId
      );

      // Log success if in debug mode
      if (process.env.LOGLEVEL === 'DEBUG') {
        console.log(`LogNoSQL: Reaction log inserted with ID ${logId}`);
      }
    } catch (error) {
      // Fallback to file logging on database error
      console.error('LogNoSQL.LogReaction: Database error, falling back to file logging:', error);
      LogFile.LogReaction('LogNoSQL.LogReaction', `Database error: ${error.message}`, reactionData, LogStatus.DBError, LogLevel.Error);
      LogFile.LogReaction(source, message, reactionData, status, logLevel);
    }
  },

  /**
   * Log button events to NoSQL database
   */
  LogButton: async () => {
    // Button logging not implemented yet in original system
    // This is a placeholder for future implementation
    console.log('LogNoSQL.LogButton: Button logging not yet implemented');
  },

  /**
   * Query logs from NoSQL database
   * @param {string} logType - Type of log to query
   * @param {Object} criteria - Query criteria
   * @param {number} limit - Maximum results
   * @returns {Array} Query results
   */
  QueryLogs: async (logType, criteria = {}, limit = 100) => {
    try {
      if (!nosqlController.initialized) {
        await nosqlController.initialize();
      }

      return nosqlController.queryLogs(logType, criteria, limit);
    } catch (error) {
      console.error(`LogNoSQL.QueryLogs: Failed to query ${logType} logs:`, error);
      throw error;
    }
  },

  /**
   * Get log statistics from NoSQL database
   * @param {string} logType - Type of log
   * @returns {Object} Statistics
   */
  GetLogStatistics: async (logType) => {
    try {
      if (!nosqlController.initialized) {
        await nosqlController.initialize();
      }

      return nosqlController.getLogStatistics(logType);
    } catch (error) {
      console.error(`LogNoSQL.GetLogStatistics: Failed to get ${logType} statistics:`, error);
      throw error;
    }
  },

  /**
   * Cleanup old logs
   * @param {string} logType - Type of log
   * @param {number} retentionDays - Days to retain
   * @returns {number} Number of deleted records
   */
  CleanupOldLogs: async (logType, retentionDays = 30) => {
    try {
      if (!nosqlController.initialized) {
        await nosqlController.initialize();
      }

      return nosqlController.cleanupOldLogs(logType, retentionDays);
    } catch (error) {
      console.error(`LogNoSQL.CleanupOldLogs: Failed to cleanup ${logType} logs:`, error);
      throw error;
    }
  },

  /**
   * Perform database maintenance
   */
  PerformMaintenance: async () => {
    try {
      if (!nosqlController.initialized) {
        await nosqlController.initialize();
      }

      nosqlController.performMaintenance();
    } catch (error) {
      console.error('LogNoSQL.PerformMaintenance: Failed to perform maintenance:', error);
      throw error;
    }
  },

  /**
   * Get health status of NoSQL logging system
   * @returns {Object} Health status
   */
  GetHealthStatus: async () => {
    try {
      return nosqlController.getHealthStatus();
    } catch (error) {
      console.error('LogNoSQL.GetHealthStatus: Failed to get health status:', error);
      return {
        error: error.message,
        initialized: false
      };
    }
  },

  /**
   * Initialize NoSQL logging system
   */
  Initialize: async () => {
    try {
      await nosqlController.initialize();
      console.log('LogNoSQL: Initialization completed successfully');
    } catch (error) {
      console.error('LogNoSQL.Initialize: Initialization failed:', error);
      throw error;
    }
  },

  /**
   * Shutdown NoSQL logging system
   */
  Shutdown: async () => {
    try {
      nosqlController.shutdown();
      console.log('LogNoSQL: Shutdown completed successfully');
    } catch (error) {
      console.error('LogNoSQL.Shutdown: Shutdown failed:', error);
      throw error;
    }
  }
};
