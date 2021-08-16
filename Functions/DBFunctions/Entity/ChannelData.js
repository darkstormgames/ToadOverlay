const db = require('../SQLBase');
const Discord = require('discord.js');
const { v4: uuid } = require('uuid');

/**
 * Gets the channel-data with the given id and returns it
 * @param {string} channelId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>|Promise<any[]>} Returns the object, if the result from the database is valid.
 */
 function GetChannelData(channelId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.channel_data WHERE channel_id = ' + channelId + ';';
        db.ExecuteQuery(queryString, failedCallback, true)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Adds new channel-data to the database
 * @param {Discord.Channel} channel 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function AddChannelData(channel, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'INSERT INTO ' + process.env.SQL_NAME + '.channel_data (id, channel_id) VALUES ("' + uuid() + '", ' + channel.id + ');';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Updates the data for the guest team
 * @param {Discord.Message} message 
 * @param {string} teamId 
 * @param {any} mkcTeamData 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function UpdateChannelDataGuest(channelId, teamId, mkcTeamData, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'UPDATE ' + process.env.SQL_NAME + '.channel_data SET ' +
            'guest_mkc_url = "https://www.mariokartcentral.com/mkc/registry/teams/' + teamId +
            '", guest_name = "' + mkcTeamData.team_name +
            '", guest_tag = "' + mkcTeamData.team_tag +
            '", guest_img = "' + (mkcTeamData.team_logo == "" ? '' : ('https://www.mariokartcentral.com/mkc/storage/' + mkcTeamData.team_logo)) +
            '" WHERE channel_id = ' + channelId + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Updates the data for the home team
 * @param {Discord.Message} message 
 * @param {string} teamId 
 * @param {any} mkcTeamData 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function UpdateChannelDataHome(channelId, teamId, mkcTeamData, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'UPDATE ' + process.env.SQL_NAME + '.channel_data SET ' +
            'home_mkc_url = "https://www.mariokartcentral.com/mkc/registry/teams/' + teamId +
            '", home_name = "' + mkcTeamData.team_name +
            '", home_tag = "' + mkcTeamData.team_tag +
            '", home_img = "' + (mkcTeamData.team_logo == "" ? '' : ('https://www.mariokartcentral.com/mkc/storage/' + mkcTeamData.team_logo)) +
            '" WHERE channel_id = ' + channelId + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Updates the scores for the both teams
 * @param {Number} homeCurrent 
 * @param {Number} guestCurrent 
 * @param {string} channelId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function UpdateChannelDataScores(homeCurrent, guestCurrent, channelId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'UPDATE ' + process.env.SQL_NAME + '.channel_data SET home_current = ' + homeCurrent + ', guest_current = ' + guestCurrent + ' WHERE channel_id = ' + channelId + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Deletes channel-data
 * @param {string} channelId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function DeleteChannelData(channelId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'DELETE FROM ' + process.env.SQL_NAME + '.channel_data WHERE channel_id = ' + channelId + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

module.exports = {
    Get: GetChannelData,
    AddNew: AddChannelData,
    UpdateHome: UpdateChannelDataHome,
    UpdateGuest: UpdateChannelDataGuest,
    UpdateScores: UpdateChannelDataScores,
    Delete: DeleteChannelData,
}
