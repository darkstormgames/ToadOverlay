const Discord = require('discord.js');
const Data = require('../../Modules/Data/SQLWrapper');
const Log = require('../../Modules/Log/Logger');

module.exports = {
    name: 'settag-home',
    alt: ['hsettag', 'htag', 'tag-home'],
    description: 'Overrides the tag displayed on the overlay in the given channel.',

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        if (args.length > 0) {
            // Write URL from arguments to the db
            Data.ExecuteQuery('UPDATE ' + process.env.SQL_NAME + '.channel_data SET home_mkc_url = "", home_tag = "' + Data.sql.connection.escape(args[0]).replaceAll("'", "") + '" WHERE channel_id = ' + message.channel.id + ';', 
            (error) => {
                message.channel.send('There was an error updating the tag for the home team...\n\nPlease try again.');
                Log.logMessage('There was an error updating the tag for the home team...', 'setname-guest', error, message.guild, message.channel, message.author);
            })
            .then((result) => {
                if (result == true) {
                    message.channel.send('Custom tag for the home team has been set successfully.');
                }
            });
        }
        else {
            message.channel.send('No valid tag given!\n' 
                                    + '```Example:\n_settag-home N/A```');
        }
    }
}
