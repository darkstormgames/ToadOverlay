const base = require('./commandsBase');
const dbhelper = require('./db-helper');

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

    HandleScheduleReaction: (reaction, user) => {
        let loadedUser = await client.users.fetch(user.id, {cache: true});
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

        let userReactions = reaction.message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id))
        try {
            for (let reaction of userReactions.values()) {
                await reaction.users.remove(user.id);
            }
        } catch (error) {
            console.error('Failed to remove reactions.');
        }
    }
}
