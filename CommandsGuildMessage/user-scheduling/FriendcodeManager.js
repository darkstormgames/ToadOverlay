const Discord = require('discord.js');
const Data = require('../../Modules/Data/SQLWrapper');
const Log = require('../../Modules/Log/Logger');
const Help = require('../../Modules/Help/HelpTexts');

module.exports = {
    name: 'friendcode',
    alt: ['fc'],
    description: '',
     
    /**
    * @desc execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        Data.CheckBaseData(message.guild, message.channel, message.author)
        .then(() => {
            if (args.length == 0) {
                Data.User.Get(message.author.id, (error) => {
                    message.channel.send('Failed to get friendcode!');
                    Log.logMessage('Failed to get friendcode from user!', 'friendcode', error, message.guild, message.channel, message.author);
                    return;
                })
                .then((result) => {
                    if (!(typeof result == 'boolean') && result[0] && result[0].fc_switch) {
                        message.channel.send((result[0].fc_switch.startsWith('SW-') ? '' : 'SW-') + result[0].fc_switch);
                    }
                    else {
                        message.channel.send('There is no saved friendcode for your account.\nYou can add one by using the command `_fc SW-FR13-NDC0-D309`')
                    }
                });
            }
            else if (args.length == 1) {
                if (args[0] == 'help') {
                    // ToDo: Handling help texts differently...
                    message.channel.send(Help.Friendcode);
                }
                else if (/^(?:SW-)?[0-9]{4}-?[0-9]{4}-?[0-9]{4}/m.test(args[0])) {
                    Data.User.UpdateFriendcode(message.author, args[0])
                    .then ((result) => {
                        if (result === false) {
                            message.channel.send('Failed to set friendcode!');
                            Log.logMessage('Failed to set friendcode!', 'friendcode SW', error, message.guild, message.channel, message.author);
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
                        Data.CheckBaseData(message.guild, message.channel, guildmember.user)
                        .then(() => {
                            Data.User.Get(guildmember.id, (error) => {
                                message.channel.send('Failed to get friendcode!');
                                Log.logMessage('Failed to get friendcode!', 'friendcode user', error, message.guild, message.channel, message.author);
                                return;
                            })
                            .then((result) => {
                                if (!(typeof result == 'boolean') && result[0]) {
                                    message.channel.send('Friendcode for ' + result[0].name + ': ' + (result[0].fc_switch.startsWith('SW-') ? '' : 'SW-') + result[0].fc_switch);
                                }
                            });
                        });
                    });
                }
                else if (args[0] == 'all'){
                    // ToDo: Move query to User entity
                    Data.ExecuteQuery('SELECT * FROM ' + process.env.SQL_NAME + '.user WHERE fc_switch IS NOT NULL AND id IN (SELECT user_id FROM ' + process.env.SQL_NAME + '.guild_user WHERE guild_id = ' + message.guild.id + ') ORDER BY name', 
                        (error) => {
                            if (error != null) {
                                message.channel.send('Failed to get friendcodes!');
                                Log.logMessage('Failed to get friendcodes!', 'friendcode all', error, message.guild, message.channel, message.author);
                                return;
                            }
                        }, true)
                    .then((result) => {
                        if (typeof result == 'boolean' && result === false) {
                            message.channel.send('Failed to get friendcodes!');
                            Log.logMessage('Failed to get friendcodes!', 'friendcode all', error, message.guild, message.channel, message.author);
                            return;
                        }
                        else if (!(typeof result == 'boolean') && result[0]) {
                            let retVal = '**All friendcodes on ' + message.guild.name + ':**\n```css\n';
                            for (let item in result) {
                                retVal += (result[item].fc_switch.startsWith('SW-') ? '' : 'SW-') + result[item].fc_switch + ' (' + result[item].name + ')\n'
                            }
                            retVal += '```';
                            message.channel.send(retVal);
                        }
                    });
                }
                else {
                    // ToDo: Move query to User entity
                    Data.ExecuteQuery('SELECT * FROM ' + process.env.SQL_NAME + '.user WHERE fc_switch IS NOT NULL AND (name LIKE "%' + Data.sql.connection.escape(args[0]).replaceAll("'", "") + '%" OR (id IN (SELECT user_id FROM ' + process.env.SQL_NAME + '.guild_user WHERE guild_id = ' + message.guild.id + ' AND displayname LIKE "%' + Data.sql.connection.escape(args[0]).replaceAll("'", "") + '%"))) ORDER BY name', 
                        (error) => {
                            if (error != null) {
                                message.channel.send('Failed to get friendcodes!');
                                Log.logMessage('Failed to get friendcodes!', 'friendcode like', error, message.guild, message.channel, message.author);
                                return;
                            }
                        }, true)
                    .then((result) => {
                        if (typeof result == 'boolean' && result === false) {
                            message.channel.send('No FC found for ' + args[0]);
                        }
                        else if (!(typeof result == 'boolean') && result.length == 1) {
                            message.channel.send((result[0].fc_switch.startsWith('SW-') ? '' : 'SW-') + result[0].fc_switch);
                        }
                        else if (!(typeof result == 'boolean') && result.length > 1) {
                            let retVal = '**All friendcodes for ' + args[0] + ':**\n```css\n';
                            for (let item in result) {
                                retVal += (result[item].fc_switch.startsWith('SW-') ? '' : 'SW-') + result[item].fc_switch + ' (' + result[item].name + ')\n';
                            }
                            retVal += '```';
                            message.channel.send(retVal);
                        }
                        else {
                            message.channel.send('No FC found for ' + args[0]);
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
                    Data.CheckBaseData(message.guild, message.channel, guildmember.user)
                    .then(() => {
                        Data.User.UpdateFriendcode(guildmember, fc)
                        .then ((result) => {
                            if (result === false) {
                                message.channel.send('Failed to set friendcode!');
                                Log.logMessage('Failed to set friendcode!', 'friendcode SW user', error, message.guild, message.channel, message.author);
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
}
