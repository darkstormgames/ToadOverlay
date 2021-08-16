const db = require('../SQLBase');
const Discord = require('discord.js');
const { v4: uuid } = require('uuid');

function GetChannelProfile(profileId, channelId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.channel_profile WHERE profile_id = "' + profileId + '" AND channel_id = ' + channelId + ';';
        db.ExecuteQuery(queryString, failedCallback, true)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Returns all channel-profile connections with the given profile id
 * @param {string} profileId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>|Promise<any[]>} Returns the object, if the result from the database is valid.
 */
 function GetChannelProfileByProfileId(profileId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.channel_profile WHERE profile_id = "' + profileId + '";';
        db.ExecuteQuery(queryString, failedCallback, true)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Returns all channel-profile connections from the channel with the given id
 * @param {string} channelId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>|Promise<any[]>} Returns the object, if the result from the database is valid.
 */
function GetChannelProfileByChannelId(channelId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.channel_profile WHERE channel_id = ' + channelId + ';';
        db.ExecuteQuery(queryString, failedCallback, true)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Adds a new channel-profile connection to the database
 * @param {Discord.Channel} channel 
 * @param {string} profileId 
 * @param {boolean} activate 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function AddChannelProfile(channel, profileId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'INSERT INTO ' + process.env.SQL_NAME + '.channel_profile (id, profile_id, channel_id) VALUES ("' + uuid() + '", "' + profileId + '", ' + channel.id + ');';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

// ToDo: I don't know, what I had planned here...
/**
 * Updates the channel-profile connection
 * @param {Discord.Channel} channel 
 * @param {string} newProfileId 
 * @param {string} oldProfileId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function UpdateChannelProfile(channel, newProfileId, oldProfileId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'UPDATE ' + process.env.SQL_NAME + '.channel_profile SET profile_id = ' + newProfileId + ' WHERE channel_id = ' + channel.id + ' AND profile_id = ' + oldProfileId + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Deletes a single channel-profile connection
 * @param {string} channelId 
 * @param {string} profileId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function DeleteChannelProfile(channelId, profileId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'DELETE FROM ' + process.env.SQL_NAME + '.channel_profile WHERE profile_id = ' + profileId + ' AND channel_id = ' + channelId + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Deletes all user-channel connections with the given user id
 * @param {string} profileId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function DeleteChannelProfileByProfileId(profileId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'DELETE FROM ' + process.env.SQL_NAME + '.channel_profile WHERE profile_id = ' + profileId + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Deletes all channel-profile connections with the given channel id
 * @param {string} channelId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function DeleteChannelProfileByChannelId(channelId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'DELETE FROM ' + process.env.SQL_NAME + '.channel_profile WHERE channel_id = ' + channelId + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        })
    });
}

module.exports = {
    Get: GetChannelProfile,
    GetByProfileId: GetChannelProfileByProfileId,
    GetByChannelId: GetChannelProfileByChannelId,
    AddNew: AddChannelProfile,
    Update: UpdateChannelProfile,
    Delete: DeleteChannelProfile,
    DeleteByProfileId: DeleteChannelProfileByProfileId,
    DeleteByChannelId: DeleteChannelProfileByChannelId,
}
