/**
 * Integration test to verify the NoSQL system works with the actual bot initialization
 */

require('dotenv').config();

// Set up global directories exactly like index.js does
const fs = require('fs');
global.dirSplit = (process.platform === 'win32' ? '\\' : '/');
global.appRoot = __dirname + '/..' + global.dirSplit;
global.appData = global.appRoot + 'app_data' + global.dirSplit;
global.appLogs = global.appData + 'logs' + global.dirSplit;
global.appSchedule = global.appData + 'schedule' + global.dirSplit;
global.appDb = global.appData + 'db' + global.dirSplit;

// Create directories if they don't exist
if (!fs.existsSync(global.appData)) {
  fs.mkdirSync(global.appData);
}
if (!fs.existsSync(global.appLogs)) {
  fs.mkdirSync(global.appLogs);
}
if (!fs.existsSync(global.appSchedule)) {
  fs.mkdirSync(global.appSchedule);
}
if (!fs.existsSync(global.appDb)) {
  fs.mkdirSync(global.appDb);
}

const { LogApplication, LogLevel, LogStatus } = require('../Log/Logger');

async function testIntegration() {
  console.log('🧪 Testing NoSQL Integration with Logger...\n');

  try {
    // Test the main Logger interface (which should use NoSQL)
    console.log('1. Testing LogApplication via main Logger interface...');
    await LogApplication(
      'IntegrationTest', 
      'Testing NoSQL integration with main Logger', 
      LogStatus.Executed, 
      LogLevel.Info, 
      'Integration test stack', 
      true // useDB = true
    );
    console.log('   ✅ LogApplication via Logger successful\n');

    console.log('2. Testing LogApplication without database...');
    await LogApplication(
      'IntegrationTest', 
      'Testing without database logging', 
      LogStatus.Executed, 
      LogLevel.Info, 
      'Integration test stack', 
      false // useDB = false
    );
    console.log('   ✅ LogApplication without DB successful\n');

    // Test error handling
    console.log('3. Testing error logging...');
    await LogApplication(
      'IntegrationTest', 
      'Testing error level logging', 
      LogStatus.Error, 
      LogLevel.Error, 
      'Simulated error stack trace'
    );
    console.log('   ✅ Error logging successful\n');

    console.log('🎉 Integration test passed! NoSQL system is properly integrated with the main Logger.');

  } catch (error) {
    console.error('❌ Integration test failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

testIntegration().catch(console.error);
