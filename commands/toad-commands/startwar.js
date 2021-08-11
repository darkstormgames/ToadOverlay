/**
 * @description required modules
 */
const base = require('../../Functions/CommandsBase');

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
        base.db.CheckBaseData(message.guild, message.channel, message.author);

        base.db.ChannelData.UpdateScores(0, 0, message.channel.id, (error) => {
            message.channel.send('There was an error setting up a new war...\nPlease try again...');
            base.log.logMessage('There was an error setting up a new war...', 'startwar', error, message.guild, message.channel, message.author);
        });
    }
};
