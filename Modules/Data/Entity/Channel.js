const db = require('../SQLBase');
const Discord = require('discord.js');
const { v4: uuid } = require('uuid');

/**
 * Gets all channels and returns them
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>|Promise<any[]>} Returns the object, if the result from the database is valid.
 */
 function GetChannels(failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.channel;';
        db.ExecuteQuery(queryString, failedCallback, true)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Gets the channel with the given id and returns it
 * @param {string} channelId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>|Promise<any[]>} Returns the object, if the result from the database is valid.
 */
 function GetChannel(channelId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.channel WHERE id = ' + channelId + ';';
        db.ExecuteQuery(queryString, failedCallback, true)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Adds a new channel to the database
 * @param {Discord.Channel} channel 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function AddChannel(channel, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'INSERT INTO ' + process.env.SQL_NAME + '.channel (id, guild_id, name) VALUES (' + channel.id + ', "' + channel.guild.id + '", "' + channel.name + '");';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Updates an existing channel in the database
 * @param {Discord.Channel} channel 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function UpdateChannel(channel, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'UPDATE ' + process.env.SQL_NAME + '.channel SET name = "' + channel.name + '" WHERE id = ' + channel.id + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

// ToDo: Delete all references first...
/**
 * Deletes a channel with the given id from the database
 * @param {string} channelId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function DeleteChannel(channelId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'DELETE FROM ' + process.env.SQL_NAME + '.channel WHERE id = ' + channelId + ';';
        // Delete all log-entries with channel
        // Delete channel_data
        // Delete all channel_profiles
        // Delete all user_channels
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

module.exports = {
    GetAll: GetChannels,
    Get: GetChannel,
    AddNew: AddChannel,
    Update: UpdateChannel,
    Delete: DeleteChannel
}
