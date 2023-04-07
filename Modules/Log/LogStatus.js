/**
 * @typedef {Object} LogStatus
 * @property {string} None NONE
 * @property {string} Executing EXECUTING
 * @property {string} Executed EXECUTED
 * @property {string} Failed FAILED
 * @property {string} Error ERROR
 * @property {string} Initialize INIT
 * @property {string} DBError DB_ERROR
 */

/**
 * @type {LogStatus}
 * @ignore
 */
module.exports = {
  None: 'NONE',
  Executing: 'EXECUTING',
  Executed: 'EXECUTED',
  Failed: 'FAILED',
  Error: 'ERROR',
  Initialize: 'INIT',
  DBError: 'DB_ERROR'
}