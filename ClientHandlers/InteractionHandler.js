const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const Cache = require('./InteractionCache');
const Data = require('../Modules/Data/SQLWrapper');
const Log = require('../Modules/Log/Logger');

const rest = new REST({ version: '9'}).setToken(process.env.CLIENT_TOKEN);
let InteractionCommands = new Discord.Collection();
let InteractionJSON = [];

let client = null;

function loadInteractionFiles() {
    let interactionFiles = fs.readdirSync(process.env.DIR_ENV + process.env.DIR_SPLIT + 'Interactions')
                                .filter(file => file.endsWith('.js'));
    for (let file of interactionFiles) {
        let filePath = process.env.DIR_ENV + process.env.DIR_SPLIT + 'Interactions' + process.env.DIR_SPLIT + `${file}`;
        let interaction = require(filePath);
        InteractionCommands.set(interaction.data.name, interaction);
        InteractionJSON.push(interaction.data);
        Log.Debug.LogFileLoaded('Interaction', filePath);
    }
}

function registerSlashCommands() {
    try {
        if (process.env.ENVIRONMENT == 'DEBUG') {
            rest.put(
                Routes.applicationGuildCommands(process.env.BOT_ID, process.env.GUILD_ID_DEBUG),
                { body: InteractionJSON },
            );
        } else {
            rest.put(
                Routes.applicationCommands(process.env.BOT_ID),
                { body: InteractionJSON },
            );
        }
    }
    catch (error) {
        console.error(error);
    }
}

function getCachedObject(interaction) {
    for (let cachedObj of global.InteractionCache) {
        if (cachedObj.baseInteraction.guildId == interaction.guildId &&
            cachedObj.baseInteraction.channelId == interaction.channelId &&
            cachedObj.baseInteraction.user.id == interaction.user.id) {
                return cachedObj;
        }
    }
    return null;
}

/**
 * 
 * @param {*} interaction 
 */
async function handleInteraction(interaction) {
    let cachedInteraction = getCachedObject(interaction);
    
    if (interaction.isCommand()) {
        if (cachedInteraction != null) {
            cachedInteraction.baseInteraction.editReply({ content: '❌ Aborted! ❌\n\nPlease finish your other slash commands in this channel, before starting a new one.', embeds: [], components: [] });
            Cache.RemoveById(cachedInteraction.id);
        }
        let command = InteractionCommands.get(interaction.commandName);
        try {
            if (interaction.guild != null) {
                Data.CheckBaseData(interaction.guild, interaction.channel, interaction.user)
                .then(() => {
                    Log.logMessage('Starting interaction "' + interaction.commandName + '"', interaction.commandName, null, interaction.guild, interaction.channel, interaction.user);
                    await command.execute(interaction);
                });
            }
            else {
                Log.logMessage('Starting interaction "' + interaction.commandName + '"', interaction.commandName, null, null, null, interaction.user);
                await command.execute(interaction);
            }
        } catch (error) {
            if (interaction.guild != null) 
                Log.logMessage('Something bad happened...', 'interactions-command', error, interaction.guild, interaction.channel, interaction.user);
            else
                Log.logMessage('Something bad happened...', 'interactions-command', error, null, null, interaction.user);
            cachedInteraction = getCachedObject(interaction);
            if (cachedInteraction != null)
                Cache.RemoveById(cachedInteraction.id);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
    else if (interaction.isButton() || interaction.isSelectMenu()) {
        if (cachedInteraction != null) {
            let command = InteractionCommands.get(cachedInteraction.commandName);
            if (interaction.isButton()) {
                try {
                    await command.updateByBtn(interaction, cachedInteraction, interaction.customId);
                }
                catch (error) {
                    if (interaction.guild != null) 
                        Log.logMessage('Something bad happened...', 'interactions-button', error, interaction.guild, interaction.channel, interaction.user);
                    else
                        Log.logMessage('Something bad happened...', 'interactions-button', error, null, null, interaction.user);
                    cachedInteraction = getCachedObject(interaction);
                    if (cachedInteraction != null)
                        Cache.RemoveById(cachedInteraction.id);
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
            else if (interaction.isSelectMenu()) {
                try {
                    await command.updateBySelect(interaction, cachedInteraction, interaction.customId);
                }
                catch (error) {
                    if (interaction.guild != null) 
                        Log.logMessage('Something bad happened...', 'interactions-select', error, interaction.guild, interaction.channel, interaction.user);
                    else
                        Log.logMessage('Something bad happened...', 'interactions-select', error, null, null, interaction.user);
                    cachedInteraction = getCachedObject(interaction);
                    if (cachedInteraction != null)
                        Cache.RemoveById(cachedInteraction.id);
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }    
        }
    }
}

module.exports = {
    Initialize: (discordClient) => {
        client = discordClient;

        if (client == null) throw "[INTERACTIONS] Client could not be loaded!";
        global.InteractionCache = [];
        loadInteractionFiles();
        registerSlashCommands();
        client.on('interactionCreate', handleInteraction);
    }
}
