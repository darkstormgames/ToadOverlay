const db = require('../SQLBase');
const Discord = require('discord.js');
const { v4: uuid } = require('uuid');

/**
 * Gets all users returns them
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>|Promise<any[]>} Returns the object, if the result from the database is valid.
 */
 function GetUsers(failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.user;';
        db.ExecuteQuery(queryString, failedCallback, true)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Gets the user with the given id and returns it
 * @param {string} userId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>|Promise<any[]>} Returns the object, if the result from the database is valid.
 */
 function GetUser(userId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.user WHERE id = ' + userId + ';';
        db.ExecuteQuery(queryString, failedCallback, true)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Adds a new user to the database
 * @param {Discord.User} user 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function AddUser(user, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'INSERT INTO ' + process.env.SQL_NAME + '.user (id, name, discriminator) VALUES (' + user.id + ', "' + user.username + '", "' + user.discriminator + '");';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Updates an existing user in the database
 * @param {Discord.User} user 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function UpdateUser(user, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'UPDATE ' + process.env.SQL_NAME + '.user SET name = "' + user.username + '", discriminator = "' + user.discriminator + '" WHERE id = ' + user.id + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Updates an existing user in the database
 * @param {Discord.User} user 
 * @param {string} friendcode
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
 function UpdateUserFriendcode(user, friendcode, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'UPDATE ' + process.env.SQL_NAME + '.user SET fc_switch = "' + friendcode + '" WHERE id = ' + user.id;
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

// ToDo: Delete all references first...
/**
 * Deletes a user with the given id from the database
 * @param {string} userId 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function DeleteUser(userId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'DELETE FROM ' + process.env.SQL_NAME + '.user WHERE id = ' + userId + ';';
        // Delete all log-entries with user
        // Search all profiles
        // Delete all channel_profiles
        // Delete all profiles
        // Delete all user_channels
        // Delete all guild_users
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

module.exports = {
    GetAll: GetUsers,
    Get: GetUser,
    AddNew: AddUser,
    Update: UpdateUser,
    UpdateFriendcode: UpdateUserFriendcode,
    Delete: DeleteUser,
}
