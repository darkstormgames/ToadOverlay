/**
 * @description required modules
 */
const base = require('../../Functions/CommandsBase');

module.exports = {
    /**
    * @description The name and trigger of the command
    */
    name: 'setimage',

    /**
    * @description Alternative trigger(s) for the command
    */
    alt: ['img', 'bg', 'background', 'set-image'],

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
        base.log.logDM('Executing command "setimage"\n' + message.content, message.author);
        base.db.ExecuteQuery('UPDATE ' + process.env.SQL_NAME + ".profile SET bg_url = '" + base.db.sql.connection.escape(content) + "' WHERE user_id = " + message.author.id, 
        (error) => {
            message.author.send('There was an error updating your background image...\nPlease try again later.');
            base.log.logDM(error, message.author);
        })
        .then((result) => {
            if (result == true) {
                message.author.send('Your background image has been updated. Refresh your overlay to see the changes.');
            }
        });
    }
};
