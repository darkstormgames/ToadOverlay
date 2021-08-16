const Discord = require('discord.js');
const Data = require('../../Modules/Data/SQLWrapper');
const Log = require('../../Modules/Log/Logger');

 module.exports = {
     name: 'admin-getoverlays',
     alt: [],
     description: 'Delete your overlay from the server this command was executed from.',
 
     /**
     * @description execution of the command
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
     execute: (message, args) => {
        if (message.author.id != process.env.ADMIN_ID) {
            let rng = Math.floor(Math.random() * 6);
            switch (rng) {
                case 0:
                    message.channel.send('https://tenor.com/view/youre-not-my-dad-kid-gif-8300190');
                    break;
                case 1:
                    message.channel.send('https://tenor.com/view/mst3k-gif-8327808');
                    break;
                case 2:
                    message.channel.send('https://tenor.com/view/youre-not-my-dad-keith-trolls-the-beat-goes-on-you-cant-tell-me-what-to-do-gif-18076704');
                    break;
                case 3:
                    message.channel.send('https://tenor.com/view/youre-not-the-boss-of-me-beca-anna-kendrick-pitch-perfect-dont-tell-me-what-to-do-gif-17475593');
                    break;
                case 4:
                    message.channel.send('https://tenor.com/view/dont-tell-me-what-to-do-gif-4951202');
                    break;
                case 5:
                    message.channel.send('https://tenor.com/view/youre-not-my-supervisor-youre-not-my-boss-gif-12971403');
                    break;
            } 
            return;
        }
        Log.logMessage('Trying to execute admin command "getoverlays"', 'admin-getoverlays', message.content, message.guild, message.channel, message.author);
        
     }
 }
