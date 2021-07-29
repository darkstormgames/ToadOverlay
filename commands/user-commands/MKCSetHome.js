/**
 * @description required modules
 */
const base = require('../../Functions/CommandsBase');
const search = require('../../Functions/MKCWrapper/SearchEngine');
const dbhelper = require('../../Functions/DBDataHelper');

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
        base.log.logMessage('Executing command "setmkc-home"', 'setmkc-home', message.content, message.guild, message.channel, message.author);
        dbhelper.checkBaseData(message.guild, message.channel, message.author);

        if (!args[0]) {
            message.channel.send('There was an error setting the home-team!\nPlease try again with a valid team-id from MKC.');
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
                message.channel.send('There was an error setting the home-team!\nPlease try again with a valid team-id from MKC.');
                return;
            }
        }

        search.getTeamById(value)
        .then((result) => {
            if (!result || result == null) {
                message.channel.send('There was an error setting the home-team!\nPlease try again with a valid team-id from MKC.');
                return;
            }
            let sql_update_string = 'UPDATE ' + base.query.dbName + '.channel_data SET ' + 
                'home_mkc_url = "https://www.mariokartcentral.com/mkc/registry/teams/' + value + 
                '", home_name = "' + result.team_name + 
                '", home_tag = "' + result.team_tag + 
                '", home_img = "' + (result.team_logo == "" ? '' : ('https://www.mariokartcentral.com/mkc/storage/' + result.team_logo)) + 
                '" WHERE channel_id = ' + message.channel.id + ';';
            base.query.execute(sql_update_string)
            .then((dbresult) => {
                if (dbresult.error != null) {
                    base.log.logMessage(dbresult.debug_error, 'setmkc-home', dbresult.error, message.guild, message.channel, message.author);
                    message.channel.send(dbresult.error);
                }
                else {
                    message.channel.send('home team successfully set to ' + result.team_name + ' (' + result.team_tag + ')');
                }
            })
            .catch((err) => {
                base.log.logMessage('SQL-ERROR', 'setmkc-home', err, message.guild, message.channel, message.author);
                message.channel.send('There was an error setting the home-team!\nPlease try again.');
            });
        });
    }
};
