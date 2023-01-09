const Discord = require('discord.js');
const guildEntity = require('./Entity/Guild');
const channelEntity = require('./Entity/Channel');
const channelDataEntity = require('./Entity/ChannelData');
const userEntity = require('./Entity/User');
const profileEntity = require('./Entity/Profile');
const userChannelEntity = require('./Entity/UserChannel');
const channelProfileEntity = require('./Entity/ChannelProfile');
const guildUserEntity = require('./Entity/GuildUser');

/**
 * 
 * @param {Discord.Guild} guild The guild object to check
 * @param {() => void} newEntryCallback Gets called, if a new entry is added to the database
 * @param {(error: any) => void} failedCallback Gets called, if an error occurs
 * @returns {Promise<null>|Promise<any>}
 */
function checkGuild(guild, newEntryCallback = () => {}, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        guildEntity.Get(guild.id, failedCallback)
        .then((getResult) => {
            if (typeof getResult == 'boolean' && getResult === false) { // No existing guild found
                guildEntity.AddNew(guild, failedCallback)
                .then((insertResult) => {
                    if (insertResult === true) {
                        guildEntity.Get(guild.id)
                        .then((checkResult) => {
                            if (!(typeof checkResult == 'boolean') && checkResult[0]) {
                                if (newEntryCallback instanceof Function) {
                                    newEntryCallback();
                                }
                                resolve(checkResult[0]);
                            } else { resolve(null); }
                        });
                    } else { resolve(null); }
                });
            }
            else if (!(typeof getResult == 'boolean') && getResult[0]) { // An existing guild was found
                if (!(getResult[0].name) || !(getResult[0].region) || getResult[0].name != guild.name || getResult[0].region != guild.region) {
                    guildEntity.Update(guild, failedCallback)
                    .then((updateResult) => {
                        if (updateResult === true) {
                            guildEntity.Get(guild.id)
                            .then((checkResult) => {
                                if (!(typeof checkResult == 'boolean') && checkResult[0]) {
                                    resolve(checkResult[0]);
                                } else { resolve(null); }
                            });
                        } else { resolve(null); }
                    });
                } else { resolve(getResult[0]); }
            } else { resolve(null); }
        });
    });
}

/**
 * 
 * @param {Discord.Channel} channel The channel object to check
 * @param {() => void} newEntryCallback Gets called, if a new entry is added to the database
 * @param {(error: any) => void} failedCallback Gets called, if an error occurs
 * @returns {Promise<null>|Promise<any>}
 */
function checkChannel(channel, newEntryCallback = () => {}, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        channelEntity.Get(channel.id, failedCallback)
        .then((getResult) => {
            if (typeof getResult == 'boolean' && getResult === false) { // No existing channel found
                channelEntity.AddNew(channel, failedCallback)
                .then((insertResult) => {
                    if (insertResult === true) {
                        channelDataEntity.AddNew(channel, failedCallback)
                        .then(() => {
                            channelEntity.Get(channel.id)
                            .then((checkResult) => {
                                if (!(typeof checkResult == 'boolean') && checkResult[0]) {
                                    if (newEntryCallback instanceof Function) {
                                        newEntryCallback();
                                    }
                                    resolve(checkResult[0]);
                                }
                                else { resolve(null); }
                            });
                        });
                    } else { resolve(null); }
                });
            }
            else if (!(typeof getResult == 'boolean') && getResult[0]) { // An existing channel was found
                if (!(getResult[0].name) || getResult[0].name != channel.name) {
                    channelEntity.Update(channel, failedCallback)
                    .then((updateResult) => {
                        if (updateResult === true) {
                            channelEntity.Get(channel.id)
                            .then((checkResult) => {
                                if (!(typeof checkResult == 'boolean') && checkResult[0]) {
                                    resolve(checkResult[0]);
                                } else { resolve(null); }
                            });
                        } else { resolve(null); }
                    });
                } else { resolve(getResult[0]); }
            } else { resolve(null); }
        });
    });
}

function tryUpdateUser(getResult, user, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        if (!(getResult[0].name) || !(getResult[0].discriminator) || getResult[0].name != user.username || getResult[0].discriminator != user.discriminator) {
            userEntity.Update(user, failedCallback)
            .then((updateResult) => {
                if (updateResult === true) {
                    userEntity.Get(user.id)
                    .then((checkResult) => {
                        if (!(typeof checkResult == 'boolean') && checkResult[0]) {
                            resolve(checkResult[0]);
                        } else { resolve(null); }
                    });
                } else { resolve(null); }
            });
        } else { resolve(getResult[0]); }
    });
}

/**
 * 
 * @param {Discord.User} user The user object to check
 * @param {() => void} newEntryCallback Gets called, if a new entry is added to the database
 * @param {(error: any) => void} failedCallback Gets called, if an error occurs
 * @param {Boolean} addProfile Indicates, if a default profile should be created
 * @returns {Promise<null>|Promise<any>}
 */
function checkUser(user, newEntryCallback = () => {}, failedCallback = (error) => {}, addProfile = true) {
    return new Promise((resolve) => {
        userEntity.Get(user.id, failedCallback)
        .then((getResult) => {
            if (typeof getResult == 'boolean' && getResult === false) { // No existing user found
                userEntity.AddNew(user, failedCallback)
                .then((insertResult) => {
                    if (insertResult === true) {
                        if (addProfile) {
                            profileEntity.GetByName(user.id, 'default') // Check if at least one profile already exists
                            .then((getProfileResult) => {
                                if (typeof getProfileResult == 'boolean' && getProfileResult === false) { // No profile exists
                                    profileEntity.AddNew(user, failedCallback)
                                    .then(() => {
                                        userEntity.Get(user.id)
                                        .then((checkResult) => {
                                            if (!(typeof checkResult == 'boolean') && checkResult[0]) {
                                                if (newEntryCallback instanceof Function) {
                                                    newEntryCallback();
                                                }
                                                resolve(checkResult[0]);
                                            }
                                            else { resolve(null); }
                                        });
                                    });
                                }
                                else if (!(typeof getProfileResult == 'boolean') && getProfileResult[0]) { // default profile exists
                                    userEntity.Get(user.id)
                                    .then((checkResult) => {
                                        if (!(typeof checkResult == 'boolean') && checkResult[0]) {
                                            if (newEntryCallback instanceof Function) {
                                                newEntryCallback();
                                            }
                                            resolve(checkResult[0]);
                                        }
                                        else { resolve(null); }
                                    });
                                } else { resolve(null); }
                            });
                        }
                        else {
                            userEntity.Get(user.id)
                            .then((checkResult) => {
                                if (!(typeof checkResult == 'boolean') && checkResult[0]) {
                                    if (newEntryCallback instanceof Function) {
                                        newEntryCallback();
                                    }
                                    resolve(checkResult[0]);
                                } else { resolve(null); }
                            });
                        }
                    } else { resolve(null); }
                });
            }
            else if (!(typeof getResult == 'boolean') && getResult[0]) { // An existing user was found
                if (addProfile) {
                    profileEntity.Get(user.id, failedCallback)
                    .then((profileGetResult) => {
                        if (!(typeof checkResult == 'boolean') && profileGetResult[0]) {
                            resolve(tryUpdateUser(getResult, user, failedCallback));
                        }
                        else {
                            profileEntity.AddNew(user, failedCallback)
                            .then(() => {
                                if (newEntryCallback instanceof Function) {
                                    newEntryCallback();
                                }
                                resolve(tryUpdateUser(getResult, user, failedCallback));
                            });
                        }
                    });
                }
                else {
                    resolve(tryUpdateUser(getResult, user, failedCallback));
                }
            } else { resolve(null); }
        });
    });
}

/**
 * 
 * @param {Discord.User} user The user object to check
 * @param {Discord.Channel} channel The channel object to check
 * @param {() => void} newEntryCallback Gets called, if a new entry is added to the database
 * @param {(error: any) => void} failedCallback Gets called, if an error occurs
 * @param {Boolean} activate Indicates, if the overlay should be activated
 * @returns {Promise<null>|Promise<any>}
 */
function checkUserChannel(user, channel, newEntryCallback = () => {}, failedCallback = (error) => {}, activate = true) {
    return new Promise((resolve) => {
        userChannelEntity.Get(user.id, channel.id, failedCallback)
        .then((getResult) => {
            if (typeof getResult == 'boolean' && getResult === false) { // No existing user-channel found
                if (activate) {
                    userChannelEntity.AddNew(channel, user, true, failedCallback)
                    .then((insertResult) => {
                        if (insertResult === true) {
                            let profileId = null;
                            profileEntity.GetByName(user.id, 'default', failedCallback)
                            .then((profileGetResult) => {
                                if (!(typeof profileGetResult == 'boolean' && profileGetResult[0])) {
                                    profileId = profileGetResult[0].id;
                                }
                                else { resolve(null); }
                            })
                            .then(() => {
                                channelProfileEntity.AddNew(channel, profileId, failedCallback)
                                .then(userChannelEntity.Get(user, channel)
                                .then((checkResult) => {
                                    if (!(typeof checkResult == 'boolean' && checkResult[0])) {
                                        if (newEntryCallback instanceof Function) {
                                            newEntryCallback();
                                        }
                                        resolve(checkResult[0]);
                                    } else { resolve(null); }
                                }));
                            });
                        }
                    });
                }
                else {
                    userChannelEntity.AddNew(channel, user, false, failedCallback)
                    .then((insertResult) => {
                        if (insertResult === true) {
                            userChannelEntity.Get(user, channel)
                            .then((checkResult) => {
                                if (!(typeof checkResult == 'boolean' && checkResult[0])) {
                                    if (newEntryCallback instanceof Function) {
                                        newEntryCallback();
                                    }
                                    resolve(checkResult[0]);
                                } else { resolve(null); }
                            });
                        }
                    });
                }
            }
            else if (!(typeof getResult == 'boolean') && getResult[0]) { // An existing user-channel was found
                if (activate) {
                    let profileId = null;
                    profileEntity.GetByName(user.id, 'default', failedCallback)
                    .then((profileGetResult) => {
                        if (!(typeof profileGetResult == 'boolean') && profileGetResult[0]) {
                            profileId = profileGetResult[0].id;
                        }
                    })
                    .then(() => {
                        userChannelEntity.Update(channel, user, true, failedCallback)
                        .then(() => {
                            channelProfileEntity.Get(profileId, channel.id)
                            .then((channelProfileResult) => {
                                if (typeof channelProfileResult == 'boolean' && channelProfileResult == false) { // No connection
                                    channelProfileEntity.AddNew(channel, profileId, failedCallback)
                                    .then((insertResult) => {
                                        if (insertResult === true) {
                                            userChannelEntity.Get(user, channel)
                                            .then((checkResult) => {
                                                if (!(typeof checkResult == 'boolean' && checkResult[0])) {
                                                    if (newEntryCallback instanceof Function) {
                                                        newEntryCallback();
                                                    }
                                                    resolve(checkResult[0]);
                                                } else { resolve(null); }
                                            });
                                        } else { resolve(null); }
                                    });
                                }
                                else { // Connection already exists
                                    userChannelEntity.Get(user, channel)
                                    .then((checkResult) => {
                                        if (!(typeof checkResult == 'boolean' && checkResult[0])) {
                                            resolve(checkResult[0]);
                                        } else { resolve(null); }
                                    });
                                }
                            });
                        });
                    });
                }
                else { resolve(getResult[0]); }
            } else { resolve(null); }
        });
    });
}

/**
 * 
 * @param {Discord.Guild} guild The guild object to check
 * @param {Discord.User} user The user object to check
 * @param {() => void} newEntryCallback Gets called, if a new entry is added to the database
 * @param {(error: any) => void} failedCallback Gets called, if an error occurs
 * @returns {Promise<null>|Promise<any>}
 */
function checkGuildUser(guild, user, newEntryCallback = () => {}, failedCallback = (error) => {}) {
    return new Promise((resolve) => {
        guildUserEntity.Get(guild.id, user.id, failedCallback)
        .then((getResult) => {
            if (typeof getResult == 'boolean' && getResult === false) { // No existing guild found
                guildUserEntity.AddNew(guild, user, failedCallback)
                .then((insertResult) => {
                    if (insertResult === true) {
                        guildUserEntity.Get(guild.id, user.id, failedCallback)
                        .then((checkResult) => {
                            if (!(typeof checkResult == 'boolean') && checkResult[0]) {
                                if (newEntryCallback instanceof Function) {
                                    newEntryCallback();
                                }
                                resolve(checkResult[0]);
                            } else { resolve(null); }
                        });
                    } else { resolve(null); }
                });
            }
            else if (!(typeof getResult == 'boolean') && getResult[0]) { // An existing guild was found
                guild.members.fetch({user, force: true})
                .then((guildmember) => {
                    if (!getResult[0].displayname || (getResult[0].displayname && getResult[0].displayname != guildmember.nickname)) {
                        guildUserEntity.Update(guild, user, failedCallback)
                        .then((updateResult) => {
                            if (updateResult === true) {
                                guildUserEntity.Get(guild.id, user.id)
                                .then((checkResult) => {
                                    if (!(typeof checkResult == 'boolean') && checkResult[0]) {
                                        resolve(checkResult[0]);
                                    } else { resolve(null); }
                                });
                            } else { resolve(null); }
                        });
                    } else { resolve(getResult[0]); }
                });
            } else { resolve(null); }
        });
    });
}

module.exports = {
    checkGuild: checkGuild,
    checkChannel: checkChannel,
    checkUser: checkUser,
    checkUserChannel: checkUserChannel,
    checkGuildUser: checkGuildUser,
}
