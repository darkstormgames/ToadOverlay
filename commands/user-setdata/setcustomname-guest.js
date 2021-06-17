/**
 * @description required modules
 */
const base = require('../../functions/commandsBase');
const dbhelper = require('../../functions/db-helper');

module.exports = {
    /**
    * @description The name and trigger of the command
    */
    name: 'setname-guest',

    /**
    * @description Alternative trigger(s) for the command
    */
    alt: ['gsetname', 'gname', 'name-guest'],

    /**
    * @description Defines the type of the command
    * This field is used for validation
    */
    type: base.CommandTypeEnum.General,

    /**
    * @description Short description of the command
    */
    description: 'Overrides the name displayed on the overlay in the given channel.',

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        base.log.logMessage('Executing command "setname-guest"' + '\n\t\t' + message.content, message.author, message.guild, message.channel);
        dbhelper.checkBaseData(message.guild, message.channel, message.author);
        if (args.length > 0) {
            // Write URL from arguments to the db
            base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET guest_mkc_url = "", guest_name = "' + args.join(' ') + '" WHERE channel_id = ' + message.channel.id + ';')
            .then((result) => {
                if (result.debug_error != null && result.error != null) {
                    message.channel.send('There was an error updating the name for the guest team...\n\nPlease try again.');
                    base.log.logMessage(result.debug_error + '\n\t\t' + message.content, message.author, message.guild, message.channel);
                }
                else {
                    message.channel.send('Custom name for the guest team has been set successfully.');
                }
            });
        }
        else {
            message.channel.send('No valid name given!\n' 
                                    + '```Example:\n_setname-guest This team sucks```');
        }
    }
};