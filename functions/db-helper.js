const base = require('./commandsBase');
const { v4: uuid } = require('uuid');

function checkGuild(guild, newEntryCallback, failedCallback) {
    return new Promise((resolve) => {
        base.query.execute('SELECT * FROM ' + base.query.dbName + '.guild WHERE id = ' + guild.id)
        .then((result) => {
            if (result.error != null && result.debug_error != null) {
                if (failedCallback instanceof Function) {
                    failedCallback(result);
                }
            }
            else if (result && result.result && result.result.length > 0) {
                let dbGuild = result.result[0];
                if (!(dbGuild.name) || !(dbGuild.region) || dbGuild.name != guild.name || dbGuild.region != guild.region) {
                    dbGuild.region = guild.region;
                    dbGuild.name = guild.name;
                    base.query.execute('UPDATE ' + base.query.dbName + '.guild SET name = "' + guild.name + '", region = "' + guild.region + '" WHERE id = ' + guild.id)
                    .then((result) => {
                        if (result.error != null && result.debug_error != null) {
                            if (failedCallback instanceof Function) {
                                failedCallback(result);
                            }
                        }
                        else {
                            base.query.execute('SELECT * FROM ' + base.query.dbName + '.guild WHERE id = ' + guild.id)
                            .then((result) => {
                                if (result.error != null && result.debug_error != null) {
                                    if (failedCallback instanceof Function) {
                                        failedCallback(result);
                                    }
                                }
                                else if (result && result.result && result.result.length > 0) {
                                    resolve(result.result[0]);
                                }
                            })
                        }
                    });
                }
                else {
                    resolve(dbGuild);
                }
            }
            else {
                base.query.execute('INSERT INTO ' + base.query.dbName + '.guild (id, name, region) VALUES (' + guild.id + ', "' + guild.name + '", "' + guild.region + '")')
                .then((result) => {
                    if (result.error != null && result.debug_error != null) {
                        if (failedCallback instanceof Function) {
                            failedCallback(result);
                        }
                    }
                    else {
                        base.query.execute('SELECT * FROM ' + base.query.dbName + '.guild WHERE id = ' + guild.id)
                        .then((result) => {
                            if (result.error != null && result.debug_error != null) {
                                if (failedCallback instanceof Function) {
                                    failedCallback(result);
                                }
                            }
                            else if (result && result.result && result.result.length > 0) {
                                if (newEntryCallback instanceof Function) {
                                    newEntryCallback();
                                }
                                resolve(result.result[0]);
                            }
                        })
                    }
                });
            }
        });
    });
}

function checkChannel(channel, newEntryCallback, failedCallback) {
    return new Promise((resolve) => {
        base.query.execute('SELECT * FROM ' + base.query.dbName + '.channel WHERE id = ' + channel.id)
        .then((result) => {
            if (result.error != null && result.debug_error != null) {
                if (failedCallback instanceof Function) {
                    failedCallback(result);
                }
            }
            else if (result && result.result && result.result.length > 0) {
                let dbChannel = result.result[0];
                if (!(dbChannel.name) || dbChannel.name != channel.name) {
                    dbChannel.name = channel.name;
                    base.query.execute('UPDATE ' + base.query.dbName + '.channel SET name = "' + channel.name + '" WHERE id = ' + channel.id)
                    .then((result) => {
                        if (result.error != null && result.debug_error != null) {
                            if (failedCallback instanceof Function) {
                                failedCallback(result);
                            }
                        }
                        else {
                            base.query.execute('SELECT * FROM ' + base.query.dbName + '.channel WHERE id = ' + channel.id)
                            .then((result) => {
                                if (result.error != null && result.debug_error != null) {
                                    if (failedCallback instanceof Function) {
                                        failedCallback(result);
                                    }
                                }
                                else if (result && result.result && result.result.length > 0) {
                                    resolve(result.result[0]);
                                }
                            })
                        }
                    });
                }
                else {
                    resolve(dbChannel);
                }
            }
            else {
                base.query.execute('INSERT INTO ' + base.query.dbName + '.channel (id, name, guild_id) VALUES (' + channel.id + ', "' + channel.name + '", ' + channel.guild.id + ')')
                .then((result) => {
                    if (result.error != null && result.debug_error != null) {
                        if (failedCallback instanceof Function) {
                            failedCallback(result);
                        }
                    }
                    else {
                        base.query.execute('INSERT INTO ' + base.query.dbName + '.channel_data (id, channel_id) VALUES ("' + uuid() + '", ' + channel.id + ')')
                        .then((result) => {
                            if (result.error != null && result.debug_error != null) {
                                if (failedCallback instanceof Function) {
                                    failedCallback(result);
                                }
                            }
                        })
                        .then(() => {
                            base.query.execute('SELECT * FROM ' + base.query.dbName + '.channel WHERE id = ' + channel.id)
                            .then((result) => {
                                if (result.error != null && result.debug_error != null) {
                                    if (failedCallback instanceof Function) {
                                        failedCallback(result);
                                    }
                                }
                                else if (result && result.result && result.result.length > 0) {
                                    if (newEntryCallback instanceof Function) {
                                        newEntryCallback();
                                    }
                                    resolve(result.result[0]);
                                }
                            })
                        });
                    }
                });
            }
        });
    });
}

async function selectUser(user, newEntryCallback, failedCallback) {
    let result = await base.query.execute('SELECT * FROM ' + base.query.dbName + '.user WHERE id = ' + user.id);
    if (result.error != null && result.debug_error != null) {
        if (failedCallback instanceof Function) {
            failedCallback(result);
        }
        return await Promise.resolve(result);
    }
    else if (result && result.result && result.result.length > 0) {
        if (newEntryCallback instanceof Function) {
            newEntryCallback();
        }
        return await Promise.resolve(result.result[0]);
    }
    else {
        return await Promise.resolve(null);
    }
}

async function tryUpdateUser(dbUser, user, newEntryCallback, failedCallback) {
    if (!(dbUser.name) || !(dbUser.discriminator) || dbUser.name != user.username || dbUser.discriminator != user.discriminator) {
        dbUser.discriminator = user.discriminator;
        dbUser.name = user.username;
        base.query.execute('UPDATE ' + base.query.dbName + '.user SET name = "' + user.username + '", discriminator = "' + user.discriminator + '" WHERE id = ' + user.id)
        .then((result) => {
            if (result.error != null && result.debug_error != null) {
                if (failedCallback instanceof Function) {
                    failedCallback(result);
                }
            }
            else {
                return Promise.resolve(selectUser(user, newEntryCallback, failedCallback));
            }
        });
    }
    else {
        return await Promise.resolve(dbUser);
    }
}

function checkUser(user, newEntryCallback, failedCallback, addProfile = true) {
    return new Promise((resolve) => {
        selectUser(user, null, null)
        .then((result) => {
            // Initial SELECT returned an error...
            if ((result && result.error && result.debug_error) || result === undefined) {
                if (failedCallback instanceof Function) {
                    if (result == undefined) {
                        failedCallback({
                            error: ' There was an error creating your overlay.\n\nPlease try again later...',
                            debug_error: 'SELECT on User returned undefined...'
                        });
                    }
                    else {
                        failedCallback(result);
                    }
                }
            }
            // Initial SELECT returned an empty result
            else if (result == null) {
                base.query.execute('INSERT INTO ' + base.query.dbName + '.user (id, name, discriminator) VALUES (' + user.id + ', "' + user.username + '", "' + user.discriminator + '")')
                .then((result) => {
                    if (result.error != null && result.debug_error != null) {
                        if (failedCallback instanceof Function) {
                            failedCallback(result);
                        }
                    }
                    else if (addProfile) {
                        base.query.execute('INSERT INTO ' + base.query.dbName + '.profile (id, user_id, bg_url, css, html) VALUES ("' + uuid() + '", ' + user.id + ', "empty", "empty", "empty")')
                        .then((result) => {
                            if (result.error != null && result.debug_error != null) {
                                if (failedCallback instanceof Function) {
                                    failedCallback(result);
                                }
                            }
                        })
                        .then(() => {
                            selectUser(user, newEntryCallback, failedCallback).then((result) => resolve(result));
                        });
                    }
                    else {
                        selectUser(user, newEntryCallback, failedCallback).then((result) => resolve(result));
                    }
                });
            }
            // Initial SELECT returned a valid entry
            else {
                let dbUser = result;
                if (addProfile) {
                    base.query.execute('SELECT id FROM ' + base.query.dbName + '.profile WHERE user_id = ' + user.id)
                    .then((result) => {
                        if (result.error != null && result.debug_error != null) {
                            if (failedCallback instanceof Function) {
                                failedCallback(result);
                            }
                        }
                        else if (result && result.result && result.result.length > 0) {
                            tryUpdateUser(dbUser, user, null, failedCallback).then((result) => resolve(result));
                        }
                        else {
                            base.query.execute('INSERT INTO ' + base.query.dbName + '.profile (id, user_id, bg_url, css, html) VALUES ("' + uuid() + '", ' + user.id + ', "empty", "empty", "empty")')
                            .then((result) => {
                                if (result.error != null && result.debug_error != null) {
                                    if (failedCallback instanceof Function) {
                                        failedCallback(result);
                                    }
                                }
                            })
                            .then(() => {
                                tryUpdateUser(dbUser, user, newEntryCallback, failedCallback).then((result) => resolve(result));
                            });
                        }
                    });
                }
                else {
                    tryUpdateUser(dbUser, user, null, failedCallback).then((result) => resolve(result));
                }
            }
        });
    });
}

function checkUserChannel(user, channel, newEntryCallback, failedCallback, activate = true) {
    return new Promise((resolve) => {
        base.query.execute('SELECT * FROM ' + base.query.dbName + '.user_channel WHERE user_id = ' + user.id + ' AND channel_id = ' + channel.id)
        .then((result) => {
            if (result.error != null && result.debug_error != null) {
                if (failedCallback instanceof Function) {
                    failedCallback(result);
                }
            }
            else if (result && result.result && result.result.length > 0) {
                if (activate) {
                    let profileID = null;
                    base.query.execute('SELECT * FROM ' + base.query.dbName + '.profile WHERE user_id = ' + user.id + ' AND name = "default"')
                    .then((result) => {
                        if (result.error != null && result.debug_error != null) {
                            if (failedCallback instanceof Function) {
                                failedCallback(result);
                            }
                        }
                        else if (result && result.result && result.result.length > 0) {
                            profileID = result.result[0].id;
                        }
                        else {
                            resolve({
                                result: null,
                                error: '[ERR208] There was an error with the database...\nPlease try again later.',
                                debug_error: 'No profile found...'
                            })
                        }
                    })
                    .then(() => {
                        base.query.execute('UPDATE ' + base.query.dbName + '.user_channel SET isActive = 1 WHERE user_id = ' + user.id + ' AND channel_id = ' + channel.id)
                        .then(() => {
                            base.query.execute('INSERT INTO ' + base.query.dbName + '.channel_profile (id, channel_id, profile_id) VALUES ("' + uuid() + '", ' + channel.id + ', "' + profileID + '")')
                            .then((result) => {
                                if (result.error != null && result.debug_error != null) {
                                    if (failedCallback instanceof Function) {
                                        failedCallback(result);
                                    }
                                }
                            })
                            .then(() => {
                                base.query.execute('SELECT * FROM ' + base.query.dbName + '.user_channel WHERE user_id = ' + user.id + ' AND channel_id = ' + channel.id)
                                .then((result) => {
                                    if (result.error != null && result.debug_error != null) {
                                        if (failedCallback instanceof Function) {
                                            failedCallback(result);
                                        }
                                    }
                                    else if (result && result.result && result.result.length > 0) {
                                        if (newEntryCallback instanceof Function) {
                                            newEntryCallback();
                                        }
                                        resolve(result.result[0]);
                                    }
                                });
                            });
                        });
                    });
                }
                else {
                    resolve(result.result[0]);
                }
            }
            else {
                if (activate) {
                    base.query.execute('INSERT INTO ' + base.query.dbName + '.user_channel (user_id, channel_id) VALUES (' + user.id + ', ' + channel.id + ')')
                    .then((result) => {
                        if (result.error != null && result.debug_error != null) {
                            if (failedCallback instanceof Function) {
                                failedCallback(result);
                            }
                        }
                        else {
                            let profileID = null;
                            base.query.execute('SELECT * FROM ' + base.query.dbName + '.profile WHERE user_id = ' + user.id + ' AND name = "default"')
                            .then((result) => {
                                if (result.error != null && result.debug_error != null) {
                                    if (failedCallback instanceof Function) {
                                        failedCallback(result);
                                    }
                                }
                                else if (result && result.result && result.result.length > 0) {
                                    profileID = result.result[0].id;
                                }
                                else {
                                    resolve({
                                        result: null,
                                        error: '[ERR208] There was an error with the database...\nPlease try again later.',
                                        debug_error: 'No profile found...'
                                    });
                                }
                            })
                            .then(() => {
                                base.query.execute('INSERT INTO ' + base.query.dbName + '.channel_profile (id, channel_id, profile_id) VALUES ("' + uuid() + '", ' + channel.id + ', "' + profileID + '")')
                                .then((result) => {
                                    if (result.error != null && result.debug_error != null) {
                                        if (failedCallback instanceof Function) {
                                            failedCallback(result);
                                        }
                                    }
                                })
                                .then(() => {
                                    base.query.execute('SELECT * FROM ' + base.query.dbName + '.user_channel WHERE user_id = ' + user.id + ' AND channel_id = ' + channel.id)
                                    .then((result) => {
                                        if (result.error != null && result.debug_error != null) {
                                            if (failedCallback instanceof Function) {
                                                failedCallback(result);
                                            }
                                        }
                                        else if (result && result.result && result.result.length > 0) {
                                            if (newEntryCallback instanceof Function) {
                                                newEntryCallback();
                                            }
                                            resolve(result.result[0]);
                                        }
                                        else {
                                            resolve({
                                                result: null,
                                                error: '[ERR218] There was an error with the database...\nPlease try again later.',
                                                debug_error: 'No profile found...'
                                            });
                                        }
                                    });
                                });
                            });
                        }
                    });
                }
                else {
                    base.query.execute('INSERT INTO ' + base.query.dbName + '.user_channel (user_id, channel_id, isActive) VALUES (' + user.id + ', ' + channel.id + ', FALSE)')
                    .then((result) => {
                        if (result.error != null && result.debug_error != null) {
                            if (failedCallback instanceof Function) {
                                failedCallback(result);
                            }
                        }
                        else {
                            base.query.execute('SELECT * FROM ' + base.query.dbName + '.user_channel WHERE user_id = ' + user.id + ' AND channel_id = ' + channel.id)
                            .then((result) => {
                                if (result.error != null && result.debug_error != null) {
                                    if (failedCallback instanceof Function) {
                                        failedCallback(result);
                                    }
                                }
                                else if (result && result.result && result.result.length > 0) {
                                    if (newEntryCallback instanceof Function) {
                                        newEntryCallback();
                                    }
                                    resolve(result.result[0]);
                                }
                                else {
                                    resolve({
                                        result: null,
                                        error: '[ERR208] There was an error with the database...\nPlease try again later.',
                                        debug_error: 'No profile found...'
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    });
}

function checkGuildUser(guild, user, newEntryCallback, failedCallback) {
    return new Promise((resolve) => {
        base.query.execute('SELECT * FROM ' + base.query.dbName + '.guild_user WHERE guild_id = ' + guild.id + ' AND user_id = ' + user.id)
        .then((result) => {
            if (result.error != null && result.debug_error != null) {
                if (failedCallback instanceof Function) {
                    failedCallback(result);
                }
            }
            else if (result && result.result && result.result.length > 0) {
                guild.members.fetch({user, force: true})
                .then((guildmember) => {
                    if (!result.result[0].displayname || (result.result[0].displayname && result.result[0].displayname != guildmember.nickname)) {
                        base.query.execute('UPDATE ' + base.query.dbName + '.guild_user SET displayname =' + (guildmember.nickname != null ? '"' + guildmember.nickname + '"' : 'null') + ' WHERE guild_id = ' + guild.id + ' AND user_id = ' + user.id)
                        .then((result) => {
                            if (result.error != null && result.debug_error != null) {
                                if (failedCallback instanceof Function) {
                                    failedCallback(result);
                                }
                            }
                            else {
                                base.query.execute('SELECT * FROM ' + base.query.dbName + '.guild_user WHERE guild_id = ' + guild.id + ' AND user_id = ' + user.id)
                                .then((result) => {
                                    if (result.error != null && result.debug_error != null) {
                                        if (failedCallback instanceof Function) {
                                            failedCallback(result);
                                        }
                                    }
                                    else if (result && result.result && result.result.length > 0) {
                                        if (newEntryCallback instanceof Function) {
                                            newEntryCallback();
                                        }
                                        resolve(result.result[0]);
                                    }
                                })
                            }
                        });
                    }
                    else {
                        resolve(result.result[0]);
                    }
                });
            }
            else {
                guild.members.fetch({user, force: true})
                .then((guildmember) => {
                    base.query.execute('INSERT INTO ' + base.query.dbName + '.guild_user (id, guild_id, user_id, displayname) VALUES ("' + uuid() + '", ' + guild.id + ', ' + user.id + ', ' + (guildmember.nickname != null ? '"' + guildmember.nickname + '"' : 'null') + ')')
                    .then((result) => {
                        if (result.error != null && result.debug_error != null) {
                            if (failedCallback instanceof Function) {
                                failedCallback(result);
                            }
                        }
                        else {
                            base.query.execute('SELECT * FROM ' + base.query.dbName + '.guild_user WHERE guild_id = ' + guild.id + ' AND user_id = ' + user.id)
                            .then((result) => {
                                if (result.error != null && result.debug_error != null) {
                                    if (failedCallback instanceof Function) {
                                        failedCallback(result);
                                    }
                                }
                                else if (result && result.result && result.result.length > 0) {
                                    if (newEntryCallback instanceof Function) {
                                        newEntryCallback();
                                    }
                                    resolve(result.result[0]);
                                }
                            })
                        }
                    });
                });
            }
        });
    });
}

module.exports = {
    checkGuild: checkGuild,

    checkChannel: checkChannel,

    checkUser: checkUser,

    checkUserChannel: checkUserChannel,

    checkGuildUser: checkGuildUser,

    /**
     * 
     * @param {Guild} guild 
     * @param {Channel} channel 
     * @param {User} user 
     * @returns Promise<void>
     */
    checkBaseData: (guild, channel, user) => {
        return new Promise((resolve) => {
            // Get or AddNew Guild
            checkGuild(guild, null, (result) => base.log.logMessage('Error checking guild...', user, guild, channel))
            .catch(() => base.log.logMessage('Error checking guild...', user, guild, channel))
            // Get or AddNew Channel
            .then(() => checkChannel(channel, null, (result) => base.log.logMessage('Error checking channel...', user, guild, channel)))
            .catch(() => base.log.logMessage('Error checking channel...', user, guild, channel))
            // Get or AddNew User
            .then(() => checkUser(user, null, (result) => base.log.logMessage('Error checking user...', user, guild, channel), false))
            .catch(() => base.log.logMessage('Error checking user...', user, guild, channel))
            // Get or AddNew UserChannel
            .then(() => checkUserChannel(user, channel, null, (result) => base.log.logMessage('Error checking user_channel...', user, guild, channel), false))
            .catch(() => base.log.logMessage('Error checking user_channel...', user, guild, channel))
            // Check Guild_User connection
            .then(() => checkGuildUser(guild, user, null, (result) => base.log.logMessage('Error checking guild_user...', user, guild, channel)))
            .catch(() => base.log.logMessage('Error checking guild_user...', user, guild, channel))
            // Finish checking
            .then(() => resolve());
        });
    }
}