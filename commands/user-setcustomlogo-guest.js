/**
 * @description required modules
 */
const base = require('../functions/commandsBase');

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
        if (message.attachments.size > 0) {
            // Write first image attached to the db
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET guest_mkc_link = "", guest_img = "' + message.attachments.values().next().value.proxyURL + '", last_updated = now() WHERE guild_id = ' + message.guild.id + ' AND channel_id = ' + message.channel.id + ';')
            .then((result) => {
                if (result.debug_error != null && result.error != null) {
                    message.channel.send('There was an error updating the logo for the guest team...\n\nPlease try again.');
                    base.log.logMessage(result.debug_error + '\n\t\t' + message.content, message.author, message.guild, message.channel);
                }
                else {
                    base.log.logMessage('Executed command "setlogo-guest"' + '\n\t\t' + message.content, message.author, message.guild, message.channel);
                    message.channel.send('Custom logo for the guest team has been set successfully from uploaded image.');
                }
            });
        }
        else if (args.length > 0) {
            // Write URL from arguments to the db
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET guest_mkc_link = "", guest_img = "' + args[0] + '", last_updated = now() WHERE guild_id = ' + message.guild.id + ' AND channel_id = ' + message.channel.id + ';')
            .then((result) => {
                if (result.debug_error != null && result.error != null) {
                    message.channel.send('There was an error updating the logo for the guest team...\n\nPlease try again.');
                    base.log.logMessage(result.debug_error, message.author, message.guild, message.channel);
                }
                else {
                    base.log.logMessage('Executed command "setlogo-guest"', message.author, message.guild, message.channel);
                    message.channel.send('Custom logo for the guest team has been set successfully from URL.');
                }
            });
        }
        else {
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET guest_mkc_link = "", guest_img = "", last_updated = now() WHERE guild_id = ' + message.guild.id + ' AND channel_id = ' + message.channel.id + ';')
            .then((result) => {
                if (result.debug_error != null && result.error != null) {
                    message.channel.send('There was an error removing the logo for the guest team...\n\nPlease try again.');
                    base.log.logMessage(result.debug_error, message.author, message.guild, message.channel);
                }
                else {
                    base.log.logMessage('Executed command "setlogo-guest"', message.author, message.guild, message.channel);
                    message.channel.send('Custom logo for the guest team has been removed successfully.');
                }
            });
        }
    }
};