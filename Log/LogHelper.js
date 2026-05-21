const LogType = require('./LogType');
const LogLevel = require('./LogLevel');

function padWithZeroes(number, length) {
  let str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
}

module.exports = {
  /**
   * @param {Number} number 
   * @param {Number} length 
   * @returns {String}
   */
  padWithZeroes: padWithZeroes,

  /**
   * @returns {String}
   */
  getDatePrefix: () => {
    let logTime = new Date();
    return logTime.getFullYear() + '.' +
      padWithZeroes((logTime.getMonth() + 1), 2) + '.' +
      padWithZeroes(logTime.getDate(), 2) + ' ' +
      padWithZeroes(logTime.getHours(), 2) + ':' +
      padWithZeroes(logTime.getMinutes(), 2) + ':' +
      padWithZeroes(logTime.getSeconds(), 2);
  },

  /**
   * @param {LogType} fileType
   * @returns {String}
   */
  getFileName: (fileType) => {
    let date = new Date();
    return `${appLogs}${fileType}_${date.getFullYear().toString()}${padWithZeroes((date.getMonth() + 1), 2)}.log`;
    // return appLogs + dirSplit + 'dberror_' + logTime.getFullYear().toString() + padWithZeroes((logTime.getMonth() + 1), 2) + '.log';
  },

  /**
   * @param {LogLevel} logLevel
   * @returns {boolean} 
   */
  isValidLogLevel: (logLevel) => {
    const configuredLogLevel = process.env.LOGLEVEL || LogLevel.Info;

    if (configuredLogLevel == LogLevel.Trace) return true;
    else if (configuredLogLevel == LogLevel.Debug && logLevel != LogLevel.Trace) return true;
    else if (configuredLogLevel == LogLevel.Info && logLevel != LogLevel.Trace && logLevel != LogLevel.Debug) return true;
    else if (configuredLogLevel == LogLevel.Warn && logLevel != LogLevel.Trace && logLevel != LogLevel.Debug && logLevel != LogLevel.Info) return true;
    else if (configuredLogLevel == LogLevel.Error && logLevel != LogLevel.Trace && logLevel != LogLevel.Debug && logLevel != LogLevel.Info && logLevel != LogLevel.Warn) return true;
    else if (configuredLogLevel == LogLevel.Fatal && logLevel != LogLevel.Trace && logLevel != LogLevel.Debug && logLevel != LogLevel.Info && logLevel != LogLevel.Warn && logLevel != LogLevel.Error) return true;
    else return false;
  }
}
