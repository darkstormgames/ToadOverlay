const db = require('../SQLBase');
const { v4: uuid } = require('uuid');

function Add(query, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        db.ExecuteQuery(query, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

function DeleteByGuildId(guildId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'DELETE FROM ' + process.env.SQL_NAME + '.log_commands WHERE guild_id = ' + guildId + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

function DeleteByChannelId(channelId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'DELETE FROM ' + process.env.SQL_NAME + '.log_commands WHERE channel_id = ' + channelId + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

function DeleteByUserId(userId, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'DELETE FROM ' + process.env.SQL_NAME + '.log_commands WHERE user_id = ' + userId + ';';
        db.ExecuteQuery(queryString, failedCallback)
        .then((result) => {
            resolve(result);
        });
    });
}

module.exports = {
    AddNew: Add,
    DeleteByGuildId: DeleteByGuildId,
    DeleteByChannelId: DeleteByChannelId,
    DeleteByUserId: DeleteByUserId
}
