const db = require('../SQLBase');
const Discord = require('discord.js');
const { v4: uuid } = require('uuid');

/**
 * Gets all guilds and returns them
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>|Promise<any[]>} Returns the object, if the result from the database is valid.
 */
function GetGuilds(failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.guild;';
        db.ExecuteQuery(queryString, failedCallback, true)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Gets the guild with the given id and returns it
 * @param {string} guildId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>|Promise<any[]>} Returns the object, if the result from the database is valid.
 */
function GetGuild(guildId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.guild WHERE id = ' + guildId + ';';
        db.ExecuteQuery(queryString, failedCallback, true)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Adds a new guild to the database
 * @param {Discord.Guild} guild 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function AddGuild(guild, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'INSERT INTO ' + process.env.SQL_NAME + '.guild (id, name, region) VALUES (' + guild.id + ', "' + guild.name + '", "' + guild.region + '");';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Updates an existing guild in the database
 * @param {Discord.Guild} guild 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function UpdateGuild(guild, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'UPDATE ' + process.env.SQL_NAME + '.guild SET name = "' + guild.name + '", region = "' + guild.region + '" WHERE id = ' + guild.id + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

// ToDo: Delete all references first...
/**
 * Deletes a guild with the given id from the database
 * @param {string} guildId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function DeleteGuild(guildId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'DELETE FROM ' + process.env.SQL_NAME + '.guild WHERE id = ' + guildId + ';';
        // Delete all log-entries with guild
        // Search all channels
        // Delete all channels
        // Search all guild_users
        // Delete all guild_users
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

module.exports = {
    GetAll: GetGuilds,
    Get: GetGuild,
    AddNew: AddGuild,
    Update: UpdateGuild,
    Delete: DeleteGuild,
}
