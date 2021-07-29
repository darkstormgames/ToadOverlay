/**
 * @description required modules
 */
const Discord = require('discord.js');

module.exports = {
    /**
     * Checks, if the given message is a command executed as a user
     * @param {*} message
     */
    isUserCommand: (message) => {
        if ((message.content.startsWith(process.env.PREFIX) 
            || message.mentions.has(new Discord.User(message.client, { id: process.env.BOT_ID }), { ignoreRoles: true, ignoreEveryone: true })) 
            && !message.author.bot 
            && message.guild !== null)
                return true;
        else
            return false;
    },

    /**
     * Checks, if the given message is a command executed as a user in private messages
     * @param {*} message
     */
    isPrivateMessage: (message) => {
        if (!message.content.startsWith(process.env.PREFIX) 
            && !message.author.bot 
            && message.guild === null)
                return true;
        else
            return false;
    },

    /**
     * Checks, if the given message is a command executed as the Toad bot
     * @param {*} message
     */
    isToadMessage: (message) => {
        if (message.author.id == 177162177432649728 
            && message.author.bot)
                return true;
        else
            return false;
    },

    /**
     * Checks, if the given message is a keepalive message
     * @param {*} message
     */
    isKeepaliveMessage: (message) => {
        if (message.author.id == process.env.BOT_ID 
            && message.author.bot
            && message.content == 'keepalive...')
                return true;
        else
            return false;
    },

    /**
     * ToDo: Some shit with better argument parsing...
     * @param {string} content 
     * @returns 
     */
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

    /**
     * Checks, if the given string consists of only digits
     * @param {string} str 
     * @returns {boolean}
     */
    stringIsNumbersOnly: (str) => {
        return /\d+/.test(str);
    }
};
