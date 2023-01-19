module.exports = {
  /**
   * @param {Number} number 
   * @param {Number} length 
   * @returns {String}
   */
  padWithZeroes: (number, length) => {
    var str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  },
  /**
   * @returns {String}
   */
  getDatePrefix: () => {
    let logTime = new Date();
    return '[' +
      logTime.getFullYear() + '.' +
      padWithZeroes((logTime.getMonth() + 1), 2) + '.' +
      padWithZeroes(logTime.getDate(), 2) + ' ' +
      padWithZeroes(logTime.getHours(), 2) + ':' +
      padWithZeroes(logTime.getMinutes(), 2) + ':' +
      padWithZeroes(logTime.getSeconds(), 2) + '] ';
  },
  /**
   * @param {Date} date 
   * @returns {String}
   */
  getFileName: (date) => {
    return `${appLogs}dberror_${date.getFullYear().toString()}${padWithZeroes((date.getMonth() + 1), 2)}.log`;
    // return appLogs + dirSplit + 'dberror_' + logTime.getFullYear().toString() + padWithZeroes((logTime.getMonth() + 1), 2) + '.log';
  }
}