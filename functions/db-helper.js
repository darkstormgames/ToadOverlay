const base = require('./commandsBase');
const { v4: uuid } = require('uuid');

module.exports = {
    checkGuild: (guild, newEntryCallback, failedCallback) => {
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
    },

    checkChannel: (channel, newEntryCallback, failedCallback) => {
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
    },

    checkUser: (user, newEntryCallback, failedCallback) => {
        return new Promise((resolve) => {
            base.query.execute('SELECT * FROM ' + base.query.dbName + '.user WHERE id = ' + user.id)
            .then((result) => {
                if (result.error != null && result.debug_error != null) {
                    if (failedCallback instanceof Function) {
                        failedCallback(result);
                    }
                }
                else if (result && result.result && result.result.length > 0) {
                    let dbUser = result.result[0];
                    if (!(dbUser.name) || !(dbUser.discriminator)) {
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
                                base.query.execute('SELECT * FROM ' + base.query.dbName + '.user WHERE id = ' + user.id)
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
                        resolve(dbUser);
                    }
                }
                else {
                    base.query.execute('INSERT INTO ' + base.query.dbName + '.user (id, name, discriminator) VALUES (' + user.id + ', "' + user.username + '", "' + user.discriminator + '")')
                    .then((result) => {
                        if (result.error != null && result.debug_error != null) {
                            if (failedCallback instanceof Function) {
                                failedCallback(result);
                            }
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
                                base.query.execute('SELECT * FROM ' + base.query.dbName + '.user WHERE id = ' + user.id)
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
    },

    checkUserChannel: (user, channel, newEntryCallback, failedCallback) => {
        return new Promise((resolve) => {
            base.query.execute('SELECT * FROM ' + base.query.dbName + '.user_channel WHERE user_id = ' + user.id + ' AND channel_id = ' + channel.id)
            .then((result) => {
                if (result.error != null && result.debug_error != null) {
                    if (failedCallback instanceof Function) {
                        failedCallback(result);
                    }
                }
                else if (result && result.result && result.result.length > 0) {
                    resolve(result.result[0]);
                }
                else {
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
                                    })
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
                                    });
                                });
                            });
                        }
                    });
                }
            });
        });
    },

    checkGuildUser: (guild, user, newEntryCallback, failedCallback) => {
        return new Promise((resolve) => {
            base.query.execute('SELECT * FROM ' + base.query.dbName + '.guild_user WHERE guild_id = ' + guild.id + ' AND user_id = ' + user.id)
            .then((result) => {
                if (result.error != null && result.debug_error != null) {
                    if (failedCallback instanceof Function) {
                        failedCallback(result);
                    }
                }
                else if (result && result.result && result.result.length > 0) {
                    resolve(result.result[0]);
                }
                else {
                    base.query.execute('INSERT INTO ' + base.query.dbName + '.guild_user (id, guild_id, user_id) VALUES ("' + uuid() + '", ' + guild.id + ', ' + user.id + ')')
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
            });
        });
    },
}