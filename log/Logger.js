const fs = require('fs');
const LogLevel = require('./LogLevel');
const LogStatus = require('./LogStatus');

/**
 * @param {String} source 
 * @param {String} message 
 * @param {LogStatus} status 
 * @param {LogLevel} logLevel 
 * @param {String} stack 
 */
function LogConsole(source, message, status, logLevel, stack) {
  if (!isValidLogLevel(logLevel)) return;
  console.log('[' + getDatePrefix() + '] ' + 
        logLevel + ' ' +
        source + '\n' +
        message + ' ' + 
        status + 
        (stack != '' ? '\n' : '') +
        stack
  );
}

/**
 * @param {String} source 
 * @param {String} message 
 * @param {LogStatus} status 
 * @param {LogLevel} logLevel 
 * @param {String} stack 
 */
function LogFile(source, message, status, logLevel, stack) {
  if (!isValidLogLevel(logLevel)) return;
  let content = `\n[${getDatePrefix()}]\t[${logLevel}]\t${source}\n` +
                `[${status}]\t${message}` + (stack != '' ? '\n' : '') + stack + '\n';
  fs.appendFile(getFileName(), content, (err) => {
    if (err) LogConsole('LogFile.LogApplication', err.message, LogStatus.Error, LogLevel.Error, err.stack);
  });
}

/**
 * @param {Number} number 
 * @param {Number} length 
 * @returns {String}
 */
function padWithZeroes(number, length) {
  let str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}

/**
 * @returns {String}
 */
function getDatePrefix() {
  let logTime = new Date();
  return logTime.getFullYear() + '.' +
    padWithZeroes((logTime.getMonth() + 1), 2) + '.' +
    padWithZeroes(logTime.getDate(), 2) + ' ' +
    padWithZeroes(logTime.getHours(), 2) + ':' +
    padWithZeroes(logTime.getMinutes(), 2) + ':' +
    padWithZeroes(logTime.getSeconds(), 2);
}

/**
 * @returns {String}
 */
function getFileName() {
  let date = new Date();
  return `${appLogs}APPLICATION_${date.getFullYear().toString()}${padWithZeroes((date.getMonth() + 1), 2)}.log`;
}

/**
 * @param {LogLevel} logLevel
 * @returns {boolean} 
 */
function isValidLogLevel(logLevel) {
  if (process.env.LOGLEVEL == LogLevel.Trace) return true;
  else if (process.env.LOGLEVEL == LogLevel.Debug && logLevel != LogLevel.Trace) return true;
  else if (process.env.LOGLEVEL == LogLevel.Info && logLevel != LogLevel.Trace && logLevel != LogLevel.Debug) return true;
  else if (process.env.LOGLEVEL == LogLevel.Warn && logLevel != LogLevel.Trace && logLevel != LogLevel.Debug && logLevel != LogLevel.Info) return true;
  else if (process.env.LOGLEVEL == LogLevel.Error && logLevel != LogLevel.Trace && logLevel != LogLevel.Debug && logLevel != LogLevel.Info && logLevel != LogLevel.Warn) return true;
  else if (process.env.LOGLEVEL == LogLevel.Fatal && logLevel != LogLevel.Trace && logLevel != LogLevel.Debug && logLevel != LogLevel.Info && logLevel != LogLevel.Warn && logLevel != LogLevel.Error) return true;
  else return false;
}

module.exports = {
  /**
   * @param {String} source 
   * @param {String} message 
   * @param {LogStatus} status 
   * @param {LogLevel} logLevel 
   * @param {String} stack 
   */
  Log: async (source, message, status = LogStatus.None, logLevel = LogLevel.Info, stack = '') => {
    //if (process.env.ENVIRONMENT == 'DEVELOPMENT') {
      LogConsole(source, message, status, logLevel, stack);
    //}
    LogFile(source, message, status, logLevel, stack);
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