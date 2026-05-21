const fs = require('fs');
const { startHealthKeepalive, startHealthServer } = require('./ClientHandlers/HealthHandler');

// define directories globally
dirSplit = (process.platform === 'win32' ? '\\' : '/');
appRoot = __dirname + dirSplit;
appData = appRoot + 'app_data' + dirSplit;
appLogs = appData + 'logs' + dirSplit;
appSchedule = appData + 'schedule' + dirSplit;
appDb = appData + 'db' + dirSplit;

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// create necessary folders as early as possible, so Plesk startup failures are visible
ensureDir(appData);
ensureDir(appLogs);
ensureDir(appSchedule);
ensureDir(appDb);

const startupLogPath = appLogs + 'startup.log';
const startupLog = (message, error = null) => {
  const details = error ? `\n${error.stack || error.message || error}` : '';
  const content = `[${new Date().toISOString()}] ${message}${details}\n`;
  try {
    fs.appendFileSync(startupLogPath, content);
  } catch (writeError) {
    console.error('Unable to write startup log:', writeError);
  }
  if (error) {
    console.error(message, error);
  } else {
    console.log(message);
  }
};

let client = null;
let startupError = null;
let botStatus = 'starting';
const startTime = Date.now();

process.on('uncaughtException', (error) => {
  startupError = 'Uncaught exception during startup';
  botStatus = 'error';
  startupLog(startupError, error);
});

process.on('unhandledRejection', (reason) => {
  startupError = 'Unhandled rejection during startup';
  botStatus = 'error';
  startupLog(startupError, reason);
});

// Simple health endpoint for monitoring and uptime checks.
// process.env.PORT is set by Phusion Passenger when running under Plesk.
const healthPort = process.env.PORT || process.env.HEALTH_PORT || 13001;
startHealthServer({
  appDb,
  getBotStatus: () => botStatus,
  getClient: () => client,
  getStartupError: () => startupError,
  healthPort,
  setBotStatus: (status) => {
    botStatus = status;
  },
  setStartupError: (error) => {
    startupError = error;
  },
  startTime,
  startupLog
});

// load environment variables:
// - Always load app-root .env first. dotenv does not override existing env vars by default.
// - Docker: CLIENT_TOKEN is a file path (starts with '/') → read from Docker secrets
// - Plesk/hosting: CLIENT_TOKEN can be set directly as an environment variable
try {
  const envPath = appRoot + '.env';
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
  }

  if (process.env.CLIENT_TOKEN && process.env.CLIENT_TOKEN.startsWith('/')) {
    process.env.CLIENT_TOKEN = fs.readFileSync(process.env.CLIENT_TOKEN).toString().trim();
    process.env.SQL_HOST = fs.readFileSync(process.env.SQL_HOST).toString().trim();
    process.env.SQL_USER = fs.readFileSync(process.env.SQL_USER).toString().trim();
    process.env.SQL_PASS = fs.readFileSync(process.env.SQL_PASS).toString().trim();
    process.env.SQL_NAME = fs.readFileSync(process.env.SQL_NAME).toString().trim();
  }
} catch (error) {
  startupError = 'Failed to load environment variables';
  botStatus = 'error';
  startupLog(startupError, error);
}

// Validate required environment variables are present
const requiredEnvVars = ['CLIENT_TOKEN', 'SQL_HOST', 'SQL_USER', 'SQL_PASS', 'SQL_NAME'];
const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);
if (missingEnvVars.length > 0) {
  startupError = `Missing required environment variables: ${missingEnvVars.join(', ')}`;
  botStatus = 'error';
  startupLog(startupError);
}

if (!process.env.LOGLEVEL) {
  process.env.LOGLEVEL = 'DEBUG';
  startupLog('LOGLEVEL not set, defaulting to DEBUG');
}

startHealthKeepalive({ healthPort, startupLog });

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
  ensureDir(dir);
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

//const { LogApplication, LogLevel, LogStatus } = require('./Log/Logger');

// process.on('uncaughtException', async (error, source) => {
//   LogApplication(source, error.message, LogStatus.Error, LogLevel.Error, error.stack);
//   if (process.env.ENVIRONMENT == 'DEVELOPMENT') process.exit(1);
// });

// process.on('unhandledRejection', async (event) => {
//   LogApplication('UnhandledRejection', event.reason.message, LogStatus.Error, LogLevel.Error, event.reason.stack);
//   if (process.env.ENVIRONMENT == 'DEVELOPMENT') process.exit(15);
// });

async function startBot() {
  if (startupError) {
    return;
  }

  try {
    const { Client, GatewayIntentBits, Partials } = require('discord.js');
    const { initialize, login } = require('./ClientHandlers/ClientHandler');

    client = new Client({
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

    await initialize(client);
    login();
    botStatus = 'login_requested';
    startupLog('Discord bot login requested');
  } catch (error) {
    startupError = 'Discord bot startup failed';
    botStatus = 'error';
    startupLog(startupError, error);
  }
}

startBot();
