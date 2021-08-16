const db = require('../SQLBase');
const Discord = require('discord.js');
const { v4: uuid } = require('uuid');

/**
 * Returns all user-channel connections
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>|Promise<any[]>} Returns the object, if the result from the database is valid.
 */
 function GetUserChannels(failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.user_channel;';
        db.ExecuteQuery(queryString, failedCallback, true)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Returns all user-channel connections the user with the given id is in
 * @param {string} userId 
 * @param {string} channelId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>|Promise<any[]>} Returns the object, if the result from the database is valid.
 */
function GetUserChannel(userId, channelId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.user_channel WHERE user_id = ' + userId + ' AND channel_id = ' + channelId + ';';
        db.ExecuteQuery(queryString, failedCallback, true)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Returns all user-channel connections the user with the given id is in
 * @param {string} userId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>|Promise<any[]>} Returns the object, if the result from the database is valid.
 */
 function GetUserChannelByUserId(userId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.user_channel WHERE user_id = ' + userId + ';';
        db.ExecuteQuery(queryString, failedCallback, true)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Returns all user-channel connections from the channel with the given id
 * @param {string} channelId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>|Promise<any[]>} Returns the object, if the result from the database is valid.
 */
function GetUserChannelByChannelId(channelId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.user_channel WHERE channel_id = ' + channelId + ';';
        db.ExecuteQuery(queryString, failedCallback, true)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Adds a new user-channel connection to the database
 * @param {Discord.Channel} channel 
 * @param {Discord.User} user 
 * @param {boolean} activate 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function AddUserChannel(channel, user, activate = true, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'INSERT INTO ' + process.env.SQL_NAME + '.user_channel (user_id, channel_id, isActive) VALUES (' + user.id + ', ' + channel.id + ', ' + (activate == true ? '1' : '0') + ');';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Updates the user-channel connection and (de-)activates it
 * @param {Discord.Channel} channel 
 * @param {Discord.User} user 
 * @param {boolean} activate 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function UpdateUserChannel(channel, user, activate = true, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'UPDATE ' + process.env.SQL_NAME + '.user_channel SET isActive = ' + (activate == true ? '1' : '0') + ' WHERE user_id = ' + user.id + ' AND channel_id = ' + channel.id + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Deletes a single user-channel connection
 * @param {string} channelId 
 * @param {string} userId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function DeleteUserChannel(channelId, userId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'DELETE FROM ' + process.env.SQL_NAME + '.user_channel WHERE user_id = ' + userId + ' AND channel_id = ' + channelId + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Deletes all user-channel connections with the given user id
 * @param {string} userId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function DeleteUserChannelByUserId(userId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'DELETE FROM ' + process.env.SQL_NAME + '.user_channel WHERE user_id = ' + userId + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Deletes all user-channel connections with the given channel id
 * @param {string} channelId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function DeleteUserChannelByChannelId(channelId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'DELETE FROM ' + process.env.SQL_NAME + '.user_channel WHERE channel_id = ' + channelId + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        })
    });
}

module.exports = {
    GetAll: GetUserChannels,
    Get: GetUserChannel,
    GetByUserId: GetUserChannelByUserId,
    GetByChannelId: GetUserChannelByChannelId,
    AddNew: AddUserChannel,
    Update: UpdateUserChannel,
    Delete: DeleteUserChannel,
    DeleteByUserId: DeleteUserChannelByUserId,
    DeleteByChannelId: DeleteUserChannelByChannelId,
}
