const db = require('./SQLBase');
const Discord = require('discord.js');
const Log = require('../Log/Logger');
const baseData = require('./SQLDataStructureHelper');

/**
 * 
 * @param {Discord.Guild} guild 
 * @param {Discord.Channel} channel 
 * @param {Discord.User} user 
 * @returns {Promise<void>}
 */
function checkBaseData(guild, channel, user) {
    return new Promise((resolve) => {
        // Get or AddNew Guild
        baseData.checkGuild(guild, null, (result) => 
        {
            if (result != null)
            Log.logMessage('Error checking guild...', 'CheckBaseData - Guild', result, guild, channel, user)
        })
        .catch((error) => Log.logMessage('Error checking guild...', 'CheckBaseData - Guild', error, guild, channel, user))
        // Get or AddNew Channel
        .then(() => baseData.checkChannel(channel, null, (result) => 
        { 
            if (result != null)
            Log.logMessage('Error checking channel...', 'CheckBaseData - Channel', result, guild, channel, user)
        }))
        .catch((error) => Log.logMessage('Error checking channel...', 'CheckBaseData - Channel', error, guild, channel, user))
        // Get or AddNew User
        .then(() => baseData.checkUser(user, null, (result) => 
        {
            if (result != null)
            Log.logMessage('Error checking user...', 'CheckBaseData - User', result, guild, channel, user)
        }, false))
        .catch((error) => Log.logMessage('Error checking user...', 'CheckBaseData - User', error, guild, channel, user))
        // Get or AddNew UserChannel
        .then(() => baseData.checkUserChannel(user, channel, null, (result) => 
        {
            if (result != null)
            Log.logMessage('Error checking user_channel...', 'CheckBaseData - UserChannel', null, guild, channel, user)
        }, false))
        .catch((error) => Log.logMessage('Error checking user_channel...', 'CheckBaseData - UserChannel', error, guild, channel, user))
        // Check Guild_User connection
        .then(() => baseData.checkGuildUser(guild, user, null, (result) => 
        {
            if (result != null)
            Log.logMessage('Error checking guild_user...', 'CheckBaseData - GuildUser', null, guild, channel, user)
        }))
        .catch((error) => Log.logMessage('Error checking guild_user...', 'CheckBaseData - GuildUser', error, guild, channel, user))
        // Finish checking
        .then(() => resolve());
    });
}

module.exports = {
    ExecuteQuery: db.ExecuteQuery,
    CheckBaseData: checkBaseData,
    BaseDataHelper: baseData,
    sql: db,

    Channel: require('./Entity/Channel'),
    ChannelData: require('./Entity/ChannelData'),
    ChannelProfile: require('./Entity/ChannelProfile'),

    Guild: require('./Entity/Guild'),
    GuildUser: require('./Entity/GuildUser'),

    LogCommands: require('./Entity/LogCommands'),

    Profile: require('./Entity/Profile'),

    User: require('./Entity/User'),
    UserChannel: require('./Entity/UserChannel')


}
