const { existsSync, mkdirSync } = require('fs');
const { Client, Events, ActivityType } = require('discord.js');
const Data = require('../Data/SQLWrapper');
const EventHandler = require('./ClientEventHandler');
const MessageHandler = require('./MessageHandler');
const ReactionHandler = require('./ReactionHandler');
const { LogApplication, LogLevel, LogStatus } = require('../Log/Logger');

let client = null;

module.exports = {
  /**
  * @param {Client} discordClient
  */
  initialize: async (discordClient) => {
    await LogApplication('ClientHandler.Initialize', 'Initialize ClientHandler', LogStatus.Initialize, LogLevel.Debug, '', false);
    console.log('initializing...');
    client = discordClient;

    if (!client) {
      await LogApplication('ClientHandler.Initialize', 'DiscordClient is null!', LogStatus.Error, LogLevel.Fatal, new Error().stack, false);
      process.exit(3);
    }
  
    // Sync DB-tables - order matters...
    await LogApplication('ClientHandler.Initialize', 'Initialize LogApplication table', LogStatus.Initialize, LogLevel.Trace);
    await Data.AppSync();             // LogApplication
    await LogApplication('ClientHandler.Initialize', 'Initialize User table', LogStatus.Initialize, LogLevel.Trace);
    await Data.UserSync();            // User
    await LogApplication('ClientHandler.Initialize', 'Initialize Guild table', LogStatus.Initialize, LogLevel.Trace);
    await Data.GuildSync();           // Guild
    await LogApplication('ClientHandler.Initialize', 'Initialize Channel table', LogStatus.Initialize, LogLevel.Trace);
    await Data.ChannelSync();         // Channel
    await LogApplication('ClientHandler.Initialize', 'Initialize UserChannel table', LogStatus.Initialize, LogLevel.Trace);
    await Data.UserChannelSync();     // UserChannel
    await LogApplication('ClientHandler.Initialize', 'Initialize GuildUser table', LogStatus.Initialize, LogLevel.Trace);
    await Data.GuildUserSync();       // GuildUser
    await LogApplication('ClientHandler.Initialize', 'Initialize Profile table', LogStatus.Initialize, LogLevel.Trace);
    await Data.ProfileSync();         // Profile
    // await LogApplication('ClientHandler.Initialize', 'Initialize ChannelData table', LogStatus.Initialize, LogLevel.Trace);
    // await Data.ChannelDataSync();     // ChannelData
    await LogApplication('ClientHandler.Initialize', 'Initialize ChannelProfile table', LogStatus.Initialize, LogLevel.Trace);
    await Data.ChannelProfileSync();  // ChannelProfile
    await LogApplication('ClientHandler.Initialize', 'Initialize LogMessage table', LogStatus.Initialize, LogLevel.Trace);
    await Data.MessageSync();         // LogMessage
    // LogApplication('ClientHandler.Initialize', 'Initialize LogCommand table', LogStatus.Initialize, LogLevel.Trace);
    // await Data.CommandSync();         // LogCommand
    LogApplication('ClientHandler.Initialize', 'Initialize LogDM table', LogStatus.Initialize, LogLevel.Trace);
    await Data.DMSync();              // LogDM
  
    // Create necessary data folders
    if (!existsSync(appData)) {
      await LogApplication('ClientHandler.Initialize', 'Create app_data folder', LogStatus.Initialize, LogLevel.Trace);
      mkdirSync(appData);
    }
    if (!existsSync(appLogs)) {
      await LogApplication('ClientHandler.Initialize', 'Create app_data/logs folder', LogStatus.Initialize, LogLevel.Trace);
      mkdirSync(appLogs);
    }
    if (!existsSync(appSchedule)) {
      await LogApplication('ClientHandler.Initialize', 'Create app_data/schedule folder', LogStatus.Initialize, LogLevel.Trace);
      mkdirSync(appSchedule);
    }

    // Initialize EventHandler for Discord Client Events
    await EventHandler.initialize(client);

    // Initialize MessageHandler for legacy message handling
    await MessageHandler.Initialize(client);

    // Initialize ReactionHandler
    await ReactionHandler.Initialize(client);

    // Initialize CommandHandler

    // Keepalive, to prevent random discord timeouts...
    let channel = client.channels.cache.find(channel => channel.id == 750752718267613205n);
    setInterval(() => {
      if (!channel) {
        LogApplication('ClientHandler.Keepalive', 'Keepalive channel not found!', LogStatus.Error, LogLevel.Error);
      }
      else {
        channel.send('keepalive...');
      }

      if (client.user) {
        client.user.setActivity({
          type: ActivityType.Watching,
          name: 'liveStatus',
          state: `Toad from a safe distance on ${discordClient.guilds.cache.size} servers. | Type "_?" for help on available commands.`
        });
      }
    }, 300000);

  },

  login: () => {
    if (client) {
      LogApplication('ClientHandler.Login', 'Trying to log in.', LogStatus.Initialize, LogLevel.Debug);
      client.login(process.env.CLIENT_TOKEN);
    }
  }
}
