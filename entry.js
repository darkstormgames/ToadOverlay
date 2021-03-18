/**
 * required modules
 */
const Discord = require('discord.js');
const { prefix, token, bot_id, foldersplit, workingdirectory } = require('./config.json');
const fs = require('fs');
const validation = require('./functions/validations');
const base = require('./functions/commandsBase');
const scheduling = require('./functions/scheduling');
const { connected } = require('process');

/**
 * Initializing Discord client and commands collection
 */
const client = new Discord.Client({ autoReconnect: true, partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'] });
client.commands = new Discord.Collection();

/**
 * Loading commands from file(s)
 */
var commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (var file of commandFiles) {
	var command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

/**
 * Create required folder(s)
 * Change / and \ to your respective OS structure
 */
if (!fs.existsSync(workingdirectory + foldersplit + 'scheduleTemp')) {
    fs.mkdirSync(workingdirectory + foldersplit + 'scheduleTemp');
}

/**
 * Write to log on successful connection to discord-API
 */
client.once('ready', () => {
    base.log.logMessage('[DISCORD] Ready!');
    
    client.user.setActivity(`Toad from a safe distance on ${client.guilds.cache.size} servers.`, { type: 'WATCHING' });
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
        let args = message.content.slice(prefix.length).split(' ');
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
let isWorkingOnFile = false;
client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        }
        catch (error) {
            base.log.logMessage(error, user);
            return;
        }
    }

    if (reaction.message.author.id == bot_id && reaction.emoji.name === '❌' && !reaction.message.guild && user.id != bot_id) {
        reaction.message.delete({ reason: 'Message deleted by user reaction.' })
        .then(() => {
            base.log.logDM(`Message deleted.`, user);
        })
        .catch((err) => {
            base.log.logDM(err, user);
        });
    }
    else if (reaction.message.author.id == bot_id && reaction.message.guild && user.id != bot_id && reaction.message.embeds[0].title.startsWith('**War')) {
        let loadedUser = await client.users.fetch(user.id, {cache: true});

        while (isWorkingOnFile === true) {
            await sleep(250);
        }
        
        isWorkingOnFile = true;
        switch(reaction.emoji.name)
        {
            case '✅':
                scheduling.addCan(reaction.message, loadedUser);
                break;
            case '❌':
                scheduling.addCant(reaction.message, loadedUser);
                break;
            case '❕':
                scheduling.addSub(reaction.message, loadedUser);
                break;
            case '❔':
                scheduling.addNotSure(reaction.message, loadedUser);
                break;
            case '♿':
                scheduling.removeEntry(reaction.message, loadedUser);
                break;
        }
        isWorkingOnFile = false;

        let userReactions = reaction.message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id))
        try {
            for (let reaction of userReactions.values()) {
                await reaction.users.remove(user.id);
            }
        } catch (error) {
            console.error('Failed to remove reactions.');
        }
    }
});

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}  

/**
 * Reconnect, if discord-API closes the connection
 */
client.on('invalidated', () => {
    base.log.logMessage('[DISCORD] Connection lost. Restarting...');
    client.login(token);
});

/**
 * Login to discord-API
 */
client.login(token);

/**
 * Run demo overlay
 */
let count = 0;
setInterval(() => {
    switch(count) {
        case 0:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 0, current_guest = 0, last_updated = now() WHERE internal_id = 0;')
        break;
        case 1:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 48, current_guest = 34, last_updated = now() WHERE internal_id = 0;')
        break;
        case 2:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 75, current_guest = 89, last_updated = now() WHERE internal_id = 0;')
        break;
        case 3:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 123, current_guest = 123, last_updated = now() WHERE internal_id = 0;')
        break;
        case 4:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 165, current_guest = 163, last_updated = now() WHERE internal_id = 0;')
        break;
        case 5:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 193, current_guest = 217, last_updated = now() WHERE internal_id = 0;')
        break;
        case 6:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 236, current_guest = 256, last_updated = now() WHERE internal_id = 0;')
        break;
        case 7:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 275, current_guest = 299, last_updated = now() WHERE internal_id = 0;')
        break;
        case 8:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 319, current_guest = 337, last_updated = now() WHERE internal_id = 0;')
        break;
        case 9:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 371, current_guest = 367, last_updated = now() WHERE internal_id = 0;')
        break;
        case 10:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 410, current_guest = 410, last_updated = now() WHERE internal_id = 0;')
        break;
        case 11:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 453, current_guest = 449, last_updated = now() WHERE internal_id = 0;')
        break;
        case 12:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 493, current_guest = 491, last_updated = now() WHERE internal_id = 0;')
        break;
        case 13:
        break;
    }

    count++;
    if (count > 13) {
        count = 0;
    }
    
    if (client && client.user) {
        client.user.setActivity(`Toad from a safe distance on ${client.guilds.cache.size} servers.`, { type: 'WATCHING' });
    }
}, 2500)

/**
 * Keep the connection to mysql-db alive
 */
setInterval(() => {
    if (base.query.connection.state === 'disconnected') {
        base.query.connection.connect((err) => {
            if (err) {
                base.log.logMessage(err);
                return;
            }
        });
    }

    base.query.execute('SELECT 1');
}, 5000)

/**
 * Send a message, to keep the bot connected to the API at all times
 */
let channel = null;
setInterval(() => {
    channel = client.channels.cache.find(channel => channel.id == 750752718267613205);
    if(channel) {
        channel.send('keepalive...');
    }
    else {
        console.log('keepalive-channel not found...')
    }
}, 30000)
