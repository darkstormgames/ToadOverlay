/**
* @desc required modules
*/
const { User } = require('discord.js');
const base = require('../../functions/commandsBase');
const dbhelper = require('../../functions/db-helper');

module.exports = {
    /**
    * @desc The name and trigger of the command
    */
    name: 'friendcode',
 
    /**
    * @desc Alternative trigger(s) for the command
    */
    alt: ['fc'],
 
    /**
    * @desc Defines the type of the command
    * This field is used for validation
    */
    type: base.CommandTypeEnum.General,
 
    /**
    * @desc Short description of the command
    */
    description: '',
     
    /**
    * @desc execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        base.log.logMessage('Executing command "template"', message.author, message.guild, message.channel);
        dbhelper.checkBaseData(message.guild, message.channel, message.author)
        .then(() => {
            if (args.length == 0) {
                base.query.execute('SELECT * FROM ' + base.query.dbName + '.user WHERE id = ' + message.author.id)
                .then((result) => {
                    if (result.error != null && result.debug_error != null) {
                        message.channel.send('Failed to get friendcode!');
                        return;
                    }
                    else {
                        message.channel.send('Switch-FC for ' + message.author.username + ': ' + result.result[0].fc_switch);
                    }
                });
            }
            else if (args.length == 1) {
                if (/^(?:SW-)?[0-9]{4}-?[0-9]{4}-?[0-9]{4}/m.test(args[0])) {
                    base.query.execute('UPDATE ' + base.query.dbName + '.user SET fc_switch = "' + args[0] + '" WHERE id = ' + message.author.id)
                    .then ((result) => {
                        if (result.error != null && result.debug_error != null) {
                            message.channel.send('Failed to set friendcode!');
                            return;
                        }
                        else {
                            message.channel.send('Friendcode set for ' + message.author.username + '.');
                        }
                    });
                }
                else if (/^<@!\d+>$/m.test(args[0])) {
                    message.guild.members.fetch(args[0].replace(/^<@!/m, '').replace(/>$/m, ''))
                    .then((guildmember) => {
                        dbhelper.checkBaseData(message.guild, message.channel, guildmember.user)
                        .then(() => {
                            base.query.execute('SELECT * FROM ' + base.query.dbName + '.user WHERE id = ' + guildmember.id)
                            .then((result) => {
                                if (result.error != null && result.debug_error != null) {
                                    message.channel.send('Failed to get friendcode!');
                                    return;
                                }
                                else {
                                    message.channel.send('FC for ' + guildmember.user.username + ': ' + result.result[0].fc_switch);
                                }
                            });
                        });
                    });
                }
                else {
    
                }
            }
            else if (args.length == 2) {
                let fc = '', userId = 0;
                for (let i = 0; i < 2; i++) {
                    if (/^<@!\d+>$/m.test(args[i])) {
                        userId = args[i].replace(/^<@!/m, '').replace(/>$/m, '');
                    }
                    else if (/^(?:SW-)?[0-9]{4}-?[0-9]{4}-?[0-9]{4}/m.test(args[i])) {
                        fc = args[i];
                    }
                }
    
                if (fc === '' || userId === 0) {
                    message.channel.send('Couldn\'t read parameters!');
                    return;
                }
    
                message.guild.members.fetch(userId)
                .then((guildmember) => {
                    dbhelper.checkBaseData(message.guild, message.channel, guildmember.user)
                    .then(() => {
                        base.query.execute('UPDATE ' + base.query.dbName + '.user SET fc_switch = "' + fc + '" WHERE id = ' + guildmember.id)
                        .then ((result) => {
                            if (result.error != null && result.debug_error != null) {
                                message.channel.send('Failed to set friendcode!');
                                return;
                            }
                            else {
                                message.channel.send('Friendcode set for ' + guildmember.user.username + '.');
                            }
                        });
                    });
                });
            }
        });
    }
};