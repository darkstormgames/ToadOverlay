require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const ClientHandler = require('./ClientHandlers/ClientHandler');

const base = require('./Functions/CommandsBase');
const reactions = require('./Functions/MessageReactionHandler');

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

/**
 * Catch Unhandled promise rejection
 */
// process.on('unhandledRejection', error => {
// 	console.error('Unhandled promise rejection:', error);
// });

/**
 * Interaction handling
 */
client.on('interactionCreate', async (interaction) => {
    console.log(`${interaction.user.tag} in '${interaction.channel.name} did something...`);
    
});

/**
 * Reaction handling
 */
client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        }
        catch (error) {
            base.log.logMessage('An error occurred...', 'REACTION', error, null, null, user);
            return;
        }
    }

    if (reaction.message.author.id == process.env.BOT_ID && reaction.emoji.name === '❌' && !reaction.message.guild && user.id != process.env.BOT_ID) {
        reactions.DeletePrivateMessage(reaction, user);
    }
    else if (reaction.message.author.id == process.env.BOT_ID && reaction.message.guild && user.id != process.env.BOT_ID && reaction.message.embeds[0].title.startsWith('**War')) {
        reactions.HandleScheduleReaction(client, reaction, user);
    }
}); 

ClientHandler.Login();
