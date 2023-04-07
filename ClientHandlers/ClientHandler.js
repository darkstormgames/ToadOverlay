const { existsSync, mkdirSync } = require('fs');
const { Client, Events } = require('discord.js');
const Data = require('../Data/SQLWrapper');
const MessageHandler = require('./MessageHandler');
const { LogApplication, LogLevel, LogStatus } = require('../Modules/Log/Logger');

let client = null;

module.exports = {
  /**
  * @param {Client} discordClient
  */
  initialize: async (discordClient) => {
    await LogApplication('ClientHandler.Initialize', 'Initialize ClientHandler', LogStatus.Initialize, LogLevel.Debug, '', false);
    client = discordClient;

    if (!client) {
      await LogApplication('ClientHandler.Initialize', 'DiscordClient is null!', LogStatus.Error, LogLevel.Fatal, new Error().stack, false);
      process.exit(3);
    }
  
    // Register client-related events
    await LogApplication('ClientHandler.Initialize', 'Initialize Discord.ClientReady-event', LogStatus.Initialize, LogLevel.Trace);
    client.on(Events.ClientReady, () => {
      LogApplication('ClientHandler.Initialize', 'Client ready.', LogStatus.Initialize, LogLevel.Info);
      client.user.setActivity(`Toad from a safe distance on ${client.guilds.cache.size} servers. | Type "_?" for help on available commands.`, { type: 'WATCHING' });
    });
  
    await LogApplication('ClientHandler.Initialize', 'Initialize Discord.Invalidated-event', LogStatus.Initialize, LogLevel.Trace);
    client.on(Events.Invalidated, () => {
      LogApplication('ClientHandler.Initialize', 'Client invalidated!', LogStatus.None, LogLevel.Warn);
      client.login(process.env.CLIENT_TOKEN);
    });
  
    if (process.env.ENVIRONMENT == 'DEVELOPMENT') {
      await LogApplication('ClientHandler.Initialize', 'Initialize Discord.Debug-event', LogStatus.Initialize, LogLevel.Trace);
      client.on(Events.Debug, (message) => {
        LogApplication('ClientHandler.Initialize', message, LogStatus.Executing, LogLevel.Debug, '', false);
      });
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
    await LogApplication('ClientHandler.Initialize', 'Initialize ChannelData table', LogStatus.Initialize, LogLevel.Trace);
    await Data.ChannelDataSync();     // ChannelData
    await LogApplication('ClientHandler.Initialize', 'Initialize ChannelProfile table', LogStatus.Initialize, LogLevel.Trace);
    await Data.ChannelProfileSync();  // ChannelProfile
    await LogApplication('ClientHandler.Initialize', 'Initialize LogMessage table', LogStatus.Initialize, LogLevel.Trace);
    await Data.MessageSync();         // LogMessage
    // LogApplication('ClientHandler.Initialize', 'Initialize LogCommand table', LogStatus.Initialize, LogLevel.Trace);
    // await Data.CommandSync();         // LogCommand
    // LogApplication('ClientHandler.Initialize', 'Initialize LogDM table', LogStatus.Initialize, LogLevel.Trace);
    // await Data.DMSync();              // LogDM
  
    await LogApplication('ClientHandler.Initialize', 'Initialize global variables', LogStatus.Initialize, LogLevel.Trace);
    dirSplit = (process.platform === "win32" ? '\\' : '/');
    appRoot = process.env.DIR_ENV;
    appData = appRoot + dirSplit + 'app_data' + dirSplit;
    appLogs = appData + 'logs' + dirSplit;
    appSchedule = appData + 'schedule' + dirSplit;
  
    // Create necessary data folders
    if (!existsSync(appData)) {
      await LogApplication('ClientHandler.Initialize', 'Create app_data folder', LogStatus.Initialize, LogLevel.Trace);
      mkdirSync(appData);
    }
    if (!existsSync(appLogs)) {
      await LogApplication('ClientHandler.Initialize', 'Create app_data.logs folder', LogStatus.Initialize, LogLevel.Trace);
      mkdirSync(appLogs);
    }
    if (!existsSync(appSchedule)) {
      await LogApplication('ClientHandler.Initialize', 'Create app_data.schedule folder', LogStatus.Initialize, LogLevel.Trace);
      mkdirSync(appSchedule);
    }
    // initialize other handlers
    await MessageHandler.Initialize(client);

    // client.on(Events.InteractionCreate, async (interaction) => {
    //   if (interaction.isChatInputCommand()) {
        
    //   }
    // });
  },

  login: () => {
    if (client) {
      LogApplication('ClientHandler.Login', 'Starting Login', LogStatus.Initialize, LogLevel.Debug);
      client.login(process.env.CLIENT_TOKEN);
    }
  }
}
