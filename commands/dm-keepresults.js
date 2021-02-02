/**
 * @description required modules
 */
const base = require('../functions/commandsBase');

module.exports = {
    /**
    * @description The name and trigger of the command
    */
    name: 'keepresults',

    /**
    * @description Alternative trigger(s) for the command
    */
    alt: ['keepresult'],

    /**
    * @description Defines the type of the command
    * This field is used for validation
    */
    type: base.CommandTypeEnum.UserDM,

    /**
    * @description Short description of the command
    */
    description: '',

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string} content 
    */
    execute: (message, content) => {
        if (content == 0 || content == 1) {
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET keep_results = "' + content + '" WHERE user_id = ' + message.author.id)
            .then((result) => {
                if (result.error && result.debug_error) {
                    message.author.send('There was an error changing settings...\nPlease try again later.');
                    base.log.logMessage(result.debug_error, message.author.id);
                }
                else {
                    message.author.send('Setting has been changed successfully.');
                    base.log.logMessage('Executed command "keepresults"', message.author.id);
                }
            });
        }
        else {
            message.author.send('The provided parameter is invalid.');
            base.log.logMessage('Executed command "keepresults" with invalid parameter.', message.author.id);
        }
    }
};