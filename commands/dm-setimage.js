/**
 * @description required modules
 */
const base = require('../functions/commandsBase');

module.exports = {
    /**
    * @description The name and trigger of the command
    */
    name: 'setimage',

    /**
    * @description Alternative trigger(s) for the command
    */
    alt: ['set-image'],

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
        base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET ol_bg_link = "' + content + '" WHERE user_id = ' + message.author.id)
        .then((result) => {
            if (result.error && result.debug_error) {
                message.author.send('There was an error updating your background image...\nPlease try again later.');
                base.log.logMessage(result.debug_error, message.author.id);
            }
            else {
                message.author.send('Your background image has been updated. Refresh your overlay to see the changes.');
                base.log.logMessage('Executed command "setimage"', message.author.id);
            }
        });
    }
};