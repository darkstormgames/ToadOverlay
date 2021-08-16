const Discord = require('discord.js');
const Data = require('../../Modules/Data/SQLWrapper');
const Log = require('../../Modules/Log/Logger');
const base = require('../../Functions/CommandsBase');
const search = require('../../Modules/MKC/SearchEngine');

module.exports = {
    name: 'setmkc-guest',
    alt: ['guest', 'setmkcguest', 'set-guest', 'setguest', 'mkc-guest', 'mkcguest'], // ToDo: Check usage of alt-commands
    description: 'Set the guest team from the given mkc identifier.',

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        if (!args[0]) {
            message.channel.send('There was an error setting the guest-team!\nPlease try again with a valid team-id from MKC.');
            return;
        }
        else if (args[0] == 'help') {
            // ToDo: Handling help differently...
            message.channel.send(base.help.MKCSetGuest);
            return;
        }

        let value = args[0].split('/')[args[0].split('/').length - 1];
        if (/^\d+$/.test(value) == false) {
            message.channel.send('There was an error setting the guest-team!\nPlease try again with a valid team-id from MKC.');
            return;
        }

        search.getTeamById(value)
        .then((APIResult) => {
            if (!APIResult || APIResult == null) {
                message.channel.send('There was an error setting the guest-team!\nPlease try again with a valid team-id from MKC.');
                return;
            }

            Data.ChannelData.UpdateGuest(message.channel.id, value, APIResult, 
                (error) => {
                    Log.logMessage('SQL-ERROR', 'setmkc-guest', error, message.guild, message.channel, message.author);
                    message.channel.send('There was an error setting the guest-team!\nPlease try again.');
                    return;
            })
            .then((updateResult) => {
                if (updateResult === true) {
                    message.channel.send('Guest team successfully set to ' + APIResult.team_name + ' (' + APIResult.team_tag + ')');
                    Log.logMessage('Executed command "setmkc-guest"', 'setmkc-guest', APIResult.team_name, message.guild, message.channel, message.author);
                }
            });
        });
    }
};
