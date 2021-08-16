const Discord = require('discord.js');
const Data = require('../../Modules/Data/SQLWrapper');
const Log = require('../../Modules/Log/Logger');

module.exports = {
    name: 'settag-guest',
    alt: ['gsettag', 'gtag', 'tag-guest'],
    description: 'Overrides the tag displayed on the overlay in the given channel.',

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        if (args.length > 0) {
            // Write URL from arguments to the db
            Data.ExecuteQuery('UPDATE ' + process.env.SQL_NAME + '.channel_data SET guest_mkc_url = "", guest_tag = "' + Data.sql.connection.escape(args[0]).replaceAll("'", "") + '" WHERE channel_id = ' + message.channel.id + ';', 
            (error) => {
                message.channel.send('There was an error updating the tag for the guest team...\n\nPlease try again.');
                Log.logMessage('There was an error updating the tag for the guest team...', 'settag-guest', error, message.guild, message.channel, message.author);
            })
            .then((result) => {
                if (result == true) {
                    message.channel.send('Custom tag for the guest team has been set successfully.');
                }
            });
        }
        else {
            message.channel.send('No valid tag given!\n' 
                                    + '```Example:\n_settag-guest N/A```');
        }
    }
};
