const { gethelp } = require('../../Help/HelpInstructions');

module.exports = {
    name: 'help',
    alt: ['gethelp'],
    description: 'Gets the help text as defined in HelpInstructions.js',

    /**
    * @description execution of the command
    * @param {ClientContext} context
    */
    execute: (context) => {
        var text = gethelp(context.message.author);
        context.message.author.send({embeds: [text.page1]});
        context.message.author.send({embeds: [text.page2]});
    }
};