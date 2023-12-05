if (process.env.CLIENT_TOKEN && process.env.CLIENT_TOKEN.startsWith('/')) {
  process.env.CLIENT_TOKEN = require('fs').readFileSync(process.env.CLIENT_TOKEN);
}
else {
  require('dotenv').config();
}

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { initialize, login } = require('./ClientHandler');
const { Log } = require('./log/Logger');

process.on('uncaughtException', async (error, source) => {
  Log(source, error.message, LogStatus.Error, LogLevel.Error, error.stack);
  if (process.env.ENVIRONMENT == 'DEVELOPMENT') throw error;
});

process.on('unhandledRejection', async (event) => {
  Log('UnhandledRejection', event.reason.message, LogStatus.Error, LogLevel.Error, event.reason.stack);
  if (process.env.ENVIRONMENT == 'DEVELOPMENT') process.exit(15);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
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

dirSplit = (process.platform === "win32" ? '\\' : '/');
appRoot = __dirname + dirSplit;
appData = appRoot + 'app_data' + dirSplit;
appLogs = appData + 'logs' + dirSplit;
appSchedule = appData + 'schedule' + dirSplit;

initialize(client).then(() => login());