/**
 * @description required modules
 */
const mysql = require('mysql');
const { sql_data } = require('../config.json');

const connection = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    charset : 'utf8mb4',
    supportBigNumbers: true,
    bigNumberStrings: true
});

module.exports = {
    connection: connection,

    dbName: process.env.SQL_NAME,

    execute: (query) => {
        return new Promise((resolve) => {
            if (connection.state === 'disconnected') {
                connection.connect((err) => {
                    if (err) {
                        resolve({
                            result: null,
                            error: '[ERR201] There was an error connecting to the database...\nPlease try again later.',
                            debug_error: err
                        });
                        return;
                    }
                });
            }
            connection.query(query, (err, result) => {
                if (err) {
                    resolve({
                        result: null,
                        error: '[ERR203] There was an error with the database...\nPlease try again later.',
                        debug_error: err
                    });
                    return;
                }
                resolve({
                    result: result,
                    error: null,
                    debug_error: null
                });
            });
        });
    }
};