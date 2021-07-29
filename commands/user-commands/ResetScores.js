/**
 * @description required modules
 */
const base = require('../../Functions/CommandsBase');

module.exports = {
    /**
    * @description The name and trigger of the command
    */
    name: 'reset-scores',

    /**
    * @description Alternative trigger(s) for the command
    */
    alt: ['resetscores', 'resetscore', 'reset-score', 'reset'],

    /**
    * @description Defines the type of the command
    * This field is used for validation
    */
    type: base.CommandTypeEnum.General,

    /**
    * @description Short description of the command
    */
    description: 'Manually resets the scores for the current guild.',

    /**
    * @description I have absolutely no idea anymore...
    */
    guildOnly: true,

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        base.log.logMessage('Executing command "reset-scores"', 'reset-scores', message.content, message.guild, message.channel, message.author);
        base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET home_current = 0, guest_current = 0 WHERE channel_id = ' + message.channel.id)
        .then((result) => {
            if (result.error && result.debug_error) {
                message.channel.send('There was an error resetting war data...\nPlease try again later...');
                base.log.logMessage(result.debug_error, 'reset-scores', result.error, message.guild, message.channel, message.author);
            }
        });
    }
};
