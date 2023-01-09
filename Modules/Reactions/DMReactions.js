const Discord = require('discord.js');
const Data = require('../Data/SQLWrapper');
const Log = require('../Log/Logger');

/**
 * @param {Discord.MessageReaction} reaction 
 * @param {Discord.User} user 
 */
function DeletePrivateMessage(reaction, user) {
    reaction.message.delete({ reason: 'Message deleted by user reaction.' })
    .then(() => {
        Log.logDM(`Message deleted.`, user);
    })
    .catch((err) => {
        Log.logDM(err, user);
    });
}


module.exports = {
    /**
     * @param {Discord.MessageReaction} reaction 
     * @param {Discord.User} user 
     */
    HandleReaction: (reaction, user) => {
        if (reaction.emoji.name === '❌') {
            DeletePrivateMessage(reaction, user);
        }

    }
}
