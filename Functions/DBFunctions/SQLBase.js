const sql = require('./SQLQuery');

module.exports = {
    /**
     * Executes the given query string on the database
     * @param {string} query 
     * @param {(error: any) => void} failedCallback  
     * @param {boolean} isGetQuery 
     * @returns {Promise<boolean>|Promise<any[]>}
    */
    ExecuteQuery: (query, failedCallback = (error) => {}, isGetQuery = false) => {
        return new Promise((resolve) => {
            sql.execute(query)
            .then((queryResult) => {
                if (queryResult.error != null) {
                    if (failedCallback instanceof Function) {
                        failedCallback(queryResult.error);
                    }
                    resolve(false);
                }
                else {
                    if (isGetQuery == true) {
                        if (queryResult && queryResult.result && queryResult.result.length > 0) {
                            resolve(queryResult.result);
                        }
                        else {
                            if (failedCallback instanceof Function) {
                                failedCallback(null);
                            }
                            resolve(false);
                        }
                    }
                    else {
                        resolve(true);
                    }
                }
            })
            .catch((err) => {
                if (failedCallback instanceof Function) {
                    failedCallback(err);
                }
                resolve(false);
            });
        })
    },
}
