const { Team, Teams } = require('mkcentral-api');
const { MessageContext } = require('../ClientHandlers/MessageContext');
const { LogMessage, LogStatus, LogLevel } = require('../Log/Logger');
const { Channel, invalidateChannelCache } = require('../Data/SQLWrapper');


module.exports = {
  getActiveTeams: Teams.Get(new Teams.Filter({ IsActive: true })),
  get150ccTeams: Teams.Get(new Teams.Filter({ Mode: Teams.GameMode.CC150 })),
  get200ccTeams: Teams.Get(new Teams.Filter({ Mode: Teams.GameMode.CC200 })),
  getMKTourTeams: Teams.Get(new Teams.Filter({ Game: Teams.Game.MKT })),
  getHistoricalTeams: Teams.Get(new Teams.Filter({ IsHistorical: true })),

  /**
   * 
   * @param {number} teamId 
   * @param {MessageContext} context 
   * @returns {Promise<void>}
   */
  SetGuestTeam: async (teamId, context) => {
    let team = await Team.Get(teamId);
    if (!team) {
      context.reply('There was an error setting the guest-team!\nPlease try again with a valid team-id from MKC.');
      return;
    }

    context.data.channel.guest_mkc_url = `https://www.mariokartcentral.com/mkc/registry/teams/${team.Id}`;
    context.data.channel.guest_name = team.Name;
    context.data.channel.guest_tag = team.Tag;
    context.data.channel.guest_img = team.Logo;
    try {
      await context.data.channel.save();
      await invalidateChannelCache(context.data.channel.id);
      context.reply('Guest team successfully set to ' + team.Name + ' (' + team.Tag + ')');
      LogMessage('SetMKC.Guest', `Set guest team ${team.Name}`, context, LogStatus.Executed, LogLevel.Info);
    }
    catch (error) {
      context.reply('There was an error setting the guest-team!\nPlease try again.');
      LogMessage('SetMKC.Guest', error, context, LogStatus.Failed, LogLevel.Error);
    }
  },

  /**
     * 
     * @param {number} teamId 
     * @param {MessageContext} context 
     * @returns {Promise<void>}
     */
  SetHomeTeam: async (teamId, context) => {
    let team = await Team.Get(teamId);
    if (!team) {
      context.reply('There was an error setting the home-team!\nPlease try again with a valid team-id from MKC.');
      return;
    }

    context.data.channel.home_mkc_url = `https://www.mariokartcentral.com/mkc/registry/teams/${team.Id}`;
    context.data.channel.home_name = team.Name;
    context.data.channel.home_tag = team.Tag;
    context.data.channel.home_img = team.Logo;
    try {
      await context.data.channel.save();
      await invalidateChannelCache(context.data.channel.id);
      context.reply('Home team successfully set to ' + team.Name + ' (' + team.Tag + ')');
      LogMessage('SetMKC.Home', `Set home team ${team.Name}`, context, LogStatus.Executed, LogLevel.Info);
    }
    catch (error) {
      context.reply('There was an error setting the home-team!\nPlease try again.');
      LogMessage('SetMKC.Home', error, context, LogStatus.Failed, LogLevel.Error);
    }
  },
}