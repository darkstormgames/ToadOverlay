require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { initialize, login } = require('./ClientHandlers/ClientHandler');

dirSplit = (process.platform === 'win32' ? '\\' : '/');
appRoot = process.env.DIR_ENV;

process.on('uncaughtException', (error, source) => {
  // log error [error, source]
  if (process.env.ENVIRONMENT == 'DEBUG') process.exit(1);
});

process.on('unhandledRejection', (event) => {
  // log error [event]
  if (process.env.ENVIRONMENT == 'DEBUG') process.exit(15);
});

const client = new Client({
  autoreconnect: true,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction
  ]
});

initialize(client).then(() => login());