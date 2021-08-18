const Discord = require('discord.js');
const fs = require('fs');
const Validation = require('./MessageValidations');
const Data = require('../Modules/Data/SQLWrapper');
const Log = require('../Modules/Log/Logger');

let CommandsDirectMessage = new Discord.Collection();
let CommandsGuildMessage = new Discord.Collection();
let CommandsToadBot = new Discord.Collection();

let client = null;

/**
 * Loads all guild commands from the respective folder(s)
 */
function loadCommandFiles() {
    let dmCommandsFiles = fs.readdirSync(process.env.DIR_ENV + process.env.DIR_SPLIT + 'CommandsDirectMessage')
                              .filter(file => file.endsWith('.js'));
    for (let file of dmCommandsFiles) {
        let filePath = process.env.DIR_ENV + process.env.DIR_SPLIT + 'CommandsDirectMessage' + process.env.DIR_SPLIT + `${file}`;
        Log.Debug.LogFileLoaded('DirectMessage', filePath);
        let command = require(filePath);
        CommandsDirectMessage.set(command.name, command);
    }

    let guildCommandsFolders = fs.readdirSync(process.env.DIR_ENV + process.env.DIR_SPLIT + 'CommandsGuildMessage');
    for (let folder of guildCommandsFolders) {
        let commandFiles = fs.readdirSync(process.env.DIR_ENV + process.env.DIR_SPLIT + 'CommandsGuildMessage' + process.env.DIR_SPLIT + `${folder}`)
                               .filter(file => file.endsWith('.js'));
        for (let file of commandFiles) {
            let filePath = process.env.DIR_ENV + process.env.DIR_SPLIT + 'CommandsGuildMessage' + process.env.DIR_SPLIT + `${folder}` + process.env.DIR_SPLIT + `${file}`;
            Log.Debug.LogFileLoaded('GuildMessage', filePath);
            let command = require(filePath);
            CommandsGuildMessage.set(command.name, command);
        }
    }

    let toadCommandsFiles = fs.readdirSync(process.env.DIR_ENV + process.env.DIR_SPLIT + 'CommandsToadBot')
                                .filter(file => file.endsWith('.js'));
    for (let file of toadCommandsFiles) {
        let filePath = process.env.DIR_ENV + process.env.DIR_SPLIT + 'CommandsToadBot' + process.env.DIR_SPLIT + `${file}`;
        Log.Debug.LogFileLoaded('ToadMessage', filePath);
        let command = require(filePath);
        CommandsToadBot.set(command.name, command);
    }
}

function initializeCommands() {
    if (client == null) throw "[COMMANDS] Client could not be loaded!";

    loadCommandFiles();

    client.on('messageCreate', handleCommands);
}

async function handleCommands(message) {
    if (Validation.isUserCommand(message)) {
        let args = message.content.slice(process.env.PREFIX.length).split(' ');
        let command = args.shift().toLowerCase();
    
        CommandsGuildMessage.forEach((value) => {
            if (command == value.name || value.alt.includes(command)) {
                Data.CheckBaseData(message.guild, message.channel, message.author)
                .then(() => {
                    Log.logMessage('Executing command "' + value.name + '"', value.name, message.content, message.guild, message.channel, message.author);
                    value.execute(message, args);
                });
            }
        });
    }
    else if (Validation.isPrivateMessage(message)) {
        if (message.content == 'help') {
            Log.logDM('Requesting DM-help...', 'HELP', null, message.author);
            CommandsDirectMessage.get('help').execute(message, null);
            return;
        }
    
        let content = message.content.split('[')[1] ? message.content.split('[')[1] : 'err';
        if (content == 'err') {
            message.author.send('The command you entered has the wrong format!\nMake sure, your data is included in square brackets => "command [Your input here...]"');
            return;
        }
        content = content.split(']')[0];
        content = content.split('\n').join('');
        content = content.split('\r').join('');
    
        CommandsDirectMessage.forEach((value) => {
            if (message.content.startsWith(value.name) || value.alt.includes(message.content.split(' ')[0])) {
                Log.logDM('Executing command "' + value.name + '"', value.name, message.content, message.author)
                value.execute(message, content);
            }
        });
    }
    else if (Validation.isToadMessage(message)) {
        CommandsToadBot.forEach((value) => {
            if (message.content.startsWith(value.name) ||
               (message.embeds[0] && message.embeds[0].title && message.embeds[0].title.startsWith(value.name))) {
                Data.CheckBaseData(message.guild, message.channel, message.author);
                value.execute(message, null);
            }
        });
    }
}

module.exports = {
    Initialize: (discordClient) => {
        client = discordClient;
        initializeCommands();
    }
}
