const { Message, MessagePayload, MessageCreateOptions } = require('discord.js');
const { DataContext } = require('./DataContext');

///**
// * @typedef {Object} MessageContext
// */
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

    /**
     * 
     * @param {string | MessagePayload | MessageCreateOptions} data 
     */
    reply(data) {
        return this.message.channel.send(data);
    }
}

module.exports.MessageContext = MessageContext;

// module.exports = {
//     /**
//      * @type {MessageContext}
//      */
//     MessageContext: MessageContext
// }