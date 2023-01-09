function pad_with_zeroes(number, length) {
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}

module.exports = {
    pad_with_zeroes: pad_with_zeroes,

    getDatePrefix: () => {
        let logTime = new Date();
        return '[' +
            logTime.getFullYear() + '.' +
            pad_with_zeroes((logTime.getMonth()+1), 2) + '.' +
            pad_with_zeroes(logTime.getDate(), 2) + ' ' +
            pad_with_zeroes(logTime.getHours(), 2) + ':' +
            pad_with_zeroes(logTime.getMinutes(), 2) + ':' +
            pad_with_zeroes(logTime.getSeconds(), 2) + '] ';
    }
}
