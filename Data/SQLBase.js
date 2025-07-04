const { Sequelize } = require('sequelize');

// Cache manager will be initialized after connection is established
let cacheManager = null;

/**
 * Initialize cache manager (called after connection is established)
 */
function initializeCache() {
  if (!cacheManager) {
    const { getCacheManager } = require('./CacheManager');
    cacheManager = getCacheManager();
  }
  return cacheManager;
}

/**
 * Execute a cached query with fallback to database
 * @param {string} cacheKey - Cache key for the query
 * @param {Function} queryFn - Function that executes the database query
 * @param {number} ttl - Time to live in seconds (default: 300 = 5 minutes)
 * @param {string} entityType - Entity type for cache invalidation
 * @param {string} entityId - Entity ID for cache invalidation
 * @returns {Promise<any>} Query result
 */
async function cachedQuery(cacheKey, queryFn, ttl = 300, entityType = null, entityId = null) {
  const cache = initializeCache();
  return await cache.get(cacheKey, queryFn, ttl, entityType, entityId);
}

/**
 * Get the cache manager instance
 * @returns {CacheManager}
 */
function getCache() {
  return initializeCache();
}

const connection = new Sequelize(
  process.env.SQL_NAME,
  process.env.SQL_USER,
  process.env.SQL_PASS,
  {
    host: process.env.SQL_HOST,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
      supportBigNumbers: true,
      bigNumberStrings: true
    },
    define: {
      charset: 'utf8mb4',
      dialectOptions: {
        collate: 'utf8mb4_general_ci'
      }
    },
    logging: (process.env.ENVIRONMENT == 'PRODUCTION' ? false : console.log),
    retry: {
      match: [/(?:Deadlock)|(?:DatabaseError)|(?:ContraintError)/i],
      max: 7
    },
    pool: {
      max: parseInt(process.env.SQL_POOL_MAX) || 10,
      min: parseInt(process.env.SQL_POOL_MIN) || 0,
      acquire: parseInt(process.env.SQL_POOL_ACQUIRE) || 30000,
      idle: parseInt(process.env.SQL_POOL_IDLE) || 10000
    },
    port: 3306
  }
);

connection.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
    process.exit(2);
  })

module.exports = {
  connection: connection,
  cachedQuery,
  getCache
}