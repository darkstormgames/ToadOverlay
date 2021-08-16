const db = require('../SQLBase');
const Discord = require('discord.js');
const { v4: uuid } = require('uuid');

/**
 * Gets the guild-user connection
 * @param {string} guildId 
 * @param {string} userId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>|Promise<any[]>} Returns the object, if the result from the database is valid.
 */
 function GetGuildUser(guildId, userId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.guild_user WHERE user_id = ' + userId + ' AND guild_id = ' + guildId + ';';
        db.ExecuteQuery(queryString, failedCallback, true)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Gets the guild-user connection with the given user id and returns it
 * @param {string} userId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>|Promise<any[]>} Returns the object, if the result from the database is valid.
 */
 function GetGuildUserByUserId(userId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.guild_user WHERE user_id = ' + userId + ';';
        db.ExecuteQuery(queryString, failedCallback, true)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Gets the guild-user connection with the given guild id and returns it
 * @param {string} guildId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>|Promise<any[]>} Returns the object, if the result from the database is valid.
 */
function GetGuildUserByGuildId(guildId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.guild_user WHERE guild_id = ' + guildId + ';';
        db.ExecuteQuery(queryString, failedCallback, true)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Adds a new guild-user connection to the database
 * @param {Discord.Guild} guild 
 * @param {Discord.User} user 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function AddGuildUser(guild, user, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        guild.members.fetch({user, force: true})
        .then((guildmember) => {
            let queryString = 'INSERT INTO ' + process.env.SQL_NAME + '.guild_user (id, guild_id, user_id, displayname) ' + 
                        'VALUES ("' + uuid() + '", ' + guild.id + ', ' + user.id + ', ' + (guildmember.nickname != null ? '"' + guildmember.nickname + '"' : 'null') + ')';
            db.ExecuteQuery(queryString, failedCallback)
            .then((result) => {
                resolve(result);
            });
        });
    });
}

/**
 * Updates the guild-user connection and (de-)activates it
 * @param {Discord.Guild} guild 
 * @param {Discord.User} user 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function UpdateGuildUser(guild, user, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        guild.members.fetch({user, force: true})
        .then((guildmember) => {
            let queryString = 'UPDATE ' + process.env.SQL_NAME + '.guild_user SET displayname =' + (guildmember.nickname != null ? '"' + guildmember.nickname + '"' : 'null') + ' WHERE guild_id = ' + guild.id + ' AND user_id = ' + user.id + ';';
            db.ExecuteQuery(queryString, failedCallback)
            .then((result) => {
                resolve(result);
            });
        });
    });
}

/**
 * Deletes all guild-user connections with the given user id
 * @param {string} userId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function DeleteGuildUserByUserId(userId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'DELETE FROM ' + process.env.SQL_NAME + '.guild_user WHERE user_id = ' + userId + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Deletes all guild-user connections with the given channel id
 * @param {string} guildId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function DeleteGuildUserByGuildId(guildId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'DELETE FROM ' + process.env.SQL_NAME + '.guild_user WHERE guild_id = ' + guildId + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        })
    });
}

module.exports = {
    Get: GetGuildUser,
    GetByUserId: GetGuildUserByUserId,
    GetByGuildId: GetGuildUserByGuildId,
    AddNew: AddGuildUser,
    Update: UpdateGuildUser,
    DeleteByUserId: DeleteGuildUserByUserId,
    DeleteByGuildId: DeleteGuildUserByGuildId,
}
