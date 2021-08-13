/**
 * @description required modules
 */
const base = require('../../Functions/CommandsBase');

module.exports = {
    /**
    * @description The name and trigger of the command
    */
    name: 'setlogo-home',

    /**
    * @description Alternative trigger(s) for the command
    */
    alt: ['hsetlogo', 'hlogo', 'logo-home'],

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
            base.log.logMessage('Executing command "setlogo-home"', 'setlogo-home', message.content, message.guild, message.channel, message.author);
            // Write first image attached to the db
            base.db.ExecuteQuery('UPDATE ' + process.env.SQL_NAME + '.channel_data SET home_mkc_url = "", home_img = "' + base.db.sql.connection.escape(message.attachments.values().next().value.proxyURL) + '" WHERE channel_id = ' + message.channel.id + ';', 
            (error) => {
                message.channel.send('There was an error updating the logo for the home team...\n\nPlease try again.');
                base.log.logMessage('There was an error updating the logo for the home team...', 'setlogo-home', error, message.guild, message.channel, message.author);
            })
            .then((result) => {
                if (result == true) {
                    message.channel.send('Custom logo for the home team has been set successfully from uploaded image.');
                }
            });
        }
        else if (args.length > 0) {
            base.log.logMessage('Executing command "setlogo-home"', 'setlogo-home', message.content, message.guild, message.channel, message.author);
            // Write URL from arguments to the db
            base.db.ExecuteQuery('UPDATE ' + process.env.SQL_NAME + '.channel_data SET home_mkc_url = "", home_img = "' + base.db.sql.connection.escape(args[0]) + '" WHERE channel_id = ' + message.channel.id + ';', 
            (error) => {
                message.channel.send('There was an error updating the logo for the home team...\n\nPlease try again.');
                base.log.logMessage('There was an error updating the logo for the home team...', 'setlogo-home', error, message.guild, message.channel, message.author);
            })
            .then((result) => {
                if (result == true) {
                    message.channel.send('Custom logo for the home team has been set successfully from URL.');
                }
            });
        }
        else {
            base.log.logMessage('Executing command "setlogo-home" - CLEAR', 'setlogo-home', message.content, message.guild, message.channel, message.author);
            base.db.ExecuteQuery('UPDATE ' + process.env.SQL_NAME + '.channel_data SET home_mkc_url = "", home_img = "" WHERE channel_id = ' + message.channel.id + ';', 
            (error) => {
                message.channel.send('There was an error removing the logo for the home team...\n\nPlease try again.');
                base.log.logMessage('There was an error removing the logo for the home team...', 'setlogo-home', error, message.guild, message.channel, message.author);
            })
            .then((result) => {
                if (result == true) {
                    message.channel.send('Custom logo for the home team has been removed successfully.');
                }
            });
        }
    },
};
