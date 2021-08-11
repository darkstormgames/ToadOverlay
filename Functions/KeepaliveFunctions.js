const base = require('./CommandsBase');
const Discord = require('discord.js');

let count = 0;
let channel = null;

module.exports = {
    startKeepaliveFunctions: (discordClient) => {
        /**
         * Run demo overlay
         */
        setInterval(() => {
            switch(count) {
                case 0:
                    base.db.ChannelData.UpdateScores(0, 0, 0);
                break;
                case 1:
                    base.db.ChannelData.UpdateScores(48, 34, 0);
                break;
                case 2:
                    base.db.ChannelData.UpdateScores(75, 89, 0);
                break;
                case 3:
                    base.db.ChannelData.UpdateScores(123, 123, 0);
                break;
                case 4:
                    base.db.ChannelData.UpdateScores(165, 163, 0);
                break;
                case 5:
                    base.db.ChannelData.UpdateScores(193, 217, 0);
                break;
                case 6:
                    base.db.ChannelData.UpdateScores(236, 256, 0);
                break;
                case 7:
                    base.db.ChannelData.UpdateScores(275, 299, 0);
                break;
                case 8:
                    base.db.ChannelData.UpdateScores(319, 337, 0);
                break;
                case 9:
                    base.db.ChannelData.UpdateScores(371, 367, 0);
                break;
                case 10:
                    base.db.ChannelData.UpdateScores(410, 410, 0);
                break;
                case 11:
                    base.db.ChannelData.UpdateScores(453, 449, 0);
                break;
                case 12:
                    base.db.ChannelData.UpdateScores(493, 491, 0);
                break;
                case 13:
                break;
            }

            count++;
            if (count > 13) {
                count = 0;
            }
    
            if (discordClient && discordClient.user) {
                discordClient.user.setActivity(`Toad from a safe distance on ${discordClient.guilds.cache.size} servers. | Type "_setup" to get started.`, { type: 'WATCHING' });
            }
        }, 2500)

        /**
         * Send a message, to keep the bot connected to the API at all times
         */
        setInterval(() => {
            if (!channel) {
                channel = discordClient.channels.cache.find(channel => channel.id == 750752718267613205);
                if (!channel) {
                    base.log.logMessage('keepalive-channel not found...', 'keepalive')
                }
            }
            else {
                channel.send('keepalive...')
            }
        }, 60000)
    }
}
