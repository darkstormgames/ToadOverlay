const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Calculate paths relative to the main module
const dirSplit = (process.platform === 'win32' ? '\\' : '/');
const getAppRoot = () => {
  // If running from a test, use the test directory's parent
  const mainPath = require.main ? require.main.path : __dirname;
  if (mainPath.includes('Test')) {
    return path.join(mainPath, '..') + dirSplit;
  }
  return mainPath + dirSplit;
};

const appRoot = getAppRoot();
const appData = appRoot + 'app_data' + dirSplit;
const appDbLogs = appData + 'db' + dirSplit + 'logs' + dirSplit;
const appDbConfig = appData + 'db' + dirSplit + 'config' + dirSplit;

/**
 * SQLite connection manager for NoSQL logging operations
 * Provides separate database connections for different log types
 */
class NoSQLBase {
  constructor() {
    this.connections = new Map();
    this.initialized = false;
    this.ensureDirectories();
  }

  /**
   * Ensure all required directories exist
   */
  ensureDirectories() {
    const directories = [
      appData + 'db',
      appDbLogs,
      appDbConfig,
      appDbLogs + 'application',
      appDbLogs + 'messages', 
      appDbLogs + 'reactions',
      appDbLogs + 'dm'
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Get current database filename for a log type
   * @param {string} logType - Type of log (application, messages, reactions, dm)
   * @returns {string} Database file path
   */
  getCurrentDbPath(logType) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const dbName = `${year}-${month}.db`;
    return path.join(appDbLogs, logType, dbName);
  }

  /**
   * Get or create a database connection for a specific log type
   * @param {string} logType - Type of log (application, messages, reactions, dm)
   * @returns {Database} SQLite database connection
   */
  getConnection(logType) {
    const dbPath = this.getCurrentDbPath(logType);
    const connectionKey = `${logType}:${dbPath}`;

    if (!this.connections.has(connectionKey)) {
      try {
        const db = new Database(dbPath, {
          fileMustExist: false,
          timeout: 5000
        });

        // Configure SQLite for optimal performance
        db.pragma('journal_mode = WAL');
        db.pragma('synchronous = NORMAL');
        db.pragma('cache_size = 10000');
        db.pragma('temp_store = memory');
        db.pragma('mmap_size = 268435456'); // 256MB

        this.connections.set(connectionKey, db);
        console.log(`NoSQL: Created database connection for ${logType} at ${dbPath}`);
      } catch (error) {
        console.error(`NoSQL: Failed to create database connection for ${logType}:`, error);
        throw error;
      }
    }

    return this.connections.get(connectionKey);
  }

  /**
   * Initialize database schemas for all log types
   */
  initialize() {
    if (this.initialized) return;

    try {
      this.initializeApplicationSchema();
      this.initializeMessageSchema();
      this.initializeDMSchema();
      this.initializeReactionSchema();
      
      this.initialized = true;
      console.log('NoSQL: All database schemas initialized successfully');
    } catch (error) {
      console.error('NoSQL: Failed to initialize database schemas:', error);
      throw error;
    }
  }

  /**
   * Initialize LogApplication table schema
   */
  initializeApplicationSchema() {
    const db = this.getConnection('application');
    
    const createTable = `
      CREATE TABLE IF NOT EXISTS log_application (
        id TEXT PRIMARY KEY,
        level TEXT NOT NULL,
        status TEXT NOT NULL,
        source TEXT NOT NULL,
        message TEXT,
        stack TEXT,
        created DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_log_application_created ON log_application(created)',
      'CREATE INDEX IF NOT EXISTS idx_log_application_level ON log_application(level)',
      'CREATE INDEX IF NOT EXISTS idx_log_application_source ON log_application(source)',
      'CREATE INDEX IF NOT EXISTS idx_log_application_status ON log_application(status)'
    ];

    db.exec(createTable);
    createIndexes.forEach(index => db.exec(index));
  }

  /**
   * Initialize LogMessage table schema
   */
  initializeMessageSchema() {
    const db = this.getConnection('messages');
    
    const createTable = `
      CREATE TABLE IF NOT EXISTS log_message (
        id TEXT PRIMARY KEY,
        level TEXT NOT NULL,
        status TEXT NOT NULL,
        source TEXT NOT NULL,
        message TEXT,
        content TEXT,
        user_id TEXT,
        channel_id TEXT,
        guild_id TEXT,
        created DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_log_message_created ON log_message(created)',
      'CREATE INDEX IF NOT EXISTS idx_log_message_level ON log_message(level)',
      'CREATE INDEX IF NOT EXISTS idx_log_message_source ON log_message(source)',
      'CREATE INDEX IF NOT EXISTS idx_log_message_user_id ON log_message(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_log_message_guild_id ON log_message(guild_id)'
    ];

    db.exec(createTable);
    createIndexes.forEach(index => db.exec(index));
  }

  /**
   * Initialize LogDM table schema
   */
  initializeDMSchema() {
    const db = this.getConnection('dm');
    
    const createTable = `
      CREATE TABLE IF NOT EXISTS log_dm (
        id TEXT PRIMARY KEY,
        level TEXT NOT NULL,
        status TEXT NOT NULL,
        source TEXT NOT NULL,
        message TEXT,
        content TEXT,
        user_id TEXT,
        created DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_log_dm_created ON log_dm(created)',
      'CREATE INDEX IF NOT EXISTS idx_log_dm_level ON log_dm(level)',
      'CREATE INDEX IF NOT EXISTS idx_log_dm_source ON log_dm(source)',
      'CREATE INDEX IF NOT EXISTS idx_log_dm_user_id ON log_dm(user_id)'
    ];

    db.exec(createTable);
    createIndexes.forEach(index => db.exec(index));
  }

  /**
   * Initialize LogReaction table schema
   */
  initializeReactionSchema() {
    const db = this.getConnection('reactions');
    
    const createTable = `
      CREATE TABLE IF NOT EXISTS log_reaction (
        id TEXT PRIMARY KEY,
        level TEXT NOT NULL,
        status TEXT NOT NULL,
        source TEXT NOT NULL,
        message TEXT,
        emoji TEXT,
        message_id TEXT,
        user_id TEXT,
        channel_id TEXT,
        guild_id TEXT,
        created DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_log_reaction_created ON log_reaction(created)',
      'CREATE INDEX IF NOT EXISTS idx_log_reaction_level ON log_reaction(level)',
      'CREATE INDEX IF NOT EXISTS idx_log_reaction_source ON log_reaction(source)',
      'CREATE INDEX IF NOT EXISTS idx_log_reaction_user_id ON log_reaction(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_log_reaction_message_id ON log_reaction(message_id)'
    ];

    db.exec(createTable);
    createIndexes.forEach(index => db.exec(index));
  }

  /**
   * Close all database connections
   */
  closeAll() {
    for (const [key, db] of this.connections.entries()) {
      try {
        db.close();
        console.log(`NoSQL: Closed connection ${key}`);
      } catch (error) {
        console.error(`NoSQL: Error closing connection ${key}:`, error);
      }
    }
    this.connections.clear();
    this.initialized = false;
  }

  /**
   * Get database health information
   */
  getHealthInfo() {
    const health = {
      initialized: this.initialized,
      connections: this.connections.size,
      databases: []
    };

    for (const [key, db] of this.connections.entries()) {
      try {
        const info = db.prepare('SELECT COUNT(*) as count FROM sqlite_master WHERE type="table"').get();
        health.databases.push({
          key,
          tables: info.count,
          connected: true
        });
      } catch (error) {
        health.databases.push({
          key,
          connected: false,
          error: error.message
        });
      }
    }

    return health;
  }
}

// Create singleton instance
const nosqlBase = new NoSQLBase();

module.exports = {
  nosqlBase,
  NoSQLBase
};
