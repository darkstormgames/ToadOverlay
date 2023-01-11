export function padWithZeroes(number, length) {
  var my_string = '' + number;
  while (my_string.length < length) {
    my_string = '0' + my_string;
  }
  return my_string;
}

export function getDatePrefix() {
  let logTime = new Date();
  return '[' +
    logTime.getFullYear() + '.' +
    padWithZeroes((logTime.getMonth() + 1), 2) + '.' +
    padWithZeroes(logTime.getDate(), 2) + ' ' +
    padWithZeroes(logTime.getHours(), 2) + ':' +
    padWithZeroes(logTime.getMinutes(), 2) + ':' +
    padWithZeroes(logTime.getSeconds(), 2) + '] ';
}

export function getFileName(date) {
  return appRoot + dirSplit + 'app_data' + dirSplit + 'logs' + dirSplit +
    'dberror_' + logTime.getFullYear().toString() + padWithZeroes((logTime.getMonth() + 1), 2) + '.log';
}