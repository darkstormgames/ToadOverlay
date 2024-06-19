const fs = require('fs');
// load environment variables, depending on if bot is running in docker, or locally
if (process.env.CLIENT_TOKEN && process.env.CLIENT_TOKEN.startsWith('/')) {
  process.env.CLIENT_TOKEN = fs.readFileSync(process.env.CLIENT_TOKEN).toString().trim();
  process.env.SQL_HOST = fs.readFileSync(process.env.SQL_HOST).toString().trim();
  process.env.SQL_USER = fs.readFileSync(process.env.SQL_USER).toString().trim();
  process.env.SQL_PASS = fs.readFileSync(process.env.SQL_PASS).toString().trim();
  process.env.SQL_NAME = fs.readFileSync(process.env.SQL_NAME).toString().trim();
}
else {
  require('dotenv').config();
}

// define directories globally
dirSplit = (process.platform === 'win32' ? '\\' : '/');
appRoot = __dirname + dirSplit;
appData = appRoot + 'app_data' + dirSplit;
appLogs = appData + 'logs' + dirSplit;
appSchedule = appData + 'schedule' + dirSplit;

// create necessary folders to prevent failed logging on database initialization
if (!fs.existsSync(appData)) {
  fs.mkdirSync(appData);
}
if (!fs.existsSync(appLogs)) {
  fs.mkdirSync(appLogs);
}
if (!fs.existsSync(appSchedule)) {
  fs.mkdirSync(appSchedule);
}

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { initialize, login } = require('./ClientHandlers/ClientHandler');
//const { LogApplication, LogLevel, LogStatus } = require('./Log/Logger');

// process.on('uncaughtException', async (error, source) => {
//   LogApplication(source, error.message, LogStatus.Error, LogLevel.Error, error.stack);
//   if (process.env.ENVIRONMENT == 'DEVELOPMENT') process.exit(1);
// });

// process.on('unhandledRejection', async (event) => {
//   LogApplication('UnhandledRejection', event.reason.message, LogStatus.Error, LogLevel.Error, event.reason.stack);
//   if (process.env.ENVIRONMENT == 'DEVELOPMENT') process.exit(15);
// });

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