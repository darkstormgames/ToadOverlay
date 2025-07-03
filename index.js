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
appDb = appData + 'db' + dirSplit;

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
if (!fs.existsSync(appDb)) {
  fs.mkdirSync(appDb);
}

// create NoSQL database directory structure
const nosqlDirs = [
  appDb + 'logs',
  appDb + 'logs' + dirSplit + 'application',
  appDb + 'logs' + dirSplit + 'messages', 
  appDb + 'logs' + dirSplit + 'dm',
  appDb + 'logs' + dirSplit + 'reactions',
  appDb + 'config'
];

nosqlDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// create NoSQL database README file
const readmePath = appDb + 'README.md';
if (!fs.existsSync(readmePath)) {
  const readmeContent = `# NoSQL Database Directory

This directory contains SQLite databases for logging data.

## Structure
- \`logs/application/\` - Application log databases
- \`logs/messages/\` - Discord message log databases  
- \`logs/dm/\` - Direct message log databases
- \`logs/reactions/\` - Reaction log databases
- \`config/\` - Configuration files for logging

## Database Files
Database files are automatically created and rotated monthly.
Format: \`YYYY-MM.db\` (e.g., \`2025-01.db\`)

## Maintenance
- Old databases are automatically cleaned up based on retention policies
- VACUUM and ANALYZE operations are performed during maintenance
- Configuration is stored in \`config/log_config.json\`
`;
  fs.writeFileSync(readmePath, readmeContent);
}

// create NoSQL database configuration file
const configPath = appDb + 'config' + dirSplit + 'log_config.json';
if (!fs.existsSync(configPath)) {
  const configContent = {
    "version": "1.0.0",
    "retention": {
      "application": {
        "retentionDays": 90,
        "rotationMonths": 12,
        "maxFileSize": "50MB"
      },
      "messages": {
        "retentionDays": 30,
        "rotationMonths": 6,
        "maxFileSize": "100MB"
      },
      "dm": {
        "retentionDays": 30,
        "rotationMonths": 6,
        "maxFileSize": "50MB"
      },
      "reactions": {
        "retentionDays": 30,
        "rotationMonths": 6,
        "maxFileSize": "50MB"
      }
    },
    "maintenance": {
      "cleanupIntervalHours": 24,
      "vacuumIntervalDays": 7,
      "compressionEnabled": true,
      "backupEnabled": false
    },
    "performance": {
      "cacheSize": 10000,
      "mmapSize": "256MB",
      "walMode": true,
      "syncMode": "NORMAL",
      "tempStore": "memory"
    }
  };
  fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2));
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