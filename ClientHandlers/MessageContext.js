const { Message } = require('discord.js');
const { DataContext } = require('./DataContext');

/**
 * @typedef {Object} MessageContext
 */
class MessageContext {
    /**
     * @param {Message} discordMessage 
     * @param {string[]} arguments 
     * @param {DataContext} dataContext 
     */
    constructor(discordMessage, args, dataContext) {
        this.message = discordMessage;
        this.args = args;
        this.data = dataContext;
    }

    /**
     * @type {Message}
     */
    message;

    /**
     * @type {string[]}
     */
    args;

    /**
     * @type {DataContext}
     */
    data;
}

module.exports = {
    /**
     * @type {MessageContext}
     */
    MessageContext: MessageContext
}