/**
 * @desc required modules
 */
const base = require('../functions/commandsBase');

/**
 * @desc The name and trigger of the command
 */
const name = 'Total Score after Race';

/**
 * @desc Alternative trigger(s) for the command
 */
const alt = [];

/**
 * @desc Defines the type of the command
 * This field is used for validation
 */
const type = base.CommandTypeEnum.ToadCommand;

/**
 * @desc Short description of the command
 */
const description = '';

/**
 * @desc execution of the command
 * @param {Discord.Message} message 
 * @param {string[]} args 
 */
function execute(message, args) {
    var currentHome = message.embeds[0].fields[0].value;
    var currentGuest = message.embeds[0].fields[1].value;

    base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = ' + currentHome + ', current_guest = ' + currentGuest + ', last_updated = now() WHERE guild_id = ' + message.guild.id + ';')
    .then((result) => {
        if (result.error && result.debug_error) {
            message.channel.send('There was an error updating war data...\nPlease try again later... Or not, because it´s already too late...');
            base.log.logMessage(result.debug_error, message.author, message.guild);
        }
        else {
            base.log.logMessage('Executed command "update-result"', message.author, message.guild);
        }
    });
}

// --------------------------------------------------

module.exports = {
    name: name,
    alt: alt,
    type: type,
    description: description,
    execute: execute
};