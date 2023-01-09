const Discord = require('discord.js');
const Data = require('../Modules/Data/SQLWrapper');
const Helper = require('../Modules/Reactions/ReactionHelper');
const DirectMessage = require('../Modules/Reactions/DMReactions');
const Schedule = require('../Modules/Reactions/ScheduleReactions');
const Log = require('../Modules/Log/Logger');

let client = null;

function initializeReactions() {
    if (client == null) throw "[REACTIONS] Client could not be loaded!";
    client.on('messageReactionAdd', handleReactions);
}

/**
 * @param {Discord.MessageReaction|Discord.PartialMessageReaction} reaction 
 * @param {Discord.User|Discord.PartialUser} user 
 */
async function handleReactions(reaction, user) {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        }
        catch (error) {
            Log.logMessage('An error occurred...', 'REACTION-FETCH', error, null, null, user);
            return;
        }
    }

    if (!user.bot && user.id != process.env.BOT_ID && reaction.message.author.id == process.env.BOT_ID) {
        if (!reaction.message.guild) { // reaction in DMs on bot's message from user
            DirectMessage.HandleReaction(reaction, user);
        }
        else if (reaction.message.guild) { // reaction in guild channel on bot's message from user
            if (reaction.message.embeds && reaction.message.embeds[0] && reaction.message.embeds[0].title.startsWith('**War')) {
                client.users.fetch(user.id, {cache: true})
                .then((loadedUser) => {
                    Data.CheckBaseData(reaction.message.guild, reaction.message.channel, loadedUser);
                    Schedule.HandleReaction(reaction, loadedUser);
                    Helper.RemoveReaction(reaction, loadedUser)
                });
            }
            else {} // Other reaction functions in guild channels
        }
    }
}

module.exports = {
    Initialize: (discordClient) => {
        client = discordClient;
        initializeReactions();
    }
}
