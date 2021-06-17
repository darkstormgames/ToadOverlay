/**
 * @description required modules
 */
const Discord = require('discord.js');

module.exports = {
    isUserCommand: (message) => {
        if ((message.content.startsWith(process.env.PREFIX) 
            || message.mentions.has(new Discord.User(message.client, { id: process.env.BOT_ID }), { ignoreRoles: true, ignoreEveryone: true })) 
            && !message.author.bot 
            && message.guild !== null)
                return true;
        else
            return false;
    },

    isPrivateMessage: (message) => {
        if (!message.content.startsWith(process.env.PREFIX) 
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
        if (message.author.id == process.env.BOT_ID 
            && message.author.bot
            && message.content == 'keepalive...')
                return true;
        else
            return false;
    },

    getCommandArgs: (content) => {
        let baseCmd = '';
        let commands = [];
        baseCmd = content.split(' ').shift().toLowerCase();

        let currentArg = '';
        for(let i = baseCmd.length; i < content.length; i++) {

        }

        return [{
                    command: '', 
                    args: [
                        {
                            arg: '', 
                            isNestedCmd: false
                        }, 
                        {
                            arg: '', 
                            isNestedCmd: true
                        }
                    ]
                }, 
                {
                    command: '', 
                    args: [
                        {
                            arg: '', 
                            isNestedCmd: false
                        }, 
                        {
                            arg: '', 
                            isNestedCmd: true
                        }
                    ]
                }
            ];
    },

    stringIsNumbersOnly: (str) => {
        return /\d+/.test(str);
    }
};