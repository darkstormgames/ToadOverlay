/**
 * @description required modules
 */
const base = require('../functions/commandsBase');

module.exports = {
    /**
    * @description The name and trigger of the command
    */
    name: 'Total Score after Race',

    /**
    * @description Alternative trigger(s) for the command
    */
    alt: [],

    /**
    * @description Defines the type of the command
    * This field is used for validation
    */
    type: base.CommandTypeEnum.ToadCommand,

    /**
    * @description Short description of the command
    */
    description: '',

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        let currentHome = message.embeds[0].fields[0].value;
        let currentGuest = message.embeds[0].fields[1].value;
    
        base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = ' + currentHome + ', current_guest = ' + currentGuest + ', last_updated = now() WHERE guild_id = ' + message.guild.id + ' AND channel_id = ' + message.channel.id + ';')
        .then((result) => {
            if (result.error && result.debug_error) {
                message.channel.send('There was an error updating war data...\nPlease try again later... Or not, because it´s already too late...');
                base.log.logMessage(result.debug_error, message.author, message.guild);
            }
            else {
                base.log.logMessage('Executed command "update-result" | ' + currentHome + ' - ' + currentGuest, message.author, message.guild, message.channel);
            }
        });
    }
};