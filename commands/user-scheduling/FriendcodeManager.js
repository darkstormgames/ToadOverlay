/**
* @desc required modules
*/
const Discord = require('discord.js');
const base = require('../../Functions/CommandsBase');

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
        base.log.logMessage('Executing command "friendcode"', 'friendcode', message.content, message.guild, message.channel, message.author);
        base.db.CheckBaseData(message.guild, message.channel, message.author)
        .then(() => {
            if (args.length == 0) {
                base.db.User.Get(message.author.id, (error) => {
                    message.channel.send('Failed to get friendcode!');
                    base.log.logMessage('Failed to get friendcode from user!', 'friendcode', error, message.guild, message.channel, message.author);
                    return;
                })
                .then((result) => {
                    if (!(typeof result == 'boolean') && result[0]) {
                        message.channel.send((result.result[0].fc_switch.startsWith('SW-') ? '' : 'SW-') + result.result[0].fc_switch);
                    }
                });
            }
            else if (args.length == 1) {
                if (args[0] == 'help') {
                    message.channel.send(base.help.Friendcode);
                }
                else if (/^(?:SW-)?[0-9]{4}-?[0-9]{4}-?[0-9]{4}/m.test(args[0])) {
                    base.db.User.UpdateFriendcode(message.author, args[0])
                    .then ((result) => {
                        if (result === false) {
                            message.channel.send('Failed to set friendcode!');
                            base.log.logMessage('Failed to set friendcode!', 'friendcode SW', error, message.guild, message.channel, message.author);
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
                        base.db.CheckBaseData(message.guild, message.channel, guildmember.user)
                        .then(() => {
                            base.db.User.Get(guildmember.id, (error) => {
                                message.channel.send('Failed to get friendcode!');
                                base.log.logMessage('Failed to get friendcode!', 'friendcode user', error, message.guild, message.channel, message.author);
                                return;
                            })
                            .then((result) => {
                                if (!(typeof result == 'boolean') && result[0]) {
                                    message.channel.send('Friendcode for ' + result.result[0].name + ': ' + (result.result[0].fc_switch.startsWith('SW-') ? '' : 'SW-') + result.result[0].fc_switch);
                                }
                            });
                        });
                    });
                }
                else if (args[0] == 'all'){
                    base.db.ExecuteQuery('SELECT * FROM ' + process.env.SQL_NAME + '.user WHERE fc_switch IS NOT NULL AND id IN (SELECT user_id FROM ' + process.env.SQL_NAME + '.guild_user WHERE guild_id = ' + message.guild.id + ') ORDER BY name', 
                        (error) => {
                            if (error != null) {
                                message.channel.send('Failed to get friendcodes!');
                                base.log.logMessage('Failed to get friendcodes!', 'friendcode all', error, message.guild, message.channel, message.author);
                                return;
                            }
                        }, true)
                    .then((result) => {
                        if (typeof result == 'boolean' && result === false) {
                            message.channel.send('Failed to get friendcodes!');
                            base.log.logMessage('Failed to get friendcodes!', 'friendcode all', error, message.guild, message.channel, message.author);
                            return;
                        }
                        else if (!(typeof result == 'boolean') && result[0]) {
                            let retVal = '**All friendcodes on ' + message.guild.name + ':**\n```css\n';
                            for (let item in result.result) {
                                retVal += (result.result[item].fc_switch.startsWith('SW-') ? '' : 'SW-') + result.result[item].fc_switch + ' (' + result.result[item].name + ')\n'
                            }
                            retVal += '```';
                            message.channel.send(retVal);
                        }
                    });
                }
                else {
                    base.db.ExecuteQuery('SELECT * FROM ' + process.env.SQL_NAME + '.user WHERE fc_switch IS NOT NULL AND (name LIKE "%' + base.db.sql.connection.escape(args[0]) + '%" OR (id IN (SELECT user_id FROM ' + process.env.SQL_NAME + '.guild_user WHERE guild_id = ' + message.guild.id + ' AND displayname LIKE "%' + base.db.sql.connection.escape(args[0]) + '%"))) ORDER BY name', 
                        (error) => {
                            if (error != null) {
                                message.channel.send('Failed to get friendcodes!');
                                base.log.logMessage('Failed to get friendcodes!', 'friendcode like', error, message.guild, message.channel, message.author);
                                return;
                            }
                        }, true)
                    .then((result) => {
                        if (typeof result == 'boolean' && result === false) {
                            message.channel.send('No FC found for ' + args[0]);
                        }
                        else if (!(typeof result == 'boolean') && result.length == 1) {
                            message.channel.send((result.result[0].fc_switch.startsWith('SW-') ? '' : 'SW-') + result.result[0].fc_switch);
                        }
                        else {
                            let retVal = '**All friendcodes for ' + args[0] + ':**\n```css\n';
                            for (let item in result.result) {
                                retVal += (result.result[item].fc_switch.startsWith('SW-') ? '' : 'SW-') + result.result[item].fc_switch + ' (' + result.result[item].name + ')\n';
                            }
                            retVal += '```';
                            message.channel.send(retVal);
                        }
                    });
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
                    base.db.CheckBaseData(message.guild, message.channel, guildmember.user)
                    .then(() => {
                        base.db.User.UpdateFriendcode(guildmember, fc)
                        .then ((result) => {
                            if (result === false) {
                                message.channel.send('Failed to set friendcode!');
                                base.log.logMessage('Failed to set friendcode!', 'friendcode SW user', error, message.guild, message.channel, message.author);
                                return;
                            }
                            else {
                                message.channel.send('Friendcode set for ' + message.author.username + '.');
                            }
                        });
                    });
                });
            }
        });
    }
};
