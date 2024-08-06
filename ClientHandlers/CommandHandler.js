const { CommandContext } = require('./CommandContext');
const { BaseInteraction, CommandInteraction, Collection, Events } = require('discord.js');
const { readdirSync } = require('fs');
const { CheckBaseData } = require('../Data/SQLWrapper');
const { LogApplication, LogMessage, LogDM, LogLevel, LogStatus } = require('../Log/Logger');

const CommandsDirectMessage = new Collection();
const CommandsGuild = new Collection();

async function loadCommandFiles() {
  
}

/**
 * @param {BaseInteraction} baseInteraction 
 */
async function handleCommands(baseInteraction) {
  if (baseInteraction.isCommand()) {
    /**
     * @type {CommandInteraction}
     */
    let interaction = baseInteraction;
    
  }
}




module.exports = {
  Initialize: async (discordClient) => {
    await LogApplication('CommandHandler.Initialize', 'Initialize CommandHandler', LogStatus.Initialize, LogLevel.Trace);

    if (discordClient == null) {
      await LogApplication('CommandHandler.Initialize', 'DiscordClient is null!', LogStatus.Error, LogLevel.Fatal, new Error().stack, false);
      process.exit(1)
    }

    await loadCommandFiles();
    discordClient.on(Events.InteractionCreate, handleCommands);
  }
}