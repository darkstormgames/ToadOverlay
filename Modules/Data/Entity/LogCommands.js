const db = require('../SQLBase');
const { v4: uuid } = require('uuid');

function Add(message, command, data = null, guild = null, channel = null, user = null, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        let queryString = 'INSERT INTO ' + process.env.SQL_NAME + '.log_commands (id, guild_id, channel_id, user_id, env_type, command, message, data) VALUES ("' +
        uuid() + '", ' +
        (guild ? guild.id : 'NULL') + ', ' +
        (channel ? channel.id : 'NULL') + ', ' +
        (user ? user.id : 'NULL') + ', "' +
        process.env.ENVIRONMENT + '", "' +
        command + '", "' +
        message.replaceAll('"', ':') + '", ' +
        db.connection.escape((data ? '"' + data.toString().replaceAll('"', ':').replaceAll('\'', ':').replaceAll('`', ':').replaceAll('´', ':') + '"' : 'NULL')) + ');';
        db.ExecuteQuery(queryString, failedCallback)
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
