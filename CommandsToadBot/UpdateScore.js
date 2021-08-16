const Discord = require('discord.js');
const Data = require('../Modules/Data/SQLWrapper');
const Log = require('../Modules/Log/Logger');

module.exports = {
    name: 'Total Score after Race',
    alt: [],
    description: '',

    /**
    * Execution logic of the command
    * @param {Discord.Message} message
    */
    execute: (message) => {
        let currentHome = message.embeds[0].fields[0].value;
        let currentGuest = message.embeds[0].fields[1].value;
        Data.ChannelData.UpdateScores(currentHome, currentGuest, message.channel.id, (error) => {
            message.channel.send('There was an error updating war data...\nPlease try again later... Or not, because it´s already too late...');
            Log.logMessage('There was an error updating war data...', 'update-result', error, message.guild, message.channel, message.author);
        });
    }
};
