/**
 * @description required modules
 */
const { prefix, bot_id } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
    isUserCommand: (message) => {
        if ((message.content.startsWith(prefix) 
            || message.mentions.has(new Discord.User(message.client, { id: bot_id }), { ignoreRoles: true, ignoreEveryone: true })) 
            && !message.author.bot 
            && message.guild !== null)
                return true;
        else
            return false;
    },

    isPrivateMessage: (message) => {
        if (!message.content.startsWith(prefix) 
            && !message.author.bot 
            && message.guild === null)
                return true;
        else
            return false;
    },

    isToadMessage: (message) => {
        if (message.author.id == 177162177432649728 
            && message.author.bot)
                return true;
        else
            return false;
    },

    isKeepaliveMessage: (message) => {
        if (message.author.id == bot_id 
            && message.author.bot
            && message.content == 'keepalive...')
                return true;
        else
            return false;
    },

    stringIsNumbersOnly: (str) => {
        return !isNaN(str);

        // let numRegEx = '/^[0-9]+$/';
        // if (str.match(numRegEx)) {
        //     return true;
        // }
        // else {
        //     return false;
        // }
    }
};