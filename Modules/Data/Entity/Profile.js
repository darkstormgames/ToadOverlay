const db = require('../SQLBase');
const Discord = require('discord.js');
const { v4: uuid } = require('uuid');

/**
 * Gets the user with the given id and returns it
 * @param {string} userId 
 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>|Promise<any[]>} Returns the object, if the result from the database is valid.
 */
 function GetProfile(userId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.profile WHERE user_id = ' + userId + ';';
        db.ExecuteQuery(queryString, failedCallback, true)
        .then((result) => {
            resolve(result);
        });
    });
}

/**
 * Gets the user with the given id and returns it
 * @param {string} userId 
 * @param {string} profileName
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>|Promise<any[]>} Returns the object, if the result from the database is valid.
 */
function GetProfileByName(userId, profileName, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'SELECT * FROM ' + process.env.SQL_NAME + '.profile WHERE user_id = ' + userId + ' AND name = "' + profileName + '";';
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
function AddProfile(user, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'INSERT INTO ' + process.env.SQL_NAME + '.profile (id, user_id, bg_url, css, html) VALUES ("' + uuid() + '", ' + user.id + ', "empty", "empty", "empty");';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

// function UpdateProfile(user, failedCallback = (error) => {}) {
//     return new Promise((resolve) => {
//         let queryString = 'UPDATE ' + process.env.SQL_NAME + '.user SET name = "' + user.name + '", discriminator = "' + user.discriminator + '" WHERE id = ' + user.id + ';';
//         db.ExecuteQuery(queryString, failedCallback)
//         .then((result) => {
//             resolve(result);
//         });
//     });
// }

// ToDo: Delete all references first...
/**
 * Deletes a user with the given id from the database
 * @param {string} userId 
 * @param {string} profileName 
 
 * @param {(error: any) => void} failedCallback 
 * @returns {Promise<boolean>} Returns true, if the result from the database is valid.
 */
function DeleteProfileByName(userId, profileName, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'DELETE FROM ' + process.env.SQL_NAME + '.profile WHERE user_id = ' + userId + ' AND name = "' + profileName + '";';
        // Delete all channel_profiles
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

module.exports = {
    Get: GetProfile,
    GetByName: GetProfileByName,
    AddNew: AddProfile,
    DeleteByName: DeleteProfileByName,
}
