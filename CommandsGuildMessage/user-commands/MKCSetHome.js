const Discord = require('discord.js');
const Data = require('../../Modules/Data/SQLWrapper');
const Log = require('../../Modules/Log/Logger');
const Help = require('../../Modules/Help/HelpTexts');
const search = require('../../Modules/MKC/SearchEngine');

module.exports = {
    name: 'setmkc-home',
    alt: ['home', 'setmkchome', 'set-home', 'sethome', 'mkc-home', 'mkchome'], // ToDo: Check usage of alt-commands
    description: 'Set the home team from the given mkc identifier.',

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        if (!args[0] || args.length == 0) {
            message.channel.send('There was an error setting the home-team!\nPlease try again with a valid team-id from MKC.');
            return;
        }
        else if (args[0] == 'help') {
            // ToDo: Handling help differently...
            message.channel.send(Help.MKCSetHome);
            return;
        }

        let value = args[0].split('/')[args[0].split('/').length - 1];
        if (/^\d+$/.test(value) == false) {
            message.channel.send('There was an error setting the home-team!\nPlease try again with a valid team-id from MKC.');
            return;
        }

        search.getTeamById(value)
        .then((APIResult) => {
            if (!APIResult || APIResult == null) {
                message.channel.send('There was an error setting the home-team!\nPlease try again with a valid team-id from MKC.');
                return;
            }

            Data.ChannelData.UpdateHome(message.channel.id, value, APIResult,
                (error) => {
                    Log.logMessage('SQL-ERROR', 'setmkc-home', error, message.guild, message.channel, message.author);
                    message.channel.send('There was an error setting the home-team!\nPlease try again.');
            })
            .then((updateResult) => {
                if (updateResult === true) {
                    message.channel.send('Home team successfully set to ' + APIResult.team_name + ' (' + APIResult.team_tag + ')');
                    Log.logMessage('Executed command "setmkc-home"', 'setmkc-home', APIResult.team_name, message.guild, message.channel, message.author);
                }
            });
        });
    }
};
