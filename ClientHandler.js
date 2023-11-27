const { existsSync, mkdirSync, readdirSync } = require('fs');
const { ActivityType, Client, Collection, Events, Message, MessageReaction, User } = require('discord.js');
const { Log, LogStatus, LogLevel } = require('./log/Logger');
const { addCan, addCant, addNotSure, addSub, removeEntry } = require('./WarScheduling');

const commands = new Collection();
/**
 * @type {Client}
 */
let client = null;

async function loadCommandFiles() {
  let commandFiles = readdirSync(appRoot + 'commands')
    .filter(file => file.endsWith('.js'));
  for (let file of commandFiles) {
    let filePath = appRoot + 'commands' + dirSplit + `${file}`;
    await Log('MessageHandler.LoadCommandFiles', `[DirectMessage] File ${file} loaded.`, LogStatus.Initialize, LogLevel.Trace);
    let command = require(filePath);
    commands.set(command.name, command);
  }
  await Log('MessageHandler.LoadCommandFiles', 'CommandMessage-files loaded.', LogStatus.Initialize, LogLevel.Debug);
}

/**
 * @param {Message} message 
 */
async function handleCommands(message) {
  if (message.content.startsWith(process.env.PREFIX) && !message.author.bot && message.guild !== null) {
    let args = message.content.slice(process.env.PREFIX.length).split(' ');
    let command = args.shift().toLowerCase();

    commands.forEach(async (value) => {
      if (command == value.name || value.alt.includes(command)) {
        //await Log('MessageHandler.HandleCommands', `Executing "${value.name}"`, LogStatus.Executing, LogLevel.Trace);
        await value.execute(message, args);
      }
    });
  }
}

/**
 * 
 * @param {MessageReaction} reaction 
 * @param {User} user 
 */
async function handleReactions(reaction, user) {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    }
    catch (err) {
      return;
    }
  }
  
  if (!user.bot && user.id != reaction.client.user.id && reaction.message.author.id == reaction.client.user.id) {
    if (reaction.message.guild) { // reaction in guild channel on bot's message from user
      if (reaction.message.embeds && reaction.message.embeds[0] && reaction.message.embeds[0].title.startsWith('**War')) {
        let guildMember = await reaction.message.guild.members.fetch({ user });
        switch (reaction.emoji.name) {
          case '✅':
            addCan(reaction.message, guildMember);
            break;
          case '❌':
            addCant(reaction.message, guildMember);
            break;
          case '❕':
            addSub(reaction.message, guildMember);
            break;
          case '❔':
            addNotSure(reaction.message, guildMember);
            break;
          case '♿':
            removeEntry(reaction.message, guildMember);
            break;
        }
      }
    }
  }
}

module.exports = {
  /**
  * @param {Client} discordClient
  */
  initialize: async (discordClient) => {
    await Log('ClientHandler.Initialize', 'Initialize ClientHandler', LogStatus.Initialize, LogLevel.Debug);
    client = discordClient;

    if (!client) {
      await Log('ClientHandler.Initialize', 'DiscordClient is null!', LogStatus.Error, LogLevel.Fatal, new Error().stack);
      process.exit(3);
    }

    // Create data folders, if necessary
    if (!existsSync(appData)) {
      await Log('ClientHandler.Initialize', 'Create app_data folder', LogStatus.Initialize, LogLevel.Trace);
      mkdirSync(appData);
    }
    if (!existsSync(appLogs)) {
      await Log('ClientHandler.Initialize', 'Create app_data/logs folder', LogStatus.Initialize, LogLevel.Trace);
      mkdirSync(appLogs);
    }
    if (!existsSync(appSchedule)) {
      await Log('ClientHandler.Initialize', 'Create app_data/schedule folder', LogStatus.Initialize, LogLevel.Trace);
      mkdirSync(appSchedule);
    }

    await Log('ClientHandler.Initialize', 'Initialize Commands', LogStatus.Initialize, LogLevel.Trace);
    await loadCommandFiles();
    client.on(Events.MessageCreate, handleCommands);
    
    await Log('ClientHandler.Initialize', 'Initialize Reactions', LogStatus.Initialize, LogLevel.Trace);
    client.on(Events.MessageReactionAdd, handleReactions);

    client.on(Events.ClientReady, () => {
      client.user.setActivity({
        type: ActivityType.Custom,
        name: 'somestatus',
        state: '🛠️ under maintenance... type `_help` for more info.'
      })
    });
  },

  login: () => {
    if (client) {
      client.login(process.env.CLIENT_TOKEN);
    }
  }
}


