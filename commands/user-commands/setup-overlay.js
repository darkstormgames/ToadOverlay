/**
 * @description required modules
 */
const instructions = require('../../functions/instructions');
const base = require('../../functions/commandsBase');
const dbhelper = require('../../functions/db-helper');

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
        base.log.logMessage('Executing command "setup"', message.author, message.guild, message.channel);
        let dbGuild = null;
        let dbChannel = null;
        let dbUser = null;
        let newUserCreated = false;
        let dbUserChannel = null;
        let newUserChannelCreated = false;

        //
        // Get or AddNew Guild
        //
        dbhelper.checkGuild(message.guild, null, (result) => {
            base.log.logMessage(result.debug_error, message.author, message.guild, message.channel);
            message.channel.send(message.author.toString() + result.error);
            return;
        })
        .then((guildResult) => {
            dbGuild = guildResult;
        })
        .catch(() => {
            base.log.logMessage('Error checking guild...', message.author, message.guild, message.channel);
            message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
            return;
        })
        //
        // Get or AddNew Channel
        //
        .then(() => dbhelper.checkChannel(message.channel, null, (result) => {
            base.log.logMessage(result.debug_error, message.author, message.guild, message.channel);
            message.channel.send(message.author.toString() + result.error);
            return;
        }))
        .then((channelResult) => {
            dbChannel = channelResult;
        })
        .catch(() => {
            base.log.logMessage('Error checking channel...', message.author, message.guild, message.channel);
            message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
            return;
        })
        //
        // Get or AddNew User
        //
        .then(() => dbhelper.checkUser(message.author, () => {
            newUserCreated = true;
        }, (result) => {
            base.log.logMessage(result.debug_error, message.author, message.guild, message.channel);
            message.channel.send(message.author.toString() + result.error);
            return;
        }))
        .then((userResult) => {
            dbUser = userResult;
        })
        .catch(() => {
            base.log.logMessage('Error checking user...', message.author, message.guild, message.channel);
            message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
            return;
        })
        //
        // Get or AddNew UserChannel with ChannelProfile
        //
        .then(() => dbhelper.checkUserChannel(message.author, message.channel, () => {
            newUserChannelCreated = true;
        }, (result) => {
            base.log.logMessage(result.debug_error, message.author, message.guild, message.channel);
            message.channel.send(message.author.toString() + result.error);
            return;
        }))
        .then((userChannelResult) => {
            dbUserChannel = userChannelResult;
        })
        .catch(() => {
            base.log.logMessage('Error checking user...', message.author, message.guild, message.channel);
            message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
            return;
        })
        //
        // Check Guild_User connection
        //
        .then(() => dbhelper.checkGuildUser(message.guild, message.author, null, null))
        .catch(() => base.log.logMessage('Error checking guild_user...', message.author, message.guild, message.channel))
        //
        // Finish setup
        //
        .then(() => {
            if (newUserCreated && newUserChannelCreated) {
                base.log.logMessage('Executed command "setup-overlay" with new entry.', message.author, message.guild, message.channel);
                message.channel.send(message.author.toString() + ' Your overlay for this channel has been created successfully.\nFurther instructions should be in your DMs.');
                let text = instructions.get(dbUserChannel.id, message.author, message.guild, message.channel);
                message.author.send({embed: text.instructEmbed});
                message.author.send({embed: text.linkEmbed});
            }
            else if (!newUserCreated && newUserChannelCreated) {
                base.log.logMessage('Executed command "setup-overlay" with new entry.', message.author, message.guild, message.channel);
                message.channel.send(message.author.toString() + ' Your overlay for this channel has been created successfully.\nFurther instructions should be in your DMs.');
                var text = instructions.get(dbUserChannel.id, message.author, message.guild, message.channel);
                message.author.send({embed: text.linkEmbed});
            }
            else if (!newUserCreated && !newUserChannelCreated) {
                base.log.logMessage('Executed command "setup-overlay" with existing entry.', message.author, message.guild, message.channel);
                message.channel.send(message.author.toString() + ' There already is an overlay for you on this channel!\nThe URL will be sent to you again.');
                var text = instructions.get(dbUserChannel.id, message.author, message.guild, message.channel);
                message.author.send({embed: text.linkEmbed});
            }
            else {
                base.log.logMessage('Error connecting Channel to User...', message.author, message.guild, message.channel);
                message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
            }
        })
        .catch((err) => {
            console.log(err);
            base.log.logMessage('Error sending messages...', message.author, message.guild, message.channel);
            message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
            return;
        });
    }
};