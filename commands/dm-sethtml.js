/**
 * @description required modules
 */
const base = require('../functions/commandsBase');

module.exports = {
    /**
    * @description The name and trigger of the command
    */
    name: 'sethtml',

    /**
    * @description Alternative trigger(s) for the command
    */
    alt: ['set-html'],

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
        base.log.logDM('Executing command "sethtml"\n' + message.content, message.author);
        base.query.execute("UPDATE " + base.query.dbName + ".user_data SET ol_html = '" + content + "' WHERE user_id = " + message.author.id)
        .then((result) => {
            if (result.error && result.debug_error) {
                message.author.send('There was an error updating your html...\nPlease try again later.');
                base.log.logDM(result.debug_error, message.author);
            }
            else {
                message.author.send('Your HTML body has been updated. Refresh your overlay to see the changes.');
            }
        });
    }
};