const Discord = require('discord.js');
const Data = require('../Data/SQLWrapper');
const Log = require('../Log/Logger');

module.exports = {
    /**
     * @param {Discord.MessageReaction} reaction
     * @param {Discord.User} user
     */
    RemoveReaction: (reaction, user) => {
        let userReactions = reaction.message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
        try {
            for (let reaction of userReactions.values()) {
                reaction.users.remove(user.id);
            }
        } catch (error) {
            Log.logMessage('Failed to remove reactions.', 'REACTIONS', error, reaction.message.guild, reaction.message.channel, user);
        }
    },
}
