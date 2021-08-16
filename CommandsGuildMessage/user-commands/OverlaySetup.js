const Discord = require('discord.js');
const Data = require('../../Modules/Data/SQLWrapper');
const Log = require('../../Modules/Log/Logger');
const instructions = require('../../Modules/Help/HelpInstructions');

module.exports = {
    name: 'setup-overlay',
    alt: ['setup'],
    description: 'Initialize your overlay or resend instructions.',

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        Data.CheckBaseData(message.guild, message.channel, message.author)
        .then(() => {
            let dbGuild = null;
            let dbChannel = null;
            let dbUser = null;
            let newUserCreated = false;
            let dbUserChannel = null;
            let newUserChannelCreated = false;
    
            //
            // Get or AddNew Guild
            //
            Data.BaseDataHelper.checkGuild(message.guild, null, (result) => {
                if (result != null) {
                    Log.logMessage('Error checking Guild!', 'setup', result.toString().replace('\'', '"').replace('`', '"').replace('´', '"'), message.guild, message.channel, message.author);
                    message.channel.send(message.author.toString() + 'There was an error creating your overlay.\n\nPlease try again later...');
                    return;
                }
            })
            .then((guildResult) => {
                dbGuild = guildResult;
            })
            .catch(() => {
                Log.logMessage('Error checking guild...', 'setup', null, message.guild, message.channel, message.author);
                message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
                return;
            })
            //
            // Get or AddNew Channel
            //
            .then(() => Data.BaseDataHelper.checkChannel(message.channel, null, (result) => {
                if (result != null) {
                    Log.logMessage('Error checking Channel!', 'setup', result.toString().replace('\'', '"').replace('`', '"').replace('´', '"'), message.guild, message.channel, message.author);
                    message.channel.send(message.author.toString() + 'There was an error creating your overlay.\n\nPlease try again later...');
                    return;
                }
            }))
            .then((channelResult) => {
                dbChannel = channelResult;
            })
            .catch(() => {
                Log.logMessage('Error checking channel...', 'setup', null, message.guild, message.channel, message.author);
                message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
                return;
            })
            //
            // Get or AddNew User
            //
            .then(() => Data.BaseDataHelper.checkUser(message.author, () => {
                newUserCreated = true;
            }, (result) => {
                if (result != null) {
                    Log.logMessage('Error checking User!', 'setup', result.toString().replace('\'', '"').replace('`', '"').replace('´', '"'), message.guild, message.channel, message.author);
                    message.channel.send(message.author.toString() + 'There was an error creating your overlay.\n\nPlease try again later...');
                    return;
                }
            }))
            .then((userResult) => {
                dbUser = userResult;
            })
            .catch((error) => {
                Log.logMessage('Error checking user...', 'setup', error, message.guild, message.channel, message.author);
                message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
                return;
            })
            //
            // Get or AddNew UserChannel with ChannelProfile
            //
            .then(() => Data.BaseDataHelper.checkUserChannel(message.author, message.channel, () => {
                newUserChannelCreated = true;
            }, (result) => {
                if (result != null) {
                    Log.logMessage('Error checking UserChannel!', 'setup', result.toString().replace('\'', '"').replace('`', '"').replace('´', '"'), message.guild, message.channel, message.author);
                    message.channel.send(message.author.toString() + 'There was an error creating your overlay.\n\nPlease try again later...');
                    return;
                }
            }))
            .then((userChannelResult) => {
                if (userChannelResult != null) {
                    dbUserChannel = userChannelResult;
                }
            })
            .catch(() => {
                Log.logMessage('Error checking user...', 'setup', null, message.guild, message.channel, message.author);
                message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
                return;
            })
            //
            // Check Guild_User connection
            //
            .then(() => Data.BaseDataHelper.checkGuildUser(message.guild, message.author, null, null))
            .catch(() => Log.logMessage('Error checking guild_user...', 'setup', null, message.guild, message.channel, message.author))
            //
            // Finish setup
            //
            .then(() => {
                if (newUserCreated && newUserChannelCreated) {
                    Log.logMessage('Executed command "setup-overlay" with new entry.', 'setup', null, message.guild, message.channel, message.author);
                    message.channel.send(message.author.toString() + ' Your overlay for this channel has been created successfully.\nFurther instructions should be in your DMs.');
                    let text = instructions.get(dbUserChannel.id, message.author, message.guild, message.channel);
                    message.author.send({embeds: [text.instructEmbed]});
                    message.author.send({embeds: [text.linkEmbed]});
                }
                else if (!newUserCreated && newUserChannelCreated) {
                    Log.logMessage('Executed command "setup-overlay" with new entry.', 'setup', null, message.guild, message.channel, message.author);
                    message.channel.send(message.author.toString() + ' Your overlay for this channel has been created successfully.\nFurther instructions should be in your DMs.');
                    var text = instructions.get(dbUserChannel.id, message.author, message.guild, message.channel);
                    message.author.send({embeds: [text.linkEmbed]});
                }
                else if (!newUserCreated && !newUserChannelCreated) {
                    Log.logMessage('Executed command "setup-overlay" with existing entry.', 'setup', null, message.guild, message.channel, message.author);
                    message.channel.send(message.author.toString() + ' There already is an overlay for you on this channel!\nThe URL will be sent to you again.');
                    var text = instructions.get(dbUserChannel.id, message.author, message.guild, message.channel);
                    message.author.send({embeds: [text.linkEmbed]});
                }
                else {
                    Log.logMessage('Error connecting Channel to User...', 'setup', null, message.guild, message.channel, message.author);
                    message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
                }
            })
            .catch((err) => {
                console.log(err);
                Log.logMessage('Error sending messages...', 'setup', null, message.guild, message.channel, message.author);
                message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
                return;
            });
        });
    }
};
