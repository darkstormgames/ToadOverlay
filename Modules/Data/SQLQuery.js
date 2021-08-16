const mysql = require('mysql');

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

    execute: (query) => {
        return new Promise((resolve) => {
            if (connection.state === 'disconnected') {
                connection.connect((err) => {
                    if (err) {
                        resolve({
                            result: null,
                            error: err
                        });
                    }
                });
            }
            connection.query(query, (err, result) => {
                if (err) {
                    resolve({
                        result: null,
                        error: err
                    });
                } else {
                    resolve({
                        result: result,
                        error: null
                    });
                }
            });
        });
    }
}
