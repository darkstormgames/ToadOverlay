/**
 * Test script for NoSQL logging system
 * Run this to verify the implementation works correctly
 */

require('dotenv').config();

const LogNoSQL = require('../Log/LogNoSQL');
const LogLevel = require('../Log/LogLevel');
const LogStatus = require('../Log/LogStatus');

async function testNoSQLLogging() {
  console.log('🧪 Testing NoSQL Logging System...\n');

  try {
    // Initialize the system
    console.log('1. Initializing NoSQL logging system...');
    await LogNoSQL.Initialize();
    console.log('   ✅ Initialization successful\n');

    // Test Application logging
    console.log('2. Testing Application logging...');
    await LogNoSQL.LogApplication(
      'TestScript',
      'Test application log entry',
      LogStatus.Executed,
      LogLevel.Info,
      'Test stack trace'
    );
    console.log('   ✅ Application log written\n');

    // Test DM logging
    console.log('3. Testing DM logging...');
    const mockUser = { id: '123456789' };
    await LogNoSQL.LogDM(
      'TestScript',
      'Test DM log entry',
      'Test DM content',
      mockUser,
      LogStatus.Executed,
      LogLevel.Info
    );
    console.log('   ✅ DM log written\n');

    // Test Reaction logging
    console.log('4. Testing Reaction logging...');
    const mockReactionData = {
      emoji: '👍',
      messageId: '987654321',
      userId: '123456789',
      channelId: '111111111',
      guildId: '222222222'
    };
    await LogNoSQL.LogReaction(
      'TestScript',
      'Test reaction log entry',
      mockReactionData,
      LogStatus.Executed,
      LogLevel.Info
    );
    console.log('   ✅ Reaction log written\n');

    // Test querying logs
    console.log('5. Testing log queries...');
    const appLogs = await LogNoSQL.QueryLogs('application', { source: 'TestScript' }, 10);
    console.log(`   ✅ Retrieved ${appLogs.length} application logs`);

    const dmLogs = await LogNoSQL.QueryLogs('dm', { userId: '123456789' }, 10);
    console.log(`   ✅ Retrieved ${dmLogs.length} DM logs`);

    const reactionLogs = await LogNoSQL.QueryLogs('reactions', { userId: '123456789' }, 10);
    console.log(`   ✅ Retrieved ${reactionLogs.length} reaction logs\n`);

    // Test statistics
    console.log('6. Testing log statistics...');
    const appStats = await LogNoSQL.GetLogStatistics('application');
    console.log(`   ✅ Application logs - Total: ${appStats.total}, Last 24h: ${appStats.last24Hours}`);

    const dmStats = await LogNoSQL.GetLogStatistics('dm');
    console.log(`   ✅ DM logs - Total: ${dmStats.total}, Last 24h: ${dmStats.last24Hours}`);

    const reactionStats = await LogNoSQL.GetLogStatistics('reactions');
    console.log(`   ✅ Reaction logs - Total: ${reactionStats.total}, Last 24h: ${reactionStats.last24Hours}\n`);

    // Test health status
    console.log('7. Testing health status...');
    const health = await LogNoSQL.GetHealthStatus();
    console.log(`   ✅ System initialized: ${health.initialized}`);
    console.log(`   ✅ Prepared statements: ${health.preparedStatements}`);
    console.log(`   ✅ Database connections: ${health.nosqlBase.connections}\n`);

    // Test maintenance
    console.log('8. Testing maintenance operations...');
    await LogNoSQL.PerformMaintenance();
    console.log('   ✅ Maintenance completed\n');

    console.log('🎉 All tests passed! NoSQL logging system is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    // Shutdown
    console.log('\n9. Shutting down...');
    await LogNoSQL.Shutdown();
    console.log('   ✅ Shutdown completed');
  }
}

// Run the test
testNoSQLLogging().catch(console.error);
