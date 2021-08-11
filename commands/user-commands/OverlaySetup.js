/**
 * @description required modules
 */
const instructions = require('../../Functions/HelpInstructions');
const base = require('../../Functions/CommandsBase');

module.exports = {
    /**
    * @description The name and trigger of the command
    */
    name: 'setup-overlay',

    /**
    * @description Alternative trigger(s) for the command
    */
    alt: ['setup'],

    /**
    * @description Defines the type of the command
    * This field is used for validation
    */
    type: base.CommandTypeEnum.General,

    /**
    * @description Short description of the command
    */
    description: 'Initialize your overlay or resend instructions.',


    guildOnly: true,

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        base.db.CheckBaseData(message.guild, message.channel, message.author)
        .then(() => {
            base.log.logMessage('Executing command "setup"', 'setup', message.content, message.guild, message.channel, message.author);
            let dbGuild = null;
            let dbChannel = null;
            let dbUser = null;
            let newUserCreated = false;
            let dbUserChannel = null;
            let newUserChannelCreated = false;
    
            //
            // Get or AddNew Guild
            //
            base.db.BaseDataHelper.checkGuild(message.guild, null, (result) => {
                if (result != null) {
                    base.log.logMessage('Error checking Guild!', 'setup', result.toString().replace('\'', '"').replace('`', '"').replace('´', '"'), message.guild, message.channel, message.author);
                    message.channel.send(message.author.toString() + 'There was an error creating your overlay.\n\nPlease try again later...');
                    return;
                }
            })
            .then((guildResult) => {
                dbGuild = guildResult;
            })
            .catch(() => {
                base.log.logMessage('Error checking guild...', 'setup', null, message.guild, message.channel, message.author);
                message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
                return;
            })
            //
            // Get or AddNew Channel
            //
            .then(() => base.db.BaseDataHelper.checkChannel(message.channel, null, (result) => {
                if (result != null) {
                    base.log.logMessage('Error checking Channel!', 'setup', result.toString().replace('\'', '"').replace('`', '"').replace('´', '"'), message.guild, message.channel, message.author);
                    message.channel.send(message.author.toString() + 'There was an error creating your overlay.\n\nPlease try again later...');
                    return;
                }
            }))
            .then((channelResult) => {
                dbChannel = channelResult;
            })
            .catch(() => {
                base.log.logMessage('Error checking channel...', 'setup', null, message.guild, message.channel, message.author);
                message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
                return;
            })
            //
            // Get or AddNew User
            //
            .then(() => base.db.BaseDataHelper.checkUser(message.author, () => {
                newUserCreated = true;
            }, (result) => {
                if (result != null) {
                    base.log.logMessage('Error checking User!', 'setup', result.toString().replace('\'', '"').replace('`', '"').replace('´', '"'), message.guild, message.channel, message.author);
                    message.channel.send(message.author.toString() + 'There was an error creating your overlay.\n\nPlease try again later...');
                    return;
                }
            }))
            .then((userResult) => {
                dbUser = userResult;
            })
            .catch((error) => {
                base.log.logMessage('Error checking user...', 'setup', error, message.guild, message.channel, message.author);
                message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
                return;
            })
            //
            // Get or AddNew UserChannel with ChannelProfile
            //
            .then(() => base.db.BaseDataHelper.checkUserChannel(message.author, message.channel, () => {
                newUserChannelCreated = true;
            }, (result) => {
                if (result != null) {
                    base.log.logMessage('Error checking UserChannel!', 'setup', result.toString().replace('\'', '"').replace('`', '"').replace('´', '"'), message.guild, message.channel, message.author);
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
                base.log.logMessage('Error checking user...', 'setup', null, message.guild, message.channel, message.author);
                message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
                return;
            })
            //
            // Check Guild_User connection
            //
            .then(() => base.db.BaseDataHelper.checkGuildUser(message.guild, message.author, null, null))
            .catch(() => base.log.logMessage('Error checking guild_user...', 'setup', null, message.guild, message.channel, message.author))
            //
            // Finish setup
            //
            .then(() => {
                if (newUserCreated && newUserChannelCreated) {
                    base.log.logMessage('Executed command "setup-overlay" with new entry.', 'setup', null, message.guild, message.channel, message.author);
                    message.channel.send(message.author.toString() + ' Your overlay for this channel has been created successfully.\nFurther instructions should be in your DMs.');
                    let text = instructions.get(dbUserChannel.id, message.author, message.guild, message.channel);
                    message.author.send({embed: text.instructEmbed});
                    message.author.send({embed: text.linkEmbed});
                }
                else if (!newUserCreated && newUserChannelCreated) {
                    base.log.logMessage('Executed command "setup-overlay" with new entry.', 'setup', null, message.guild, message.channel, message.author);
                    message.channel.send(message.author.toString() + ' Your overlay for this channel has been created successfully.\nFurther instructions should be in your DMs.');
                    var text = instructions.get(dbUserChannel.id, message.author, message.guild, message.channel);
                    message.author.send({embed: text.linkEmbed});
                }
                else if (!newUserCreated && !newUserChannelCreated) {
                    base.log.logMessage('Executed command "setup-overlay" with existing entry.', 'setup', null, message.guild, message.channel, message.author);
                    message.channel.send(message.author.toString() + ' There already is an overlay for you on this channel!\nThe URL will be sent to you again.');
                    var text = instructions.get(dbUserChannel.id, message.author, message.guild, message.channel);
                    message.author.send({embed: text.linkEmbed});
                }
                else {
                    base.log.logMessage('Error connecting Channel to User...', 'setup', null, message.guild, message.channel, message.author);
                    message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
                }
            })
            .catch((err) => {
                console.log(err);
                base.log.logMessage('Error sending messages...', 'setup', null, message.guild, message.channel, message.author);
                message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
                return;
            });
        });
    }
};
