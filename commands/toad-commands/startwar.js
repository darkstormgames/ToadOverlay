/**
 * @description required modules
 */
const base = require('../../Functions/CommandsBase');
const dbhelper = require('../../Functions/DBDataHelper');

module.exports = {
    /**
    * @description The name and trigger of the command
    */
    name: 'Started war between',

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
        base.log.logMessage('Executing command "startwar"', 'startwar', message.content, message.guild, message.channel, message.author);
        dbhelper.checkBaseData(message.guild, message.channel, message.author);

        base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET home_current = 0, guest_current = 0 WHERE channel_id = ' + message.channel.id + ';')
        .then((result) => {
            if (result.error && result.debug_error) {
                message.channel.send('There was an error setting up a new war...\nPlease try again...');
                base.log.logMessage(result.debug_error, 'startwar', null, message.guild, message.channel, message.author);
            }
        });

        // base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 0, current_guest = 0, last_updated = now() WHERE guild_id = ' + message.guild.id + ' AND channel_id = ' + message.channel.id + ';')
        // .then((result) => {
        //     if (result.error && result.debug_error) {
        //         message.channel.send('There was an error setting up a new war...\nPlease try again...');
        //         base.log.logMessage(result.debug_error, message.author, message.guild, message.channel);
        //     }
        // });
    }
};
