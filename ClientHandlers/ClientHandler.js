const Discord = require('discord.js');
const fs = require('fs');
const Log = require('../Modules/Log/Logger');
const keepalive = require('./ClientKeepaliveFunctions');

const InteractionHandler = require('./InteractionHandler');
const MessageHandler = require('./MessageHandler');
const ReactionHandler = require('./ReactionHandler');

let client = null;

module.exports = {
    Interactions: InteractionHandler,
    Messages: MessageHandler,
    Reactions: ReactionHandler,

    /**
     * 
     * @param {Discord.Client} discordClient 
     */
    Initialize: (discordClient) => {
        client = discordClient;

        // Create necessary folder(s)
        if (!fs.existsSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp')) {
            fs.mkdirSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp');
        }

        // Write to log on successful connection to discord-API
        client.once('ready', () => {
            Log.logMessage('[DISCORD] Ready!', 'LOGIN');
            
            client.user.setActivity(`Toad from a safe distance on ${client.guilds.cache.size} servers. | Type "_setup" to get started.`, { type: 'WATCHING' });
        });

        // Reconnect, if discord-API closes the connection
        client.on('invalidated', () => {
            Log.logMessage('[DISCORD] Connection lost. Restarting...', 'LOGIN');
            client.login(process.env.CLIENT_TOKEN);
        });

        process.on('unhandledRejection', error => {
            Log.logMessage('Something went wrong...\n' + error, 'UNHANDLED', error);
            if (process.env.ENVIRONMENT == 'DEBUG') throw error;
        });

        MessageHandler.Initialize(discordClient);
        ReactionHandler.Initialize(discordClient);
        InteractionHandler.Initialize(discordClient);
    },

    Login: () => {
        if (client != null) {
            client.login(process.env.CLIENT_TOKEN);
            keepalive.startKeepaliveFunctions(client);
        }
    },
}
