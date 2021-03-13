/**
 * @description required modules
 */
const base = require('../functions/commandsBase');
const scraper = require('../functions/scraper');

module.exports = {
    /**
    * @description The name and trigger of the command
    */
    name: 'setmkc-home',

    /**
    * @description Alternative trigger(s) for the command
    */
    alt: ['home', 'setmkchome', 'set-home', 'sethome', 'mkc-home', 'mkchome'],

    /**
    * @description Defines the type of the command
    * This field is used for validation
    */
    type: base.CommandTypeEnum.General,

    /**
    * @description Short description of the command
    */
    description: 'Set the home team from the given mkc identifier.',

    /**
    * @description I have absolutely no idea anymore...
    */
    guildOnly: true,

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        base.log.logMessage('Executing command "setmkc-home"', message.author, message.guild);
        let isnum = /^\d+$/.test(args[0]);
        let home_url = isnum ? 'https://www.mariokartcentral.com/mkc/registry/teams/' + args[0] : args[0];
        if (!home_url) {
            message.channel.send('There was an error setting the home-team!\nPlease try again with a valid team-id from MKC.')
            return;
        }
        if (home_url.length < 30) {
            home_url = '' + args[0];
          }
        scraper.getPage(home_url, message.guild.id, message.channel.id, true)
        .then((result) => {
            if (result.error != null) {
                base.log.logMessage(result.debug_error, message.author, message.guild);
                message.channel.send(result.error);
            }
            else {
                message.channel.send('Home team successfully set to ' + result.name + ' (' + result.tag + ')');
            }
        });
    }
};