const NodeCache = require('node-cache');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { LogApplication, LogLevel, LogStatus } = require('../Log/Logger');

/**
 * CacheManager - Dual-layer caching system with in-memory and persistent storage
 * Provides transparent caching for MySQL entities with fallback mechanisms
 */
class CacheManager {
  constructor() {
    // Initialize configuration from environment variables
    this.config = {
      memory: {
        stdTTL: parseInt(process.env.CACHE_MEMORY_TTL) || 300, // 5 minutes default
        checkperiod: parseInt(process.env.CACHE_CHECK_PERIOD) || 60, // Check every 60 seconds
        maxKeys: parseInt(process.env.CACHE_MAX_KEYS) || 10000, // Maximum cached items
        useClones: false // Better performance for our use case
      },
      persistent: {
        enabled: process.env.CACHE_PERSISTENT_ENABLED !== 'false', // Enabled by default
        dbPath: process.env.CACHE_DB_PATH || path.join(__dirname, '..', 'app_data', 'db', 'cache.db'),
        defaultTTL: parseInt(process.env.CACHE_PERSISTENT_TTL) || 3600 // 1 hour default
      },
      debug: process.env.ENVIRONMENT === 'DEVELOPMENT'
    };

    // Initialize memory cache
    this.memoryCache = new NodeCache({
      stdTTL: this.config.memory.stdTTL,
      checkperiod: this.config.memory.checkperiod,
      maxKeys: this.config.memory.maxKeys,
      useClones: this.config.memory.useClones
    });

    // Initialize persistent cache if enabled
    this.persistentCache = null;
    if (this.config.persistent.enabled) {
      this.initializePersistentCache();
    }

    // Statistics tracking
    this.stats = {
      memoryHits: 0,
      memoryMisses: 0,
      persistentHits: 0,
      persistentMisses: 0,
      dbQueries: 0,
      errors: 0,
      startTime: Date.now()
    };

    // Cache invalidation rules for maintaining data consistency
    this.invalidationRules = new Map();
    this.setupInvalidationRules();

    // Setup event listeners for cache monitoring
    this.setupEventListeners();

    if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
      console.log('CacheManager initialized with config:', this.config);
    }
  }

  /**
   * Initialize persistent cache database
   */
  initializePersistentCache() {
    try {
      // Ensure cache directory exists
      const cacheDir = path.dirname(this.config.persistent.dbPath);
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Initialize SQLite database
      this.persistentCache = new Database(this.config.persistent.dbPath);
      this.persistentCache.pragma('journal_mode = WAL');
      this.persistentCache.pragma('synchronous = NORMAL');
      this.persistentCache.pragma('cache_size = 10000');

      // Create cache tables
      this.createCacheTables();

      // Prepare frequently used statements
      this.prepareStatements();

      // Setup cleanup interval
      this.setupCleanupInterval();

      LogApplication('CacheManager.InitializePersistentCache', 'Persistent cache initialized', LogStatus.Initialize, LogLevel.Debug, '', false);
      console.log('Persistent cache initialized at:', this.config.persistent.dbPath);
    } catch (error) {
      LogApplication('CacheManager.InitializePersistentCache', `Failed to initialize persistent cache: ${error.message}`, LogStatus.Error, LogLevel.Error, error.stack, false);
      console.error('Failed to initialize persistent cache:', error.message);
      this.config.persistent.enabled = false;
      this.persistentCache = null;
    }
  }

  /**
   * Create cache database tables
   */
  createCacheTables() {
    const queries = [
      `CREATE TABLE IF NOT EXISTS entity_cache (
        cache_key TEXT PRIMARY KEY,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        data TEXT NOT NULL,
        version TEXT,
        expires_at INTEGER NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        access_count INTEGER DEFAULT 1,
        last_accessed INTEGER DEFAULT (strftime('%s', 'now'))
      )`,
      `CREATE INDEX IF NOT EXISTS idx_entity_cache_expires ON entity_cache(expires_at)`,
      `CREATE INDEX IF NOT EXISTS idx_entity_cache_type_id ON entity_cache(entity_type, entity_id)`,
      `CREATE INDEX IF NOT EXISTS idx_entity_cache_accessed ON entity_cache(last_accessed)`,
      
      `CREATE TABLE IF NOT EXISTS cache_metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      )`,
      
      `CREATE TABLE IF NOT EXISTS invalidation_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        invalidated_keys TEXT NOT NULL,
        timestamp INTEGER DEFAULT (strftime('%s', 'now'))
      )`
    ];

    queries.forEach(query => this.persistentCache.exec(query));
  }

  /**
   * Prepare frequently used SQL statements
   */
  prepareStatements() {
    this.statements = {
      get: this.persistentCache.prepare(`
        SELECT data, version, access_count 
        FROM entity_cache 
        WHERE cache_key = ? AND expires_at > ?
      `),
      set: this.persistentCache.prepare(`
        INSERT OR REPLACE INTO entity_cache 
        (cache_key, entity_type, entity_id, data, version, expires_at, access_count, last_accessed) 
        VALUES (?, ?, ?, ?, ?, ?, 1, strftime('%s', 'now'))
      `),
      updateAccess: this.persistentCache.prepare(`
        UPDATE entity_cache 
        SET access_count = access_count + 1, last_accessed = strftime('%s', 'now') 
        WHERE cache_key = ?
      `),
      delete: this.persistentCache.prepare(`
        DELETE FROM entity_cache WHERE cache_key = ?
      `),
      deleteByType: this.persistentCache.prepare(`
        DELETE FROM entity_cache WHERE entity_type = ? AND entity_id = ?
      `),
      cleanup: this.persistentCache.prepare(`
        DELETE FROM entity_cache WHERE expires_at <= ?
      `),
      getStats: this.persistentCache.prepare(`
        SELECT 
          COUNT(*) as total_entries,
          COUNT(CASE WHEN expires_at > strftime('%s', 'now') THEN 1 END) as valid_entries,
          AVG(access_count) as avg_access_count,
          MAX(last_accessed) as last_access_time
        FROM entity_cache
      `),
      logInvalidation: this.persistentCache.prepare(`
        INSERT INTO invalidation_log (entity_type, entity_id, invalidated_keys) 
        VALUES (?, ?, ?)
      `)
    };
  }

  /**
   * Setup cache invalidation rules for different entity types
   */
  setupInvalidationRules() {
    // User entity invalidation affects user and profile caches
    this.invalidationRules.set('User', [
      'user:${id}',
      'profiles:${id}',
      'user_channels:${id}',
      'guild_users:${id}'
    ]);

    // Guild entity invalidation affects guild and related caches
    this.invalidationRules.set('Guild', [
      'guild:${id}',
      'guild_channels:${id}',
      'guild_users_by_guild:${id}'
    ]);

    // Channel entity invalidation affects channel and related caches
    this.invalidationRules.set('Channel', [
      'channel:${id}',
      'channel_profiles:${id}',
      'user_channels_by_channel:${id}'
    ]);

    // Profile entity invalidation affects profile and related caches
    this.invalidationRules.set('Profile', [
      'profile:${id}',
      'channel_profiles_by_profile:${id}'
    ]);

    // Junction table invalidations
    this.invalidationRules.set('UserChannel', [
      'user_channel:${user_id}:${channel_id}',
      'user_channels:${user_id}',
      'user_channels_by_channel:${channel_id}'
    ]);

    this.invalidationRules.set('GuildUser', [
      'guild_user:${user_id}:${guild_id}',
      'guild_users:${user_id}',
      'guild_users_by_guild:${guild_id}'
    ]);

    this.invalidationRules.set('ChannelProfile', [
      'channel_profile:${profile_id}:${channel_id}',
      'channel_profiles:${channel_id}',
      'channel_profiles_by_profile:${profile_id}'
    ]);
  }

  /**
   * Setup event listeners for cache monitoring
   */
  setupEventListeners() {
    // Memory cache events
    this.memoryCache.on('set', (key, value) => {        if (this.config.debug) {
          console.log('Memory cache set:', key);
        }
    });

    this.memoryCache.on('del', (key, value) => {        if (this.config.debug) {
          console.log('Memory cache delete:', key);
        }
    });

    this.memoryCache.on('expired', (key, value) => {        if (this.config.debug) {
          console.log('Memory cache expired:', key);
        }
    });

    this.memoryCache.on('flush', () => {
      LogApplication('CacheManager.MemoryCacheFlush', 'Memory cache flushed', LogStatus.Executed, LogLevel.Debug, '', false);
      console.log('Memory cache flushed');
    });
  }

  /**
   * Setup cleanup interval for expired entries
   */
  setupCleanupInterval() {
    // Cleanup expired entries every 5 minutes
    setInterval(() => {
      this.cleanupExpiredEntries();
    }, 5 * 60 * 1000);
  }

  /**
   * Generate cache key for an entity
   * @param {string} entityType - Type of entity (User, Guild, Channel, etc.)
   * @param {string} entityId - Entity ID
   * @param {string} suffix - Optional suffix for specific queries
   * @returns {string} Cache key
   */
  generateCacheKey(entityType, entityId, suffix = '') {
    const key = suffix ? `${entityType.toLowerCase()}:${entityId}:${suffix}` : `${entityType.toLowerCase()}:${entityId}`;
    return key;
  }

  /**
   * Get cached data with multi-layer fallback
   * @param {string} cacheKey - Cache key
   * @param {Function} queryFn - Function to execute if cache miss
   * @param {number} ttl - Time to live in seconds
   * @param {string} entityType - Entity type for invalidation tracking
   * @param {string} entityId - Entity ID for invalidation tracking
   * @returns {Promise<any>} Cached or fresh data
   */
  async get(cacheKey, queryFn, ttl = 300, entityType = null, entityId = null) {
    try {
      // Try memory cache first
      let result = this.memoryCache.get(cacheKey);
      if (result) {
        this.stats.memoryHits++;
        if (this.config.debug) {
          console.log('Memory cache hit:', cacheKey);
        }
        return result;
      }
      this.stats.memoryMisses++;

      // Try persistent cache if enabled
      if (this.persistentCache) {
        const now = Math.floor(Date.now() / 1000);
        const row = this.statements.get.get(cacheKey, now);
        if (row) {
          this.stats.persistentHits++;
          result = JSON.parse(row.data);
          
          // Update access count
          this.statements.updateAccess.run(cacheKey);
          
          // Store in memory cache for faster access
          this.memoryCache.set(cacheKey, result, ttl);
          
          if (this.config.debug) {
            console.log('Persistent cache hit:', cacheKey, 'Access count:', row.access_count + 1);
          }
          return result;
        }
        this.stats.persistentMisses++;
      }

      // Cache miss - execute query function
      this.stats.dbQueries++;
      result = await queryFn();
      
      if (result) {
        // Store in both caches
        await this.set(cacheKey, result, ttl, entityType, entityId);
      }

      if (this.config.debug) {
        console.log('Cache miss - data retrieved from database:', cacheKey);
      }

      return result;
    } catch (error) {
      this.stats.errors++;
      LogApplication('CacheManager.Get', `Cache get operation failed for key ${cacheKey}: ${error.message}`, LogStatus.Error, LogLevel.Error, error.stack, false);
      
      // Fallback to direct query
      try {
        return await queryFn();
      } catch (queryError) {
        LogApplication('CacheManager.Get', `Fallback query failed for key ${cacheKey}: ${queryError.message}`, LogStatus.Error, LogLevel.Error, queryError.stack, false);
        throw queryError;
      }
    }
  }

  /**
   * Set data in both cache layers
   * @param {string} cacheKey - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttl - Time to live in seconds
   * @param {string} entityType - Entity type for invalidation tracking
   * @param {string} entityId - Entity ID for invalidation tracking
   */
  async set(cacheKey, data, ttl = 300, entityType = null, entityId = null) {
    try {
      // Store in memory cache
      this.memoryCache.set(cacheKey, data, ttl);

      // Store in persistent cache if enabled
      if (this.persistentCache && data) {
        const expiresAt = Math.floor(Date.now() / 1000) + ttl;
        const version = this.generateVersion(data);
        
        this.statements.set.run(
          cacheKey,
          entityType || 'unknown',
          entityId || 'unknown',
          JSON.stringify(data),
          version,
          expiresAt
        );
      }

      if (this.config.debug) {
        console.log('Data cached successfully:', {
          key: cacheKey, 
          ttl, 
          entityType, 
          entityId 
        });
      }
    } catch (error) {
      this.stats.errors++;
      LogApplication('CacheManager.Set', `Cache set operation failed for key ${cacheKey}: ${error.message}`, LogStatus.Error, LogLevel.Error, error.stack, false);
    }
  }

  /**
   * Generate version string for cache validation
   * @param {any} data - Data to generate version for
   * @returns {string} Version string
   */
  generateVersion(data) {
    if (data && typeof data === 'object') {
      // Use updatedAt timestamp if available, otherwise use current timestamp
      if (data.updatedAt) {
        return data.updatedAt.toISOString();
      }
      if (data.updated_at) {
        return new Date(data.updated_at).toISOString();
      }
    }
    return new Date().toISOString();
  }

  /**
   * Delete specific cache entry
   * @param {string} cacheKey - Cache key to delete
   */
  async delete(cacheKey) {
    try {
      // Remove from memory cache
      this.memoryCache.del(cacheKey);

      // Remove from persistent cache if enabled
      if (this.persistentCache) {
        this.statements.delete.run(cacheKey);
      }

      if (this.config.debug) {
        console.log('Cache entry deleted:', cacheKey);
      }
    } catch (error) {
      this.stats.errors++;
      LogApplication('CacheManager.Delete', `Cache delete operation failed for key ${cacheKey}: ${error.message}`, LogStatus.Error, LogLevel.Error, error.stack, false);
    }
  }

  /**
   * Invalidate cache entries for a specific entity
   * @param {string} entityType - Entity type
   * @param {string} entityId - Entity ID
   * @param {Object} additionalData - Additional data for template replacement
   */
  async invalidateEntity(entityType, entityId, additionalData = {}) {
    try {
      const rules = this.invalidationRules.get(entityType);
      if (!rules) {
        console.warn('No invalidation rules found for entity type:', entityType);
        return;
      }

      const invalidatedKeys = [];
      const templateData = { id: entityId, ...additionalData };

      for (const ruleTemplate of rules) {
        // Replace template variables with actual values
        let cacheKey = ruleTemplate;
        for (const [key, value] of Object.entries(templateData)) {
          cacheKey = cacheKey.replace(`\${${key}}`, value);
        }

        await this.delete(cacheKey);
        invalidatedKeys.push(cacheKey);
      }

      // Log invalidation for debugging
      if (this.persistentCache) {
        this.statements.logInvalidation.run(
          entityType,
          entityId,
          JSON.stringify(invalidatedKeys)
        );
      }

      LogApplication('CacheManager.InvalidateEntity', `Entity cache invalidated for ${entityType}:${entityId}`, LogStatus.Executed, LogLevel.Debug, '', false);
      if (this.config.debug) {
        console.log('Entity cache invalidated:', { 
          entityType, 
          entityId, 
          invalidatedKeys 
        });
      }
    } catch (error) {
      this.stats.errors++;
      LogApplication('CacheManager.InvalidateEntity', `Cache invalidation failed for ${entityType}:${entityId}: ${error.message}`, LogStatus.Error, LogLevel.Error, error.stack, false);
    }
  }

  /**
   * Clear all cache entries
   */
  async clearAll() {
    try {
      // Clear memory cache
      this.memoryCache.flushAll();

      // Clear persistent cache if enabled
      if (this.persistentCache) {
        this.persistentCache.exec('DELETE FROM entity_cache');
        this.persistentCache.exec('DELETE FROM invalidation_log');
      }

      LogApplication('CacheManager.ClearAll', 'All cache entries cleared', LogStatus.Executed, LogLevel.Info, '', false);
      console.log('All cache entries cleared');
    } catch (error) {
      this.stats.errors++;
      LogApplication('CacheManager.ClearAll', `Cache clear operation failed: ${error.message}`, LogStatus.Error, LogLevel.Error, error.stack, false);
    }
  }

  /**
   * Clean up expired entries from persistent cache
   */
  cleanupExpiredEntries() {
    if (!this.persistentCache) return;

    try {
      const now = Math.floor(Date.now() / 1000);
      const result = this.statements.cleanup.run(now);
      
      if (result.changes > 0) {
        LogApplication('CacheManager.Cleanup', `Cache cleanup completed, removed ${result.changes} entries`, LogStatus.Executed, LogLevel.Debug, '', false);
        console.log('Cache cleanup completed, removed entries:', result.changes);
      }
    } catch (error) {
      this.stats.errors++;
      LogApplication('CacheManager.Cleanup', `Cache cleanup failed: ${error.message}`, LogStatus.Error, LogLevel.Error, error.stack, false);
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStatistics() {
    const memoryStats = this.memoryCache.getStats();
    const uptime = Date.now() - this.stats.startTime;
    
    let persistentStats = {};
    if (this.persistentCache) {
      try {
        const row = this.statements.getStats.get();
        persistentStats = {
          totalEntries: row.total_entries || 0,
          validEntries: row.valid_entries || 0,
          averageAccessCount: Math.round((row.avg_access_count || 0) * 100) / 100,
          lastAccessTime: row.last_access_time || 0
        };
      } catch (error) {
        LogApplication('CacheManager.GetStatistics', `Failed to get persistent cache statistics: ${error.message}`, LogStatus.Error, LogLevel.Error, error.stack, false);
      }
    }

    return {
      uptime: Math.round(uptime / 1000), // seconds
      memory: {
        hits: this.stats.memoryHits,
        misses: this.stats.memoryMisses,
        hitRatio: this.stats.memoryHits / (this.stats.memoryHits + this.stats.memoryMisses) || 0,
        keys: memoryStats.keys,
        ksize: memoryStats.ksize,
        vsize: memoryStats.vsize
      },
      persistent: {
        enabled: this.config.persistent.enabled,
        hits: this.stats.persistentHits,
        misses: this.stats.persistentMisses,
        hitRatio: this.stats.persistentHits / (this.stats.persistentHits + this.stats.persistentMisses) || 0,
        ...persistentStats
      },
      database: {
        queries: this.stats.dbQueries
      },
      errors: this.stats.errors,
      overallHitRatio: (this.stats.memoryHits + this.stats.persistentHits) / 
                      (this.stats.memoryHits + this.stats.memoryMisses + 
                       this.stats.persistentHits + this.stats.persistentMisses) || 0
    };
  }

  /**
   * Close cache connections and cleanup resources
   */
  close() {
    try {
      // Close memory cache
      this.memoryCache.close();

      // Close persistent cache
      if (this.persistentCache) {
        this.persistentCache.close();
      }

      LogApplication('CacheManager.Close', 'CacheManager closed successfully', LogStatus.Executed, LogLevel.Debug, '', false);
      console.log('CacheManager closed successfully');
    } catch (error) {
      LogApplication('CacheManager.Close', `Error closing CacheManager: ${error.message}`, LogStatus.Error, LogLevel.Error, error.stack, false);
    }
  }
}

// Export singleton instance
let cacheManagerInstance = null;

/**
 * Get the singleton CacheManager instance
 * @returns {CacheManager}
 */
function getCacheManager() {
  if (!cacheManagerInstance) {
    cacheManagerInstance = new CacheManager();
  }
  return cacheManagerInstance;
}

module.exports = {
  CacheManager,
  getCacheManager
};
