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
                    base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET home_current = 0, guest_current = 0 WHERE id = "ab1c19fb-e4d9-4547-9f75-f627e0b94541";')
                break;
                case 1:
                    base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET home_current = 48, guest_current = 34 WHERE id = "ab1c19fb-e4d9-4547-9f75-f627e0b94541";')
                break;
                case 2:
                    base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET home_current = 75, guest_current = 89 WHERE id = "ab1c19fb-e4d9-4547-9f75-f627e0b94541";')
                break;
                case 3:
                    base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET home_current = 123, guest_current = 123 WHERE id = "ab1c19fb-e4d9-4547-9f75-f627e0b94541";')
                break;
                case 4:
                    base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET home_current = 165, guest_current = 163 WHERE id = "ab1c19fb-e4d9-4547-9f75-f627e0b94541";')
                break;
                case 5:
                    base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET home_current = 193, guest_current = 217 WHERE id = "ab1c19fb-e4d9-4547-9f75-f627e0b94541";')
                break;
                case 6:
                    base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET home_current = 236, guest_current = 256 WHERE id = "ab1c19fb-e4d9-4547-9f75-f627e0b94541";')
                break;
                case 7:
                    base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET home_current = 275, guest_current = 299 WHERE id = "ab1c19fb-e4d9-4547-9f75-f627e0b94541";')
                break;
                case 8:
                    base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET home_current = 319, guest_current = 337 WHERE id = "ab1c19fb-e4d9-4547-9f75-f627e0b94541";')
                break;
                case 9:
                    base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET home_current = 371, guest_current = 367 WHERE id = "ab1c19fb-e4d9-4547-9f75-f627e0b94541";')
                break;
                case 10:
                    base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET home_current = 410, guest_current = 410 WHERE id = "ab1c19fb-e4d9-4547-9f75-f627e0b94541";')
                break;
                case 11:
                    base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET home_current = 453, guest_current = 449 WHERE id = "ab1c19fb-e4d9-4547-9f75-f627e0b94541";')
                break;
                case 12:
                    base.query.execute('UPDATE ' + base.query.dbName + '.channel_data SET home_current = 493, guest_current = 491 WHERE id = "ab1c19fb-e4d9-4547-9f75-f627e0b94541";')
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
