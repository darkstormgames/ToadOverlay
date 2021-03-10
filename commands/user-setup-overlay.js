/**
 * @description required modules
 */
const instructions = require('../functions/instructions');
const base = require('../functions/commandsBase');

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
        // Searching for existing entries in the database
        base.query.execute('SELECT * FROM ' + base.query.dbName + '.user_data WHERE guild_id = ' + message.guild.id + ' AND user_id = ' + message.author.id + ' AND channel_id = ' + message.channel.id)
        .then((result) => {
            if (result && result.result && result.result.length > 0) {
                base.log.logMessage('Executed command "setup-overlay" with existing entry.', message.author, message.guild, message.channel);
                message.channel.send(message.author.toString() + ' There already is an overlay for you on this channel!\nThe URL will be sent to you again.');
                var text = instructions.get(result.result[0].internal_id, message.author, message.guild, message.channel);
                message.author.send({embed: text.linkEmbed});
                return;
            }
    
            let userobj = null;
            base.query.execute('SELECT * FROM ' + base.query.dbName + '.user_data WHERE user_id = ' + message.author.id)
            .then((result) => {
                if (result.error != null && result.debug_error != null) {
                    base.log.logMessage(result.debug_error, message.author, message.guild, message.channel);
                }
                else {
                    if (result && result.result && result.result.length > 0) {
                        userobj = result.result[0];
                    }
                }
            });
    
            let channelobj = null;
            base.query.execute('SELECT * FROM ' + base.query.dbName + '.user_data WHERE channel_id = ' + message.channel.id)
            .then((result) => {
                if (result.error != null && result.debug_error != null) {
                    base.log.logMessage(result.debug_error, message.author, message.guild, message.channel);
                }
                else {
                    if (result && result.result && result.result.length > 0) {
                        channelobj = result.result[0];
                    }
                }
            });
    
            // Adding new entry to the database
            base.query.execute('INSERT INTO ' + base.query.dbName + '.user_data (guild_id, user_id, channel_id) VALUES (' + message.guild.id + ', ' + message.author.id + ', "' + message.channel.id + '")')
            .then((result) => {
                if (result.error != null && result.debug_error != null) {
                    base.log.logMessage(result.debug_error, message.author, message.guild);
                    message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
                }
                else {
                    // Check, if new entry has been added successfully
                    base.query.execute('SELECT * FROM ' + base.query.dbName + '.user_data WHERE guild_id = ' + message.guild.id + ' AND user_id = ' + message.author.id + ' AND channel_id = ' + message.channel.id)
                    .then((result) => {
                        if (result && result.result && result.result.length > 0) {
                            base.log.logMessage('Executed command "setup-overlay" with new entry.', message.author, message.guild, message.channel);
                            message.channel.send(message.author.toString() + ' Your overlay for this channel has been created successfully.\nFurther instructions should be in your DMs.');
                            var text = instructions.get(result.result[0].internal_id, message.author, message.guild, message.channel);
                            
                            if (channelobj) {
                                base.query.execute('UPDATE ' + base.query.dbName + '.user_data SET current_home = ' + channelobj.current_home + ', current_guest = ' + channelobj.current_guest + ', ' +
                                "home_mkc_link = '" + channelobj.home_mkc_link + "', home_tag = '" + channelobj.home_tag + "', home_name = '" + channelobj.home_name + "', home_img = '" + channelobj.home_img + "', " +
                                "guest_mkc_link = '" + channelobj.guest_mkc_link + "', guest_tag = '" + channelobj.guest_tag + "', guest_name = '" + channelobj.guest_name + "', guest_img = '" + channelobj.guest_img + "' " +
                                ' WHERE guild_id = ' + message.guild.id + ' AND user_id = ' + message.author.id + ' AND channel_id = ' + message.channel.id)
                                .then((result) => {
                                    if (result.error != null && result.debug_error != null) {
                                        base.log.logMessage(result.debug_error, message.author, message.guild, message.channel);
                                        message.channel.send('Couldn´t copy existing clan-data.\nExecute the "_home" and "_guest" commands again to update the new overlay.');
                                    }
                                });
                            }
    
                            if (!userobj)
                                message.author.send({embed: text.instructEmbed});
                            else {
                                base.query.execute('UPDATE ' + base.query.dbName + ".user_data SET ol_bg_link = '" + (userobj.ol_bg_link ? userobj.ol_bg_link : '') + 
                                "', ol_css = '" + (userobj.ol_css ? userobj.ol_css : '') + "', " +
                                "ol_html = '" + (userobj.ol_html ? userobj.ol_html : '') + 
                                "' WHERE guild_id = " + message.guild.id + " AND user_id = " + message.author.id + ' AND channel_id = ' + message.channel.id)
                                .then((result) => {
                                    if (result.error != null && result.debug_error != null) {
                                        base.log.logMessage(result.debug_error, message.author, message.guild, message.channel);
                                        message.channel.send('Couldn´t copy overlay-data.\nExecute the steps to customize your overlay again to update the new overlay.');
                                    }
    
                                });
                            }
    
                            message.author.send({embed: text.linkEmbed});
                        }
                        else {
                            base.log.logMessage('Error creating overlay! New entry not found...', message.author, message.guild, message.channel);
                            message.channel.send('There was an error creating your overlay.\n\nPlease try again later...');
                        }
                    });
                }
            });
        });
    }
};