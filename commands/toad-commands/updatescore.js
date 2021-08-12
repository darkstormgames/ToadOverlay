/**
 * @description required modules
 */
const base = require('../../Functions/CommandsBase');

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
        base.db.CheckBaseData(message.guild, message.channel, message.author);
    
        let currentHome = message.embeds[0].fields[0].value;
        let currentGuest = message.embeds[0].fields[1].value;
        base.db.ChannelData.UpdateScores(currentHome, currentGuest, message.channel.id, (error) => {
            message.channel.send('There was an error updating war data...\nPlease try again later... Or not, because it´s already too late...');
            base.log.logMessage('There was an error updating war data...', 'update-result', error, message.guild, message.channel, message.author);
        });
    }
};
