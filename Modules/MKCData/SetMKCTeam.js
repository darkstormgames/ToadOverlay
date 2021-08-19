const Discord = require('discord.js');
const Data = require('../../Modules/Data/SQLWrapper');
const Log = require('../../Modules/Log/Logger');
const search = require('../../Modules/MKC/SearchEngine');

module.exports = {
    getActiveTeams: search.getActiveTeams,
    get150ccTeams: search.get150ccTeams,
    get200ccTeams: search.get200ccTeams,
    getMKTourTeams: search.getMKTourTeams,
    getHistoricalTeams: search.getHistoricalTeams,

    SetGuestTeam: (teamId, guild, channel, user) => {
        return new Promise((resolve) => {
            search.getTeamById(teamId)
            .then((APIResult) => {
                if (!APIResult || APIResult == null) {
                    channel.send('There was an error setting the guest-team!\nPlease try again with a valid team-id from MKC.');
                    return;
                }
    
                Data.ChannelData.UpdateGuest(channel.id, teamId, APIResult, 
                    (error) => {
                        Log.logMessage('SQL-ERROR', 'setmkc-guest', error, guild, channel, user);
                        channel.send('There was an error setting the guest-team!\nPlease try again.');
                        return;
                })
                .then((updateResult) => {
                    if (updateResult === true) {
                        channel.send('Guest team successfully set to ' + APIResult.team_name + ' (' + APIResult.team_tag + ')');
                        Log.logMessage('Executed command "setmkc-guest"', 'setmkc-guest', APIResult.team_name, guild, channel, user);
                        resolve();
                    }
                });
            });
        });
    },

    SetHomeTeam: (teamId, guild, channel, user) => {
        return new Promise((resolve) => {
            search.getTeamById(teamId)
            .then((APIResult) => {
                if (!APIResult || APIResult == null) {
                    channel.send('There was an error setting the home-team!\nPlease try again with a valid team-id from MKC.');
                    return;
                }
    
                Data.ChannelData.UpdateHome(channel.id, teamId, APIResult, 
                    (error) => {
                        Log.logMessage('SQL-ERROR', 'setmkc-home', error, guild, channel, user);
                        channel.send('There was an error setting the home-team!\nPlease try again.');
                        return;
                })
                .then((updateResult) => {
                    if (updateResult === true) {
                        channel.send('Home team successfully set to ' + APIResult.team_name + ' (' + APIResult.team_tag + ')');
                        Log.logMessage('Executed command "setmkc-home"', 'setmkc-home', APIResult.team_name, guild, channel, user);
                        resolve();
                    }
                });
            });
        });
    },
}
