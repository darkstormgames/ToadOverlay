const { Message, Collection, Events } = require('discord.js');
const { readdirSync } = require('fs');
const { MessageContext } = require('./MessageContext');
const { isUserCommand, isPrivateMessage, isToadMessage, isKeepaliveMessage } = require('./MessageValidations');
const { CheckBaseData } = require('../Data/SQLWrapper');
const { LogApplication, LogMessage, LogDM, LogLevel, LogStatus } = require('../Log/Logger');

const CommandsDirectMessage = new Collection();
const CommandsGuildMessage = new Collection();
const CommandsToadBot = new Collection();

/**
 * Loads all guild commands from the respective folder(s)
 */
async function loadCommandFiles() {
  await LogApplication('MessageHandler.LoadCommandFiles', 'Load CommandMessage files', LogStatus.Initialize, LogLevel.Debug);

  let dmCommandsFiles = readdirSync(appRoot + dirSplit + 'CommandsMessage' + dirSplit + 'DirectMessage')
    .filter(file => file.endsWith('.js'));
  for (let file of dmCommandsFiles) {
    let filePath = appRoot + dirSplit + 'CommandsMessage' + dirSplit + 'DirectMessage' + dirSplit + `${file}`;
    await LogApplication('MessageHandler.LoadCommandFiles', `[DirectMessage] File ${file} loaded.`, LogStatus.Initialize, LogLevel.Trace);
    let command = require(filePath);
    CommandsDirectMessage.set(command.name, command);
  }

  let guildCommandsFolders = readdirSync(appRoot + dirSplit + 'CommandsMessage' + dirSplit + 'GuildMessage');
  for (let folder of guildCommandsFolders) {
    let commandFiles = readdirSync(appRoot + dirSplit + 'CommandsMessage' + dirSplit + 'GuildMessage' + dirSplit + `${folder}`)
      .filter(file => file.endsWith('.js'));
    for (let file of commandFiles) {
      let filePath = appRoot + dirSplit + 'CommandsMessage' + dirSplit + 'GuildMessage' + dirSplit + `${folder}` + dirSplit + `${file}`;
      await LogApplication('MessageHandler.LoadCommandFiles', `[GuildMessage] File ${file} loaded.`, LogStatus.Initialize, LogLevel.Trace);
      let command = require(filePath);
      CommandsGuildMessage.set(command.name, command);
    }
  }

  let toadCommandsFiles = readdirSync(appRoot + dirSplit + 'CommandsMessage' + dirSplit + 'ScoreBot')
    .filter(file => file.endsWith('.js'));
  for (let file of toadCommandsFiles) {
    let filePath = appRoot + dirSplit + 'CommandsMessage' + dirSplit + 'ScoreBot' + dirSplit + `${file}`;
    await LogApplication('MessageHandler.LoadCommandFiles', `[ScoreBot] File ${file} loaded.`, LogStatus.Initialize, LogLevel.Trace);
    let command = require(filePath);
    CommandsToadBot.set(command.name, command);
  }
  await LogApplication('MessageHandler.LoadCommandFiles', 'CommandMessage-files loaded.', LogStatus.Initialize, LogLevel.Debug);
}

/**
 * 
 * @param {Message} message 
 */
async function handleCommands(message) {
  await LogApplication('MessageHandler.HandleCommands', 'Handling command', LogStatus.Executing, LogLevel.Trace);
  if (isUserCommand(message)) {
    let args = message.content.slice(process.env.PREFIX.length).split(' ');
    let command = args.shift().toLowerCase();

    CommandsGuildMessage.forEach(async (value) => {
      if (command == value.name || value.alt.includes(command)) {
        let messageContext = new MessageContext(message, args, await CheckBaseData(message.guild, message.channel, message.author));
        await LogMessage(value.name, `Executing ${value.name}`, messageContext, LogStatus.Executing, LogLevel.Debug);
        await value.execute(messageContext);
      }
    });
  }
  else if (isPrivateMessage(message)) { // ToDo: Migrate to new Logger
    if (message.content == 'help') {
      await LogDM('MessageHandler.HandleCommands', 'Print Help', message.content, message.author, LogStatus.Executing, LogLevel.Debug);
      await CommandsDirectMessage.get('help').execute(new MessageContext(message, null, null));
      return;
    }

    let content = message.content.split('[')[1] ? message.content.split('[')[1] : 'err';
    if (content == 'err') {
      message.author.send('The command you entered has the wrong format!\nMake sure, your data is included in square brackets => "command [Your input here...]"');
      return;
    }
    content = content.split(']')[0];
    content = content.split('\r').join('');
    content = content.split('\n').join('');

    CommandsDirectMessage.forEach(async (value) => {
      if (message.content.startsWith(value.name) || value.alt.includes(message.content.split(' ')[0])) {
        await LogDM(`MessageHandler.HandleCommands', '[DM] Executing ${value.name}`, message.content, message.author, LogStatus.Executing, LogLevel.Debug);
        await value.execute(new MessageContext(message, content, null));
      }
    });
  }
  else if (isToadMessage(message)) {
    CommandsToadBot.forEach(async (value) => {
      if (message.content.startsWith(value.name) || message.content.startsWith(value.alt[0])) {
        let messageContext = new MessageContext(message, null, await CheckBaseData(message.guild, message.channel, message.author));
        await LogMessage(value.name, `[Scores] Executing ${value.name}`, messageContext, LogStatus.Executing, LogLevel.Debug);
        await value.execute(messageContext);
      }
      if (message.embeds && message.embeds.length > 0) {
        message.embeds.forEach(async (embedValue) => {
          if (embedValue.title && embedValue.title.startsWith(value.name)) {
            let messageContext = new MessageContext(message, null, await CheckBaseData(message.guild, message.channel, message.author));
            await LogMessage(value.name, `[Scores] Executing ${value.name}`, messageContext, LogStatus.Executing, LogLevel.Debug);
            await value.execute(messageContext);
          }
        });
      }
    });
  }
}

module.exports = {
  Initialize: async (discordClient) => {
    await LogApplication('ClientHandler.Initialize', 'Initialize MessageHandler', LogStatus.Initialize, LogLevel.Trace);

    if (discordClient == null) {
      await LogApplication('ClientHandler.Initialize', 'DiscordClient is null!', LogStatus.Error, LogLevel.Fatal, new Error().stack, false);
      process.exit(1)
    }

    await loadCommandFiles();
    discordClient.on(Events.MessageCreate, handleCommands);
  }
}