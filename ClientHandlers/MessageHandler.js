const { Message, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { ClientContext } = require('./ClientContext');
const { isUserCommand, isPrivateMessage, isToadMessage, isKeepaliveMessage } = require('./MessageValidations');
const { CheckBaseData } = require('../Data/SQLWrapper');


const CommandsDirectMessage = new Collection();
const CommandsGuildMessage = new Collection();
const CommandsToadBot = new Collection();

let client = null;

/**
 * Loads all guild commands from the respective folder(s)
 */
function loadCommandFiles() {
  let dmCommandsFiles = readdirSync(process.env.DIR_ENV + process.env.DIR_SPLIT + 'CommandsDirectMessage')
    .filter(file => file.endsWith('.js'));
  for (let file of dmCommandsFiles) {
    let filePath = process.env.DIR_ENV + process.env.DIR_SPLIT + 'CommandsDirectMessage' + process.env.DIR_SPLIT + `${file}`;
    Log.logFileLoaded('DirectMessage', filePath);
    let command = require(filePath);
    CommandsDirectMessage.set(command.name, command);
  }

  let guildCommandsFolders = readdirSync(process.env.DIR_ENV + process.env.DIR_SPLIT + 'CommandsGuildMessage');
  for (let folder of guildCommandsFolders) {
    let commandFiles = readdirSync(process.env.DIR_ENV + process.env.DIR_SPLIT + 'CommandsGuildMessage' + process.env.DIR_SPLIT + `${folder}`)
      .filter(file => file.endsWith('.js'));
    for (let file of commandFiles) {
      let filePath = process.env.DIR_ENV + process.env.DIR_SPLIT + 'CommandsGuildMessage' + process.env.DIR_SPLIT + `${folder}` + process.env.DIR_SPLIT + `${file}`;
      Log.logFileLoaded('GuildMessage', filePath);
      let command = require(filePath);
      CommandsGuildMessage.set(command.name, command);
    }
  }

  let toadCommandsFiles = readdirSync(process.env.DIR_ENV + process.env.DIR_SPLIT + 'CommandsToadBot')
    .filter(file => file.endsWith('.js'));
  for (let file of toadCommandsFiles) {
    let filePath = process.env.DIR_ENV + process.env.DIR_SPLIT + 'CommandsToadBot' + process.env.DIR_SPLIT + `${file}`;
    Log.logFileLoaded('ToadMessage', filePath);
    let command = require(filePath);
    CommandsToadBot.set(command.name, command);
  }
}

/**
 * 
 * @param {Discord.Message} message 
 * @returns 
 */
async function handleCommands(message) {
  if (isUserCommand(message)) {
    let args = message.content.slice(process.env.PREFIX.length).split(' ');
    let command = args.shift().toLowerCase();

    CommandsGuildMessage.forEach(async (value) => {
      if (command == value.name || value.alt.includes(command)) {
        let dataContext = await CheckBaseData(message.guild, message.channel, message.author);
        await Log.logCommand(value.name, 'STARTED', null, message.content, dataContext.guild, dataContext.channel, dataContext.user);
        await value.execute(new ClientContext(message, args, dataContext));
      }
    });
  }
  else if (isPrivateMessage(message)) {
    if (message.content == 'help') {
      Log.logDM('help', 'STARTED', null, message.content, message.author);
      await CommandsDirectMessage.get('help').execute(new ClientContext(message, null, null));
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
        await Log.logDM(value.name, 'STARTED', null, message.content, message.author);
        await value.execute(new ClientContext(message, content, null));
      }
    });
  }
  else if (isToadMessage(message)) {
    CommandsToadBot.forEach(async (value) => {
      if (message.content.startsWith(value.name)) {
        await value.execute(new ClientContext(message, null, await CheckBaseData(message.guild, message.channel, message.author)));
      }
      if (message.embeds && message.embeds.length > 0) {
        message.embeds.forEach(async (embedValue) => {
          if (embedValue.title && embedValue.title.startsWith(value.name)) {
            await value.execute(new ClientContext(message, embedValue, await CheckBaseData(message.guild, message.channel, message.author)));
          }
        });
      }
    });
  }
}

module.exports = {
  Initialize: (discordClient) => {
    client = discordClient;

    if (client == null) {
      Log.logApplication('INIT', 'CLIENT_NULL', 'Client is null.');
      process.exit(1)
    }

    loadCommandFiles();
    client.on('messageCreate', handleCommands);
  }
}