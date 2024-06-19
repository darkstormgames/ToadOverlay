const { User } = require('../Data/Entities/User');
const { Guild } = require('../Data/Entities/Guild');
const { Channel } = require('../Data/Entities/Channel');

class DataContext {
    /**
     * @param {User} userEntity 
     * @param {Guild} guildEntity 
     * @param {Channel} channelEntity 
     */
    constructor(userEntity, guildEntity, channelEntity) {
        this.user = userEntity;
        this.guild = guildEntity;
        this.channel = channelEntity;
    }

    /**
     * @type {User}
     */
    user;
    /**
     * @type {Guild}
     */
    guild;
    /**
     * @type {Channel}
     */
    channel;
}

module.exports.DataContext = DataContext;