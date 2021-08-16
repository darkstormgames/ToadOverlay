const Discord = require('discord.js');
const Data = require('../Modules/Data/SQLWrapper');
const Log = require('../Modules/Log/Logger');
const scheduling = require('./WarScheduling');

module.exports = {
    DeletePrivateMessage: (reaction, user) => {
        reaction.message.delete({ reason: 'Message deleted by user reaction.' })
        .then(() => {
            Log.logDM(`Message deleted.`, user);
        })
        .catch((err) => {
            Log.logDM(err, user);
        });
    },

    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.MessageReaction} reaction 
     * @param {Discord.User} user 
     */
    HandleScheduleReaction: (client, reaction, user) => {
        client.users.fetch(user.id, {cache: true})
        .then((loadedUser) => {
            Data.CheckBaseData(reaction.message.guild, reaction.message.channel, loadedUser);

            switch(reaction.emoji.name)
            {
                case '✅':
                    scheduling.addCan(reaction.message, loadedUser);
                    break;
                case '❌':
                    scheduling.addCant(reaction.message, loadedUser);
                    break;
                case '❕':
                    scheduling.addSub(reaction.message, loadedUser);
                    break;
                case '❔':
                    scheduling.addNotSure(reaction.message, loadedUser);
                    break;
                case '♿':
                    scheduling.removeEntry(reaction.message, loadedUser);
                    break;
            }
    
            let userReactions = reaction.message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
            try {
                for (let reaction of userReactions.values()) {
                    reaction.users.remove(user.id);
                }
            } catch (error) {
                console.log('Failed to remove reactions.');
                console.error(error);
                Log.logMessage('Failed to remove reactions.', 'REACTIONS', error, reaction.message.guild, reaction.message.channel, loadedUser);
            }
        });
    }
}
