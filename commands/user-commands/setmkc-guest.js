/**
 * @description required modules
 */
const base = require('../../functions/commandsBase');
const search = require('../../functions/MKCWrapper/SearchEngine');
const dbhelper = require('../../functions/db-helper');

module.exports = {
    /**
    * @description The name and trigger of the command
    */
    name: 'setmkc-guest',

    /**
    * @description Alternative trigger(s) for the command
    */
    alt: ['guest', 'setmkcguest', 'set-guest', 'setguest', 'mkc-guest', 'mkcguest'],

    /**
    * @description Defines the type of the command
    * This field is used for validation
    */
    type: base.CommandTypeEnum.General,

    /**
    * @description Short description of the command
    */
    description: 'Set the guest team from the given mkc identifier.',

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
        base.log.logMessage('Executing command "setmkc-guest"', message.author, message.guild);
        dbhelper.checkBaseData(message.guild, message.channel, message.author);

        if (!args[0]) {
            message.channel.send('There was an error setting the guest-team!\nPlease try again with a valid team-id from MKC.');
            return;
        }
        let isnum = false;
        let value = args[0];
        let rounds = 0;
        while (isnum == false) {
            value = value.split('/')[value.split('/').length - 1];
            isnum = /^\d+$/.test(value);
            rounds += 1;
            if (rounds > 3) {
                message.channel.send('There was an error setting the guest-team!\nPlease try again with a valid team-id from MKC.');
                return;
            }
        }

        search.getTeamById(value)
        .then((result) => {
            if (!result || result == null) {
                message.channel.send('There was an error setting the guest-team!\nPlease try again with a valid team-id from MKC.');
                return;
            }
            let sql_update_string = 'UPDATE ' + base.query.dbName + '.channel_data SET ' + 
                'guest_mkc_url = "https://www.mariokartcentral.com/mkc/registry/teams/' + url + 
                '", guest_name = "' + result.team_name + 
                '", guest_tag = "' + result.team_tag + 
                '", guest_img = "' + (result.team_logo == "" ? '' : ('https://www.mariokartcentral.com/mkc/storage/' + result.team_logo)) + 
                '" WHERE channel_id = ' + message.channel.id + ';';
            base.query.execute(sql_update_string)
            .then((dbresult) => {
                if (dbresult.error != null) {
                    base.log.logMessage(dbresult.debug_error, message.author, message.guild);
                    message.channel.send(dbresult.error);
                }
                else {
                    message.channel.send('Guest team successfully set to ' + result.team_name + ' (' + result.team_tag + ')');
                }
            })
            .catch((err) => {
                base.log.logMessage('SQL-ERROR:\n' + err);
                message.channel.send('There was an error setting the guest-team!\nPlease try again.');
            });
        });
    }
};