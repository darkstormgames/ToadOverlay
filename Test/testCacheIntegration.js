/**
 * Cache Integration Test
 * Tests the cache integration without requiring database connection
 */

// Test importing cache functions from SQLWrapper
try {
  const SQLWrapper = require('../Data/SQLWrapper');
  
  console.log('✓ SQLWrapper imported successfully');
  
  // Check if cached functions are available
  const requiredFunctions = [
    'CheckBaseDataCached',
    'getCacheStatistics', 
    'clearAllCache',
    'invalidateUserCache',
    'invalidateGuildCache', 
    'invalidateChannelCache',
    'cachedQuery',
    'getCache'
  ];
  
  let missingFunctions = [];
  requiredFunctions.forEach(funcName => {
    if (typeof SQLWrapper[funcName] === 'function') {
      console.log(`✓ ${funcName} is available`);
    } else {
      console.log(`✗ ${funcName} is missing or not a function`);
      missingFunctions.push(funcName);
    }
  });
  
  // Test Helper functions
  const helper = SQLWrapper.Helper;
  if (helper) {
    console.log('✓ Helper object is available');
    
    const cachedHelperFunctions = [
      'CheckBaseDataCached',
      'getUserCached',
      'getGuildCached',
      'getChannelCached',
      'getUserProfilesCached',
      'checkUserCached',
      'checkGuildCached',
      'checkChannelCached',
      'getCacheStatistics'
    ];
    
    cachedHelperFunctions.forEach(funcName => {
      if (typeof helper[funcName] === 'function') {
        console.log(`✓ Helper.${funcName} is available`);
      } else {
        console.log(`✗ Helper.${funcName} is missing or not a function`);
        missingFunctions.push(`Helper.${funcName}`);
      }
    });
  } else {
    console.log('✗ Helper object is missing');
    missingFunctions.push('Helper');
  }
  
  // Test CacheManager availability
  try {
    const { getCacheManager } = require('../Data/CacheManager');
    console.log('✓ CacheManager can be imported');
    
    const cacheManager = getCacheManager();
    if (cacheManager && typeof cacheManager.get === 'function') {
      console.log('✓ CacheManager instance has get method');
    } else {
      console.log('✗ CacheManager instance missing get method');
      missingFunctions.push('CacheManager.get');
    }
  } catch (error) {
    console.log('✗ CacheManager import failed:', error.message);
    missingFunctions.push('CacheManager');
  }
  
  // Summary
  if (missingFunctions.length === 0) {
    console.log('\n🎉 All cache integration tests passed!');
    console.log('Cache system is ready for use.');
    process.exit(0);
  } else {
    console.log('\n❌ Cache integration tests failed!');
    console.log('Missing functions:', missingFunctions);
    process.exit(1);
  }
  
} catch (error) {
  console.log('✗ Failed to import SQLWrapper:', error.message);
  console.log('Stack:', error.stack);
  process.exit(1);
}
