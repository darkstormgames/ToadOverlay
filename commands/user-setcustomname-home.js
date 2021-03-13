/**
 * @description required modules
 */
const base = require('../functions/commandsBase');

module.exports = {
    /**
    * @description The name and trigger of the command
    */
    name: 'setname-home',

    /**
    * @description Alternative trigger(s) for the command
    */
    alt: ['hsetname', 'hname', 'name-home'],

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
        base.log.logMessage('Executing command "setname-home"' + '\n\t\t' + message.content, message.author, message.guild, message.channel);
        if (args.length > 0) {
            // Write URL from arguments to the db
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET home_mkc_link = "", home_name = "' + args.join(' ') + '", last_updated = now() WHERE guild_id = ' + message.guild.id + ' AND channel_id = ' + message.channel.id + ';')
            .then((result) => {
                if (result.debug_error != null && result.error != null) {
                    message.channel.send('There was an error updating the name for the home team...\n\nPlease try again.');
                    base.log.logMessage(result.debug_error + '\n\t\t' + message.content, message.author, message.guild, message.channel);
                }
                else {
                    message.channel.send('Custom name for the home team has been set successfully.');
                }
            });
        }
        else {
            message.channel.send('No valid name given!\n' 
                                    + '```Example:\n_setname-home This team sucks```');
        }
    }
};