const Discord = require('discord.js');
const Instructions = require('../Modules/Help/HelpInstructions');

module.exports = {
    name: 'help',
    alt: ['gethelp'],
    description: 'Gets the help text as defined in HelpInstructions.js',

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string} content 
    */
    execute: (message, content) => {
        var text = Instructions.gethelp(message.author);
        message.author.send({embeds: [text.page1]});
        message.author.send({embeds: [text.page2]});
    }
};
