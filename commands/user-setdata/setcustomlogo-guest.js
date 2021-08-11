/**
 * @description required modules
 */
const base = require('../../Functions/CommandsBase');

module.exports = {
    /**
    * @description The name and trigger of the command
    */
    name: 'setlogo-guest',

    /**
    * @description Alternative trigger(s) for the command
    */
    alt: ['gsetlogo', 'glogo', 'logo-guest'],

    /**
    * @description Defines the type of the command
    * This field is used for validation
    */
    type: base.CommandTypeEnum.General,

    /**
    * @description Short description of the command
    */
    description: 'Overrides the logo displayed on the overlay in the given channel to the image passed through with the command.',

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        base.db.CheckBaseData(message.guild, message.channel, message.author);
        if (message.attachments.size > 0) {
            base.log.logMessage('Executing command "setlogo-guest"', 'setlogo-guest', message.content, message.guild, message.channel, message.author);
            // Write first image attached to the db
            base.db.ExecuteQuery('UPDATE ' + process.env.SQL_NAME + '.channel_data SET guest_mkc_url = "", guest_img = "' + message.attachments.values().next().value.proxyURL + '" WHERE channel_id = ' + message.channel.id + ';', 
            (error) => {
                message.channel.send('There was an error updating the logo for the guest team...\n\nPlease try again.');
                base.log.logMessage('There was an error updating the logo for the guest team...', 'setlogo-guest', error, message.guild, message.channel, message.author);
            })
            .then((result) => {
                if (result == true) {
                    message.channel.send('Custom logo for the guest team has been set successfully from uploaded image.');
                }
            });
        }
        else if (args.length > 0) {
            base.log.logMessage('Executing command "setlogo-guest"', 'setlogo-guest', message.content, message.guild, message.channel, message.author);
            // Write URL from arguments to the db
            base.db.ExecuteQuery('UPDATE ' + process.env.SQL_NAME + '.channel_data SET guest_mkc_url = "", guest_img = "' + args[0] + '" WHERE channel_id = ' + message.channel.id + ';', 
            (error) => {
                message.channel.send('There was an error updating the logo for the guest team...\n\nPlease try again.');
                base.log.logMessage('There was an error updating the logo for the guest team...', 'setlogo-guest', error, message.guild, message.channel, message.author);
            })
            .then((result) => {
                if (result == true) {
                    message.channel.send('Custom logo for the guest team has been set successfully from URL.');
                }
            });
        }
        else {
            base.log.logMessage('Executing command "setlogo-guest" - CLEAR', 'setlogo-guest', message.content, message.guild, message.channel, message.author);
            base.db.ExecuteQuery('UPDATE ' + process.env.SQL_NAME + '.channel_data SET guest_mkc_url = "", guest_img = "" WHERE channel_id = ' + message.channel.id + ';', 
            (error) => {
                message.channel.send('There was an error removing the logo for the guest team...\n\nPlease try again.');
                base.log.logMessage('There was an error removing the logo for the guest team...', 'setlogo-guest', error, message.guild, message.channel, message.author);
            })
            .then((result) => {
                if (result == true) {
                    message.channel.send('Custom logo for the guest team has been removed successfully.');
                }
            });
        }
    }
};
