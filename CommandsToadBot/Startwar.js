const Discord = require('discord.js');
const Data = require('../Modules/Data/SQLWrapper');
const Log = require('../Modules/Log/Logger');

module.exports = {
    name: 'Started MK',
    alt: [],
    description: '',

    /**
    * Execution logic of the command
    * @param {Discord.Message} message
    */
    execute: (message) => {
        Log.logMessage('Executing command "Started war between"', 'Started war between', message.content, message.guild, message.channel, message.author);
        Data.ChannelData.UpdateScores(0, 0, message.channel.id, (error) => {
            message.channel.send('There was an error setting up a new war...\nPlease try again...');
            Log.logMessage('There was an error setting up a new war...', 'startwar', error, message.guild, message.channel, message.author);
        });
    }
};
