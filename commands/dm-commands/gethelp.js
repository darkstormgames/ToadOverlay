/**
 * @description required modules
 */
const base = require('../../functions/commandsBase');
const instructions = require('../../functions/instructions');

module.exports = {
    /**
    * @description The name and trigger of the command
    */
    name: 'help',

    /**
    * @description Alternative trigger(s) for the command
    */
    alt: ['gethelp'],

    /**
    * @description Defines the type of the command
    * This field is used for validation
    */
    type: base.CommandTypeEnum.UserDM,

    /**
    * @description Short description of the command
    */
    description: '',

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string} content 
    */
    execute: (message, content) => {
        base.log.logDM('Help requested...', message.author)
        var text = instructions.gethelp(message.author);
        message.author.send({embed: text.page1});
        message.author.send({embed: text.page2});
    }
};