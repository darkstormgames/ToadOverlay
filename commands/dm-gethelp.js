/**
 * @desc required modules
 */
const base = require('../functions/commandsBase');
const instructions = require('../functions/instructions');

/**
 * @desc The name and trigger of the command
 */
const name = 'help';

/**
 * @desc Alternative trigger(s) for the command
 */
const alt = ['gethelp'];

/**
 * @desc Defines the type of the command
 * This field is used for validation
 */
const type = base.CommandTypeEnum.UserDM;

/**
 * @desc Short description of the command
 */
const description = '';

/**
 * @desc execution of the command
 * @param {Discord.Message} message 
 * @param {string[]} args 
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