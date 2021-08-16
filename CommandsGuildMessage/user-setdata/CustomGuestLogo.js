const Discord = require('discord.js');
const Data = require('../../Modules/Data/SQLWrapper');
const Log = require('../../Modules/Log/Logger');

module.exports = {
    name: 'setlogo-guest',
    alt: ['gsetlogo', 'glogo', 'logo-guest'],
    description: 'Overrides the logo displayed on the overlay in the given channel to the image passed through with the command.',

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        if (message.attachments.size > 0) {
            // Write first image attached to the db
            Data.ExecuteQuery('UPDATE ' + process.env.SQL_NAME + '.channel_data SET guest_mkc_url = "", guest_img = "' + Data.sql.connection.escape(message.attachments.values().next().value.proxyURL) + '" WHERE channel_id = ' + message.channel.id + ';', 
            (error) => {
                message.channel.send('There was an error updating the logo for the guest team...\n\nPlease try again.');
                Log.logMessage('There was an error updating the logo for the guest team...', 'setlogo-guest', error, message.guild, message.channel, message.author);
            })
            .then((result) => {
                if (result == true) {
                    message.channel.send('Custom logo for the guest team has been set successfully from uploaded image.');
                }
            });
        }
        else if (args.length > 0) {
            // Write URL from arguments to the db
            Data.ExecuteQuery('UPDATE ' + process.env.SQL_NAME + '.channel_data SET guest_mkc_url = "", guest_img = "' + Data.sql.connection.escape(args[0]) + '" WHERE channel_id = ' + message.channel.id + ';', 
            (error) => {
                message.channel.send('There was an error updating the logo for the guest team...\n\nPlease try again.');
                Log.logMessage('There was an error updating the logo for the guest team...', 'setlogo-guest', error, message.guild, message.channel, message.author);
            })
            .then((result) => {
                if (result == true) {
                    message.channel.send('Custom logo for the guest team has been set successfully from URL.');
                }
            });
        }
        else {
            Data.ExecuteQuery('UPDATE ' + process.env.SQL_NAME + '.channel_data SET guest_mkc_url = "", guest_img = "" WHERE channel_id = ' + message.channel.id + ';', 
            (error) => {
                message.channel.send('There was an error removing the logo for the guest team...\n\nPlease try again.');
                Log.logMessage('There was an error removing the logo for the guest team...', 'setlogo-guest', error, message.guild, message.channel, message.author);
            })
            .then((result) => {
                if (result == true) {
                    message.channel.send('Custom logo for the guest team has been removed successfully.');
                }
            });
        }
    }
};
