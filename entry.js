require('dotenv').config();
const Discord = require('discord.js');
const ClientHandler = require('./ClientHandlers/ClientHandler');

const client = new Discord.Client(
{
    autoReconnect: true,
    intents:
    [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
    ],
    partials: [ 'MESSAGE', 'CHANNEL', 'USER', 'REACTION' ]
});

ClientHandler.Initialize(client);

ClientHandler.Login();
