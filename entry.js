require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const base = require('./Functions/CommandsBase');
const keepalive = require('./Functions/KeepaliveFunctions');
const reactions = require('./Functions/MessageReactionHandler');
const validation = require('./Functions/DataValidations');

/**
 * Initializing Discord client and commands collection
 */
const client = new Discord.Client({ autoReconnect: true, partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'] });
client.commands = new Discord.Collection();

/**
 * Loading commands from file(s)
 */
let commandFolders = fs.readdirSync('./commands');
for (let folder of commandFolders) {
    let commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (let file of commandFiles) {
        let command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

/**
 * Create required folder(s)
 * Change / and \ to your respective OS structure
 */
if (!fs.existsSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp')) {
    fs.mkdirSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp');
}

/**
 * Write to log on successful connection to discord-API
 */
client.once('ready', () => {
    base.log.logMessage('[DISCORD] Ready!', 'LOGIN');
    
    client.user.setActivity(`Toad from a safe distance on ${client.guilds.cache.size} servers. | Type "_setup" to get started.`, { type: 'WATCHING' });
});

/**
 * Catch Unhandled promise rejection
 */
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

/**
 * Message handling
 */
client.on('message', (message) => {
    // Handle user commands
    if (validation.isUserCommand(message)) {
        let args = message.content.slice(process.env.PREFIX.length).split(' ');
        let command = args.shift().toLowerCase();

        client.commands.forEach((value, key, map) => {
            if (value.type == base.CommandTypeEnum.General && 
               (command == value.name || value.alt.includes(command))) {
                value.execute(message, args);
            }
        });
    }
    // Handle private message commands
    else if (validation.isPrivateMessage(message)) {
        if (message.content == 'help') {
            client.commands.get('help').execute(message, null);
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

        client.commands.forEach((value, key, map) => {
            if (value.type == base.CommandTypeEnum.UserDM && 
               (message.content.startsWith(value.name) || value.alt.includes(message.content.split(' ')[0]))) {
                value.execute(message, content);
            }
        });
    }
    // Handle Toad commands
    else if (validation.isToadMessage(message)) {
        client.commands.forEach((value, key, map) => {
            if (value.type == base.CommandTypeEnum.ToadCommand && 
               (message.content.startsWith(value.name) ||
               (message.embeds[0] && message.embeds[0].title && message.embeds[0].title.startsWith(value.name)))) {
                value.execute(message, null);
            }
        });
    }
});

/**
 * Reaction handling
 */
client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        }
        catch (error) {
            base.log.logMessage('An error occurred...', 'REACTION', error, null, null, user);
            return;
        }
    }

    if (reaction.message.author.id == process.env.BOT_ID && reaction.emoji.name === '❌' && !reaction.message.guild && user.id != process.env.BOT_ID) {
        reactions.DeletePrivateMessage(reaction, user);
    }
    else if (reaction.message.author.id == process.env.BOT_ID && reaction.message.guild && user.id != process.env.BOT_ID && reaction.message.embeds[0].title.startsWith('**War')) {
        reactions.HandleScheduleReaction(client, reaction, user);
    }
}); 

/**
 * Reconnect, if discord-API closes the connection
 */
client.on('invalidated', () => {
    base.log.logMessage('[DISCORD] Connection lost. Restarting...', 'LOGIN');
    client.login(process.env.CLIENT_TOKEN);
});

/**
 * Login to discord-API
 */
client.login(process.env.CLIENT_TOKEN);
keepalive.startKeepaliveFunctions(client);
