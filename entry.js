/**
 * required modules
 */
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const fs = require('fs');
const validation = require('./functions/validations');
const base = require('./functions/commandsBase');

/**
 * Initializing Discord client and commands collection
 */
const client = new Discord.Client({ autoReconnect: true, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
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
        var args = message.content.slice(prefix.length).split(' ');
        var command = args.shift().toLowerCase();

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

        var content = message.content.split('[')[1] ? message.content.split('[')[1] : 'err';
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
               (message.embeds[0] && message.embeds[0].title.startsWith(value.name)))) {
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
            base.log.logMessage(error, user);
            return;
        }
    }

    if (reaction.message.author.id == 710403066213433385 && reaction.emoji.name === '❌' && !reaction.message.guild) {
        reaction.message.delete({ reason: 'Message deleted by user reaction.' })
        .then(() => {
            base.log.logMessage(`Message "${reaction.message.content}" deleted from ${user.username}.`);
        })
        .catch((err) => {
            base.log.logMessage(err, user);
        });
    }
});

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
var count = 0;
setInterval(() => {
    switch(count) {
        case 0:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 0, current_guest = 0, last_updated = now() WHERE internal_id = 0;')
        break;
        case 1:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 31, current_guest = 51, last_updated = now() WHERE internal_id = 0;')
        break;
        case 2:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 73, current_guest = 91, last_updated = now() WHERE internal_id = 0;')
        break;
        case 3:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 111, current_guest = 135, last_updated = now() WHERE internal_id = 0;')
        break;
        case 4:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 157, current_guest = 171, last_updated = now() WHERE internal_id = 0;')
        break;
        case 5:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 201, current_guest = 209, last_updated = now() WHERE internal_id = 0;')
        break;
        case 6:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 253, current_guest = 239, last_updated = now() WHERE internal_id = 0;')
        break;
        case 7:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 293, current_guest = 281, last_updated = now() WHERE internal_id = 0;')
        break;
        case 8:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 334, current_guest = 322, last_updated = now() WHERE internal_id = 0;')
        break;
        case 9:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 377, current_guest = 361, last_updated = now() WHERE internal_id = 0;')
        break;
        case 10:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 423, current_guest = 397, last_updated = now() WHERE internal_id = 0;')
        break;
        case 11:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 463, current_guest = 439, last_updated = now() WHERE internal_id = 0;')
        break;
        case 12:
            base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = 500, current_guest = 484, last_updated = now() WHERE internal_id = 0;')
        break;
        case 13:
        break;
    }

    count++;
    if (count > 13) {
        count = 0;
    }
    
    client.user.setActivity(`Toad from a safe distance on ${client.guilds.cache.size} servers.`, { type: 'WATCHING' });
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
 * Send a message, to keep the bot connected to the API
 */
setInterval(() => {
    var channel = client.channels.cache.find(channel => channel.id == 750752718267613205);
    channel.send("keepalive...");
}, 30000)
