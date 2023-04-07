require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { initialize, login } = require('./ClientHandlers/ClientHandler');
const { LogApplication, LogLevel, LogStatus } = require('./Modules/Log/Logger');

dirSplit = (process.platform === 'win32' ? '\\' : '/');
appRoot = process.env.DIR_ENV;

process.on('uncaughtException', async (error, source) => {
  LogApplication(source, error.message, LogStatus.Error, LogLevel.Error, error.stack);
  if (process.env.ENVIRONMENT == 'DEVELOPMENT') process.exit(1);
});

process.on('unhandledRejection', async (event) => {
  LogApplication('UnhandledRejection', event.reason.message, LogStatus.Error, LogLevel.Error, event.reason.stack);
  if (process.env.ENVIRONMENT == 'DEVELOPMENT') process.exit(15);
});

const client = new Client({
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