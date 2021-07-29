const base = require('./CommandsBase');
const dbhelper = require('./DBDataHelper');
const scheduling = require('./WarScheduling');

module.exports = {
    DeletePrivateMessage: (reaction, user) => {
        reaction.message.delete({ reason: 'Message deleted by user reaction.' })
        .then(() => {
            base.log.logDM(`Message deleted.`, user);
        })
        .catch((err) => {
            base.log.logDM(err, user);
        });
    },

    HandleScheduleReaction: (client, reaction, user) => {
        client.users.fetch(user.id, {cache: true})
        .then((loadedUser) => {
            dbhelper.checkBaseData(reaction.message.guild, reaction.message.channel, loadedUser);

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
                base.log.logMessage('Failed to remove reactions.', 'REACTIONS', error, reaction.message.guild, reaction.message.channel, loadedUser);
            }
        });
    }
}
