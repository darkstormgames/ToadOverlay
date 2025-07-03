const { existsSync, mkdirSync } = require('fs');
const { Client, Events, ActivityType } = require('discord.js');
const Data = require('../Data/SQLWrapper');
const EventHandler = require('./ClientEventHandler');
const MessageHandler = require('./MessageHandler');
const ReactionHandler = require('./ReactionHandler');
const { LogApplication, LogLevel, LogStatus } = require('../Log/Logger');
const LogNoSQL = require('../Log/LogNoSQL');

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
  
    // Initialize NoSQL logging system
    await LogApplication('ClientHandler.Initialize', 'Initialize NoSQL logging system', LogStatus.Initialize, LogLevel.Debug, '', false);
    try {
      await LogNoSQL.Initialize();
      await LogApplication('ClientHandler.Initialize', 'NoSQL logging system initialized successfully', LogStatus.Executed, LogLevel.Info);
    } catch (error) {
      await LogApplication('ClientHandler.Initialize', 'Failed to initialize NoSQL logging system', LogStatus.Error, LogLevel.Error, error.stack, false);
      console.error('NoSQL initialization failed, falling back to file-only logging:', error);
    }

    // Sync MySQL DB-tables for core data (excluding log tables) - order matters...
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
    
    // Note: Log tables (LogMessage, LogDM, LogReaction, LogApplication) now use NoSQL instead of MySQL

    // Initialize EventHandler for Discord Client Events
    await EventHandler.initialize(client);

    // Initialize MessageHandler for legacy message handling
    await MessageHandler.Initialize(client);

    // Initialize ReactionHandler
    await ReactionHandler.Initialize(client);

    // Initialize CommandHandler

    // Keepalive, to prevent random discord timeouts...
    setInterval(() => {
      let channel = client.channels.cache.find(channel => channel.id == 750752718267613205n);
      if (!channel) {
        LogApplication('ClientHandler.Keepalive', 'Keepalive channel not found!', LogStatus.Error, LogLevel.Error);
      }
      else {
        channel.send('keepalive...');
      }

      if (client.user) {
        client.user.setActivity({
          type: ActivityType.Watching,
          name: `Toad on ${discordClient.guilds.cache.size} servers.`,
          //state: `Type "_?" for help on available commands.`
          state: 'Type "_status" for information on the current state of the bot.'
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
