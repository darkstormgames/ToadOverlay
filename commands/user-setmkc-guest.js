/**
 * @description required modules
 */
const base = require('../functions/commandsBase');
const scraper = require('../functions/scraper');

/**
 * @description The name and trigger of the command
 */
const name = 'setmkc-guest';

/**
 * @description Alternative trigger(s) for the command
 */
const alt = ['guest', 'setmkcguest', 'set-guest', 'setguest', 'mkc-guest', 'mkcguest'];

/**
 * @description Defines the type of the command
 * This field is used for validation
 */
const type = base.CommandTypeEnum.General;

/**
 * @description Short description of the command
 */
const description = 'Set the guest team from the given mkc identifier.';

/**
 * @description execution of the command
 * @param {Discord.Message} message 
 * @param {string[]} args 
 */
function execute(message, args) {
    let isnum = /^\d+$/.test(args[0]);
    let guest_url = isnum ? 'https://www.mariokartcentral.com/mkc/registry/teams/' + args[0] : args[0];
    if (!guest_url) {
        message.channel.send('There was an error setting the guest-team!\nPlease try again with a valid team-id from MKC.')
        return;
    }
    if (guest_url.length < 30) {
      guest_url = '' + args[0];
    }
    scraper.getPage(guest_url, message.guild.id, message.channel.id, false)
    .then((result) => {
        if (result.error != null) {
            base.log.logMessage(result.debug_error, message.author, message.guild);
            message.channel.send(result.error);
        }
        else {
            base.log.logMessage('Executed command "setmkc-guest"', message.author, message.guild);
            message.channel.send('Guest team successfully set to ' + result.name + ' (' + result.tag + ')');
        }
    });
}

// --------------------------------------------------

module.exports = {
    name: name,
    alt: alt,
    type: type,
    description: description,
    execute: execute,
    guildOnly: true
};