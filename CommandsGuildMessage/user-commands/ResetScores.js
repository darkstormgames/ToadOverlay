const Discord = require('discord.js');
const Data = require('../../Modules/Data/SQLWrapper');
const Log = require('../../Modules/Log/Logger');

module.exports = {
    name: 'reset-scores',
    alt: ['resetscores', 'resetscore', 'reset-score', 'reset'], // ToDo: Check usage of alt-commands
    description: 'Manually resets the scores for the current guild.',
    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        Data.ChannelData.UpdateScores(0, 0, message.channel.id, (error) => {
            message.channel.send('There was an error resetting war data...\nPlease try again later...');
            Log.logMessage(result.debug_error, 'reset-scores', result.error, message.guild, message.channel, message.author);
        });
    }
};
