/**
 * @typedef {Object} LogStatus
 * @property {string} None NONE
 * @property {string} Executing EXECUTING
 * @property {string} Executed EXECUTED
 * @property {string} Failed FAILED
 * @property {string} Error ERROR
 * @property {string} Initialize INIT
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
}