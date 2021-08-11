/**
 * @description required modules
 */
const base = require('../../Functions/CommandsBase');

module.exports = {
    /**
    * @description The name and trigger of the command
    */
    name: 'settag-home',

    /**
    * @description Alternative trigger(s) for the command
    */
    alt: ['hsettag', 'htag', 'tag-home'],

    /**
    * @description Defines the type of the command
    * This field is used for validation
    */
    type: base.CommandTypeEnum.General,

    /**
    * @description Short description of the command
    */
    description: 'Overrides the tag displayed on the overlay in the given channel.',

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        base.log.logMessage('Executing command "settag-home"', 'settag-home', message.content, message.guild, message.channel, message.author);
        base.db.CheckBaseData(message.guild, message.channel, message.author);
        if (args.length > 0) {
            // Write URL from arguments to the db
            base.db.ExecuteQuery('UPDATE ' + process.env.SQL_NAME + '.channel_data SET home_mkc_url = "", home_tag = "' + args[0] + '" WHERE channel_id = ' + message.channel.id + ';', 
            (error) => {
                message.channel.send('There was an error updating the tag for the home team...\n\nPlease try again.');
                base.log.logMessage('There was an error updating the tag for the home team...', 'setname-guest', error, message.guild, message.channel, message.author);
            })
            .then((result) => {
                if (result == true) {
                    message.channel.send('Custom tag for the home team has been set successfully.');
                }
            });
        }
        else {
            message.channel.send('No valid tag given!\n' 
                                    + '```Example:\n_settag-home N/A```');
        }
    }
}
