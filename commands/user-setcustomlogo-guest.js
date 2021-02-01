/**
 * @description required modules
 */
const base = require('../functions/commandsBase');

/**
 * @description The name and trigger of the command
 */
const name = 'setlogo-guest';

/**
 * @description Alternative trigger(s) for the command
 */
const alt = ['gsetlogo', 'glogo', 'logo-guest'];

/**
 * @description Defines the type of the command
 * This field is used for validation
 */
const type = base.CommandTypeEnum.General;

/**
 * @description Short description of the command
 */
const description = 'Overrides the logo displayed on the overlay in the given channel to the image passed through with the command.';

/**
 * @description execution of the command
 * @param {Discord.Message} message 
 * @param {string[]} args 
 */
function execute(message, args) {
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
        message.channel.send('No valid image given!\nPlease provide an image through an URL to your logo or by uploading it directly to this channel with the command as text.\n' 
                                + '```Example:\n_setlogo-guest https://media.discordapp.net/attachments/534321571041378305/805849643548147722/YoshiPink-MK8.png```');
    }
}

// --------------------------------------------------

module.exports = {
    name: name,
    alt: alt,
    type: type,
    description: description,
    execute: execute,
};