const mysql = require('mysql');
const { sql_data } = require('../config.json');

const connection = mysql.createConnection({
    host: sql_data.host,
    user: sql_data.user,
    password: sql_data.password
});

function executeQuery(query) {
    return new Promise(resolve => {
        if (connection.state === 'disconnected') {
            connection.connect(function(err) {
                if (err) {
                    resolve({
                        result: null,
                        error: '[ERR201] There was an error connecting to the database...\n\nPlease try again later.',
                        debug_error: err
                    });
                    return;
                }
            });
        }
        connection.query(query, function(err, result) {
            if (err) {
                resolve({
                    result: null,
                    error: '[ERR203] There was an error with the database...\n\nPlease try again later.',
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

// --------------------------------------------------

module.exports = {
    connection: connection,
    dbName: sql_data.db_name,
    execute: executeQuery
};