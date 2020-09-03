/**
 * @desc required modules
 */
const instructions = require('../functions/instructions');
const base = require('../functions/commandsBase');

/**
 * @desc The name and trigger of the command
 */
const name = 'setup-overlay';

/**
 * @desc Alternative trigger(s) for the command
 */
const alt = ['setup'];

/**
 * @desc Defines the type of the command
 * This field is used for validation
 */
const type = base.CommandTypeEnum.General;

/**
 * @desc Short description of the command
 */
const description = 'Initialize your overlay or resend instructions.';

/**
 * @desc execution of the command
 * @param {Discord.Message} message 
 * @param {string[]} args 
 */
function execute(message, args) {
    // Searching for existing entries in the database
    base.query.execute('SELECT * FROM ' + base.query.dbName + '.user_data WHERE guild_id = ' + message.guild.id + ' AND user_id = ' + message.author.id)
    .then((result) => {
        if (result && result.result && result.result.length > 0) {
            base.log.logMessage('Executed command "setup-overlay" with existing entry.', message.author, message.guild);
            message.channel.send(message.author.toString() + ' There already is an overlay for you on this discord-server!\nInstructions will be sent to you again.');
            var text = instructions.get(result.result[0].internal_id, message.author.id, message.guild.id);
            message.author.send({embed: text.linkEmbed});
            message.author.send({embed: text.instructEmbed});
            message.author.send({embed: text.htmlEmbed});
            message.author.send({embed: text.styleEmbed});
            message.author.send({embed: text.imageEmbed});
            message.author.send({embed: text.keepEmbed});
            message.author.send({embed: text.commandsEmbed});
            return;
        }

        // Adding new entry to the database
        base.query.execute('INSERT INTO ' + base.query.dbName + '.user_data (guild_id, user_id, files_path) VALUES (' + message.guild.id + ', ' + message.author.id + ', "' + message.guild.id + '_' + message.author.id + '")')
        .then((wresult) => {
            if (wresult.error != null && wresult.debug_error != null) {
                base.log.logMessage(wresult.debug_error, message.author, message.guild);
                message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
            }
            else {
                // Check, if new entry has been added successfully
                base.query.execute('SELECT * FROM ' + base.query.dbName + '.user_data WHERE guild_id = ' + message.guild.id + ' AND user_id = ' + message.author.id)
                .then((result) => {
                    if (result && result.result && result.result.length > 0) {
                        base.log.logMessage('Executed command "setup-overlay" with new entry.', message.author, message.guild);
                        message.channel.send(message.author.toString() + ' Your overlay for this discord-server has been created successfully.\nFurther instructions should be in your DMs. Be aware of a looooong text...');
                        var text = instructions.get(result.result[0].internal_id, message.author.id, message.guild.id);
                        message.author.send({embed: text.linkEmbed});
                        message.author.send({embed: text.instructEmbed});
                        message.author.send({embed: text.htmlEmbed});
                        message.author.send({embed: text.styleEmbed});
                        message.author.send({embed: text.imageEmbed});
                        message.author.send({embed: text.keepEmbed});
                        message.author.send({embed: text.commandsEmbed});
                    }
                    else {
                        base.log.logMessage('Error creating overlay! New entry not found...', message.author, message.guild);
                        message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
                    }
                });
            }
        });
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