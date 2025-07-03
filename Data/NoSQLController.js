const { v4: uuidv4 } = require('uuid');
const { nosqlBase } = require('./NoSQLBase');

/**
 * NoSQL database controller for logging operations
 * Provides CRUD operations and transaction support for SQLite logging databases
 */
class NoSQLController {
  constructor() {
    this.initialized = false;
    this.preparedStatements = new Map();
  }

  /**
   * Initialize the NoSQL controller and database schemas
   */
  async initialize() {
    if (this.initialized) return;

    try {
      nosqlBase.initialize();
      this.prepareCachedStatements();
      this.initialized = true;
      console.log('NoSQLController: Initialized successfully');
    } catch (error) {
      console.error('NoSQLController: Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Prepare cached statements for better performance
   */
  prepareCachedStatements() {
    try {
      // Application log insert statement
      const appDb = nosqlBase.getConnection('application');
      this.preparedStatements.set('insertApplication', 
        appDb.prepare(`
          INSERT INTO log_application (id, level, status, source, message, stack, created)
          VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        `)
      );

      // Message log insert statement
      const msgDb = nosqlBase.getConnection('messages');
      this.preparedStatements.set('insertMessage',
        msgDb.prepare(`
          INSERT INTO log_message (id, level, status, source, message, content, user_id, channel_id, guild_id, created)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `)
      );

      // DM log insert statement
      const dmDb = nosqlBase.getConnection('dm');
      this.preparedStatements.set('insertDM',
        dmDb.prepare(`
          INSERT INTO log_dm (id, level, status, source, message, content, user_id, created)
          VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `)
      );

      // Reaction log insert statement
      const reactionDb = nosqlBase.getConnection('reactions');
      this.preparedStatements.set('insertReaction',
        reactionDb.prepare(`
          INSERT INTO log_reaction (id, level, status, source, message, emoji, message_id, user_id, channel_id, guild_id, created)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `)
      );

      console.log('NoSQLController: Prepared statements cached successfully');
    } catch (error) {
      console.error('NoSQLController: Failed to prepare cached statements:', error);
      throw error;
    }
  }

  /**
   * Insert application log entry
   * @param {string} level - Log level
   * @param {string} status - Log status
   * @param {string} source - Log source
   * @param {string} message - Log message
   * @param {string} stack - Stack trace (optional)
   * @returns {string} Log entry ID
   */
  insertApplicationLog(level, status, source, message, stack = '') {
    if (!this.initialized) {
      throw new Error('NoSQLController not initialized');
    }

    const id = uuidv4();
    const stmt = this.preparedStatements.get('insertApplication');
    
    try {
      stmt.run(id, level, status, source, message, stack);
      return id;
    } catch (error) {
      console.error('NoSQLController: Failed to insert application log:', error);
      throw error;
    }
  }

  /**
   * Insert message log entry
   * @param {string} level - Log level
   * @param {string} status - Log status
   * @param {string} source - Log source
   * @param {string} message - Log message
   * @param {string} content - Message content
   * @param {string} userId - User ID
   * @param {string} channelId - Channel ID
   * @param {string} guildId - Guild ID
   * @returns {string} Log entry ID
   */
  insertMessageLog(level, status, source, message, content, userId, channelId, guildId) {
    if (!this.initialized) {
      throw new Error('NoSQLController not initialized');
    }

    const id = uuidv4();
    const stmt = this.preparedStatements.get('insertMessage');
    
    try {
      stmt.run(id, level, status, source, message, content, userId, channelId, guildId);
      return id;
    } catch (error) {
      console.error('NoSQLController: Failed to insert message log:', error);
      throw error;
    }
  }

  /**
   * Insert DM log entry
   * @param {string} level - Log level
   * @param {string} status - Log status
   * @param {string} source - Log source
   * @param {string} message - Log message
   * @param {string} content - DM content
   * @param {string} userId - User ID
   * @returns {string} Log entry ID
   */
  insertDMLog(level, status, source, message, content, userId) {
    if (!this.initialized) {
      throw new Error('NoSQLController not initialized');
    }

    const id = uuidv4();
    const stmt = this.preparedStatements.get('insertDM');
    
    try {
      stmt.run(id, level, status, source, message, content, userId);
      return id;
    } catch (error) {
      console.error('NoSQLController: Failed to insert DM log:', error);
      throw error;
    }
  }

  /**
   * Insert reaction log entry
   * @param {string} level - Log level
   * @param {string} status - Log status
   * @param {string} source - Log source
   * @param {string} message - Log message
   * @param {string} emoji - Reaction emoji
   * @param {string} messageId - Message ID
   * @param {string} userId - User ID
   * @param {string} channelId - Channel ID (optional for DMs)
   * @param {string} guildId - Guild ID (optional for DMs)
   * @returns {string} Log entry ID
   */
  insertReactionLog(level, status, source, message, emoji, messageId, userId, channelId = null, guildId = null) {
    if (!this.initialized) {
      throw new Error('NoSQLController not initialized');
    }

    const id = uuidv4();
    const stmt = this.preparedStatements.get('insertReaction');
    
    try {
      stmt.run(id, level, status, source, message, emoji, messageId, userId, channelId, guildId);
      return id;
    } catch (error) {
      console.error('NoSQLController: Failed to insert reaction log:', error);
      throw error;
    }
  }

  /**
   * Query logs by type and criteria
   * @param {string} logType - Type of log (application, messages, dm, reactions)
   * @param {Object} criteria - Query criteria
   * @param {number} limit - Maximum number of results
   * @returns {Array} Query results
   */
  queryLogs(logType, criteria = {}, limit = 100) {
    if (!this.initialized) {
      throw new Error('NoSQLController not initialized');
    }

    try {
      const db = nosqlBase.getConnection(logType);
      const tableName = `log_${logType === 'messages' ? 'message' : logType === 'dm' ? 'dm' : logType === 'reactions' ? 'reaction' : 'application'}`;
      
      let query = `SELECT * FROM ${tableName}`;
      let params = [];
      let whereConditions = [];

      // Build WHERE conditions
      if (criteria.level) {
        whereConditions.push('level = ?');
        params.push(criteria.level);
      }
      if (criteria.source) {
        whereConditions.push('source LIKE ?');
        params.push(`%${criteria.source}%`);
      }
      if (criteria.userId) {
        whereConditions.push('user_id = ?');
        params.push(criteria.userId);
      }
      if (criteria.guildId) {
        whereConditions.push('guild_id = ?');
        params.push(criteria.guildId);
      }
      if (criteria.dateFrom) {
        whereConditions.push('created >= ?');
        params.push(criteria.dateFrom);
      }
      if (criteria.dateTo) {
        whereConditions.push('created <= ?');
        params.push(criteria.dateTo);
      }

      if (whereConditions.length > 0) {
        query += ` WHERE ${whereConditions.join(' AND ')}`;
      }

      query += ' ORDER BY created DESC LIMIT ?';
      params.push(limit);

      const stmt = db.prepare(query);
      return stmt.all(...params);
    } catch (error) {
      console.error(`NoSQLController: Failed to query ${logType} logs:`, error);
      throw error;
    }
  }

  /**
   * Get log statistics
   * @param {string} logType - Type of log
   * @returns {Object} Statistics object
   */
  getLogStatistics(logType) {
    if (!this.initialized) {
      throw new Error('NoSQLController not initialized');
    }

    try {
      const db = nosqlBase.getConnection(logType);
      const tableName = `log_${logType === 'messages' ? 'message' : logType === 'dm' ? 'dm' : logType === 'reactions' ? 'reaction' : 'application'}`;
      
      const totalStmt = db.prepare(`SELECT COUNT(*) as total FROM ${tableName}`);
      const levelStmt = db.prepare(`SELECT level, COUNT(*) as count FROM ${tableName} GROUP BY level`);
      const recentStmt = db.prepare(`SELECT COUNT(*) as recent FROM ${tableName} WHERE created >= datetime('now', '-1 day')`);
      
      const total = totalStmt.get();
      const byLevel = levelStmt.all();
      const recent = recentStmt.get();

      return {
        total: total.total,
        byLevel: byLevel.reduce((acc, item) => {
          acc[item.level] = item.count;
          return acc;
        }, {}),
        last24Hours: recent.recent
      };
    } catch (error) {
      console.error(`NoSQLController: Failed to get statistics for ${logType}:`, error);
      throw error;
    }
  }

  /**
   * Cleanup old logs based on retention policy
   * @param {string} logType - Type of log
   * @param {number} retentionDays - Number of days to retain
   * @returns {number} Number of deleted records
   */
  cleanupOldLogs(logType, retentionDays = 30) {
    if (!this.initialized) {
      throw new Error('NoSQLController not initialized');
    }

    try {
      const db = nosqlBase.getConnection(logType);
      const tableName = `log_${logType === 'messages' ? 'message' : logType === 'dm' ? 'dm' : logType === 'reactions' ? 'reaction' : 'application'}`;
      
      const stmt = db.prepare(`DELETE FROM ${tableName} WHERE created < datetime('now', '-${retentionDays} days')`);
      const result = stmt.run();
      
      console.log(`NoSQLController: Cleaned up ${result.changes} old ${logType} log entries`);
      return result.changes;
    } catch (error) {
      console.error(`NoSQLController: Failed to cleanup old ${logType} logs:`, error);
      throw error;
    }
  }

  /**
   * Perform database maintenance operations
   */
  performMaintenance() {
    if (!this.initialized) {
      throw new Error('NoSQLController not initialized');
    }

    const logTypes = ['application', 'messages', 'dm', 'reactions'];
    
    logTypes.forEach(logType => {
      try {
        const db = nosqlBase.getConnection(logType);
        
        // VACUUM to reclaim space
        db.exec('VACUUM');
        
        // ANALYZE to update statistics
        db.exec('ANALYZE');
        
        console.log(`NoSQLController: Maintenance completed for ${logType} database`);
      } catch (error) {
        console.error(`NoSQLController: Maintenance failed for ${logType}:`, error);
      }
    });
  }

  /**
   * Get health status of the NoSQL controller
   * @returns {Object} Health status
   */
  getHealthStatus() {
    return {
      initialized: this.initialized,
      preparedStatements: this.preparedStatements.size,
      nosqlBase: nosqlBase.getHealthInfo()
    };
  }

  /**
   * Shutdown the controller and close connections
   */
  shutdown() {
    try {
      this.preparedStatements.clear();
      nosqlBase.closeAll();
      this.initialized = false;
      console.log('NoSQLController: Shutdown completed');
    } catch (error) {
      console.error('NoSQLController: Error during shutdown:', error);
    }
  }
}

// Create singleton instance
const nosqlController = new NoSQLController();

module.exports = {
  nosqlController,
  NoSQLController
};
