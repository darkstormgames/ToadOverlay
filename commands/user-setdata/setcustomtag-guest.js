/**
 * @description required modules
 */
const base = require('../../Functions/CommandsBase');
const dbhelper = require('../../Functions/DBDataHelper');

module.exports = {
    /**
    * @description The name and trigger of the command
    */
    name: 'settag-guest',

    /**
    * @description Alternative trigger(s) for the command
    */
    alt: ['gsettag', 'gtag', 'tag-guest'],

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
        base.log.logMessage('Executing command "settag-guest"', 'settag-guest', message.content, message.guild, message.channel, message.author);
        dbhelper.checkBaseData(message.guild, message.channel, message.author);
        if (args.length > 0) {
            // Write URL from arguments to the db
            base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET guest_mkc_url = "", guest_tag = "' + args[0] + '" WHERE channel_id = ' + message.channel.id + ';')
            .then((result) => {
                if (result.debug_error != null && result.error != null) {
                    message.channel.send('There was an error updating the tag for the guest team...\n\nPlease try again.');
                    base.log.logMessage(result.debug_error, 'settag-guest', message.content, message.guild, message.channel, message.author);
                }
                else {
                    message.channel.send('Custom tag for the guest team has been set successfully.');
                }
            });
        }
        else {
            message.channel.send('No valid tag given!\n' 
                                    + '```Example:\n_settag-guest N/A```');
        }
    }
};
