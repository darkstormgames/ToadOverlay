/**
 * @description required modules
 */
const base = require('../functions/commandsBase');
const instructions = require('../functions/instructions');

/**
 * @description The name and trigger of the command
 */
const name = 'help';

/**
 * @description Alternative trigger(s) for the command
 */
const alt = ['gethelp'];

/**
 * @description Defines the type of the command
 * This field is used for validation
 */
const type = base.CommandTypeEnum.UserDM;

/**
 * @description Short description of the command
 */
const description = '';

/**
 * @description execution of the command
 * @param {Discord.Message} message 
 * @param {string} content 
 */
function execute(message, content) {
    var text = instructions.gethelp(message.author);
    message.author.send({embed: text.page1});
    message.author.send({embed: text.page2});
}

// --------------------------------------------------

module.exports = {
    name: name,
    alt: alt,
    type: type,
    description: description,
    execute: execute
};