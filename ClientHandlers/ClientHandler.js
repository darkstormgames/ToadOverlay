const { existsSync, mkdirSync } = require('fs');
const { Client, Events } = require('discord.js');
const Data = require('../Data/SQLWrapper');
const MessageHandler = require('./MessageHandler');

let client = null;

module.exports = {
  /**
  * @param {Client} discordClient
  */
  initialize: async (discordClient) => {
    client = discordClient;

    if (!client) {
      // log fatal 'client null'
      process.exit(3);
    }
  
    // Register client-related events
    client.on(Events.ClientReady, () => {
      // log info 'bot started'
      client.user.setActivity(`Toad from a safe distance on ${client.guilds.cache.size} servers. | Type "_?" for help on available commands.`, { type: 'WATCHING' });
    });
  
    client.on(Events.Invalidated, () => {
      // log warn 'connection closed'
      client.login(process.env.CLIENT_TOKEN);
    });
  
    if (process.env.ENVIRONMENT == 'DEBUG') {
      client.on(Events.Debug, (message) => {
        // log debug [message]
      });
    }
  
    // Sync DB-tables
    await Data.AppSync();             // LogApplication
    await Data.UserSync();            // User
    await Data.GuildSync();           // Guild
    await Data.ChannelSync();         // Channel
    await Data.UserChannelSync();     // UserChannel
    await Data.GuildUserSync();       // GuildUser
    await Data.ProfileSync();         // Profile
    await Data.ChannelDataSync();     // ChannelData
    await Data.ChannelProfileSync();  // ChannelProfile
    await Data.CommandSync();         // LogCommand
    await Data.DMSync();              // LogDM
  
    dirSplit = (process.platform === "win32" ? '\\' : '/');
    appRoot = process.env.DIR_ENV;
    appData = appRoot + dirSplit + 'app_data' + dirSplit;
    appLogs = appData + 'logs' + dirSplit;
    appSchedule = appData + 'schedule' + dirSplit;
  
    // Create necessary data folders
    if (!existsSync(appData)) {
      mkdirSync(appData);
    }
    if (!existsSync(appLogs)) {
      mkdirSync(appLogs);
    }
    if (!existsSync(appSchedule)) {
      mkdirSync(appSchedule);
    }
  
    // initialize other handlers
    MessageHandler.Initialize(client);

    // client.on(Events.InteractionCreate, async (interaction) => {
    //   if (interaction.isChatInputCommand()) {
        
    //   }
    // });
  },

  login: () => {
    if (client) {
      client.login(process.env.CLIENT_TOKEN);
    }
  }
}
