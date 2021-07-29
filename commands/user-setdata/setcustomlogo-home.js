/**
 * @description required modules
 */
const base = require('../../Functions/CommandsBase');
const dbhelper = require('../../Functions/DBDataHelper');

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
        dbhelper.checkBaseData(message.guild, message.channel, message.author);
        if (message.attachments.size > 0) {
            base.log.logMessage('Executing command "setlogo-home"', 'setlogo-home', message.content, message.guild, message.channel, message.author);
            // Write first image attached to the db
            base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET home_mkc_url = "", home_img = "' + message.attachments.values().next().value.proxyURL + '" WHERE channel_id = ' + message.channel.id + ';')
            .then((result) => {
                if (result.debug_error != null && result.error != null) {
                    message.channel.send('There was an error updating the logo for the home team...\n\nPlease try again.');
                    base.log.logMessage(result.debug_error, 'setlogo-home', result.error, message.guild, message.channel, message.author);
                }
                else {
                    message.channel.send('Custom logo for the home team has been set successfully from uploaded image.');
                }
            });
        }
        else if (args.length > 0) {
            base.log.logMessage('Executing command "setlogo-home"', 'setlogo-home', message.content, message.guild, message.channel, message.author);
            // Write URL from arguments to the db
            base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET home_mkc_url = "", home_img = "' + args[0] + '" WHERE channel_id = ' + message.channel.id + ';')
            .then((result) => {
                if (result.debug_error != null && result.error != null) {
                    message.channel.send('There was an error updating the logo for the home team...\n\nPlease try again.');
                    base.log.logMessage(result.debug_error, 'setlogo-home', result.error, message.guild, message.channel, message.author);
                }
                else {
                    message.channel.send('Custom logo for the home team has been set successfully from URL.');
                }
            });
        }
        else {
            base.log.logMessage('Executing command "setlogo-home" - CLEAR', 'setlogo-home', message.content, message.guild, message.channel, message.author);
            base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET home_mkc_url = "", home_img = "" WHERE channel_id = ' + message.channel.id + ';')
            .then((result) => {
                if (result.debug_error != null && result.error != null) {
                    message.channel.send('There was an error removing the logo for the home team...\n\nPlease try again.');
                    base.log.logMessage(result.debug_error, 'setlogo-home', result.error, message.guild, message.channel, message.author);
                }
                else {
                    message.channel.send('Custom logo for the home team has been removed successfully.');
                }
            });
        }
    },
};
