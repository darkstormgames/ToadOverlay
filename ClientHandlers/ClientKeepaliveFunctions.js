const Discord = require('discord.js');
const Data = require('../Modules/Data/SQLWrapper');
const Log = require('../Modules/Log/Logger');

let count = 0;
let channel = null;

module.exports = {
    /**
     * @param {Discord.Client} discordClient 
     */
    startKeepaliveFunctions: (discordClient) => {
        if (discordClient == null) throw "[CLIENT-KEEPALIVE] Client could not be loaded!";
        /**
         * Run demo overlay
         */
        setInterval(() => {
            switch(count) {
                case 0:
                    Data.ChannelData.UpdateScores(0, 0, 0);
                break;
                case 1:
                    Data.ChannelData.UpdateScores(48, 34, 0);
                break;
                case 2:
                    Data.ChannelData.UpdateScores(75, 89, 0);
                break;
                case 3:
                    Data.ChannelData.UpdateScores(123, 123, 0);
                break;
                case 4:
                    Data.ChannelData.UpdateScores(165, 163, 0);
                break;
                case 5:
                    Data.ChannelData.UpdateScores(193, 217, 0);
                break;
                case 6:
                    Data.ChannelData.UpdateScores(236, 256, 0);
                break;
                case 7:
                    Data.ChannelData.UpdateScores(275, 299, 0);
                break;
                case 8:
                    Data.ChannelData.UpdateScores(319, 337, 0);
                break;
                case 9:
                    Data.ChannelData.UpdateScores(371, 367, 0);
                break;
                case 10:
                    Data.ChannelData.UpdateScores(410, 410, 0);
                break;
                case 11:
                    Data.ChannelData.UpdateScores(453, 449, 0);
                break;
                case 12:
                    Data.ChannelData.UpdateScores(493, 491, 0);
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
                    Log.logMessage('keepalive-channel not found...', 'keepalive')
                }
            }
            else {
                channel.send('keepalive...')
            }
        }, 300000)
    }
}
