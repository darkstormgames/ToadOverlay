/**
 * @description required modules
 */
const base = require('../functions/commandsBase');

/**
 * @description The name and trigger of the command
 */
const name = 'settag-guest';

/**
 * @description Alternative trigger(s) for the command
 */
const alt = ['gsettag', 'gtag', 'tag-guest'];

/**
 * @description Defines the type of the command
 * This field is used for validation
 */
const type = base.CommandTypeEnum.General;

/**
 * @description Short description of the command
 */
const description = 'Overrides the tag displayed on the overlay in the given channel.';

/**
 * @description execution of the command
 * @param {Discord.Message} message 
 * @param {string[]} args 
 */
function execute(message, args) {
    if (args.length > 0) {
        // Write URL from arguments to the db
        base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET guest_mkc_link = "", guest_tag = "' + args[0] + '", last_updated = now() WHERE guild_id = ' + message.guild.id + ' AND channel_id = ' + message.channel.id + ';')
        .then((result) => {
            if (result.debug_error != null && result.error != null) {
                message.channel.send('There was an error updating the tag for the guest team...\n\nPlease try again.');
                base.log.logMessage(result.debug_error + '\n\t\t' + message.content, message.author, message.guild, message.channel);
            }
            else {
                base.log.logMessage('Executed command "settag-guest"' + '\n\t\t' + message.content, message.author, message.guild, message.channel);
                message.channel.send('Custom tag for the guest team has been set successfully.');
            }
        });
    }
    else {
        message.channel.send('No valid tag given!\n' 
                                + '```Example:\n_settag-guest N/A```');
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