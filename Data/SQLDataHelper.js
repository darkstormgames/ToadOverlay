const Discord = require('discord.js');
const { DataContext } = require('../ClientHandlers/DataContext');
const { Guild } = require('./Entities/Guild');
const { User } = require('./Entities/User');
const { Channel } = require('./Entities/Channel');
//const { ChannelData } = require('./Entities/ChannelData');
const { Profile } = require('./Entities/Profile');
const { ChannelProfile } = require('./Entities/ChannelProfile');
const { GuildUser } = require('./Entities/GuildUser');
const { UserChannel } = require('./Entities/UserChannel');
const { LogMessage } = require('./Entities/LogMessage');
const { LogDM } = require('./Entities/LogDM');
const { cachedQuery, getCache } = require('./SQLBase');

/**
 * @param {Discord.Guild} guild 
 * @param {Discord.Channel} channel 
 * @param {Discord.User} user 
 * @returns {DataContext}
 */
async function CheckBaseData(guild, channel, user) {
  try {
    // Use cached versions of check functions for better performance (5-minute cache for relationships)
    const checkCacheTtl = 300; // 5 minutes for check operations
    const entityCacheTtl = 600; // 10 minutes for entity data
    
    // Check and cache entities in parallel for better performance
    const [
      guildResult,
      channelResult, 
      userResult,
      userChannelResult,
      guildUserResult
    ] = await Promise.all([
      checkGuildCached(guild, checkCacheTtl),
      checkChannelCached(channel, checkCacheTtl),
      checkUserCached(user, checkCacheTtl),
      checkUserChannelCached(user, channel, false, checkCacheTtl),
      checkGuildUserCached(guild, user, checkCacheTtl)
    ]);

    if (!guildResult) throw new Error('Guild');
    if (!channelResult) throw new Error('Channel');
    if (!userResult) throw new Error('User');
    if (!userChannelResult) throw new Error('UserChannel');
    if (!guildUserResult) throw new Error('GuildUser');

    // Get cached entity contexts in parallel
    const [userContext, guildContext, channelContext] = await Promise.all([
      getUserCached(user.id, entityCacheTtl),
      getGuildCached(guild.id, entityCacheTtl),
      getChannelCached(channel.id, entityCacheTtl)
    ]);

    if (process.env.ENVIRONMENT == 'DEVELOPMENT') {
      console.log('Cached entities loaded:', {
        user: !!userContext,
        guild: !!guildContext,
        channel: !!channelContext
      });
      console.log(JSON.stringify(userContext, null, 2));
      console.log(JSON.stringify(guildContext, null, 2));
      console.log(JSON.stringify(channelContext, null, 2));
    }

    return new DataContext(userContext, guildContext, channelContext);
  }
  catch (error) {
    if (process.env.ENVIRONMENT != 'PRODUCTION') {
      console.log('Unexpected error while checking ' + error);
    }
    throw error;
  }
}

/**
 * 
 * @param {Discord.Guild} guild 
 * @returns {Promise<null>|Promise<Guild>}
 */
async function checkGuild(guild) {
  let [result] = await Guild.findOrCreate({
    where: { id: guild.id },
    defaults: {
      id: guild.id,
      name: guild.name
    }
  });
  if (result.name != guild.name) {
    result.name = guild.name;
    result = await result.save();
  }
  return result;
}

/**
 * 
 * @param {Discord.Channel} channel 
 * @returns {Promise<null>|Promise<Channel>}
 */
async function checkChannel(channel) {
  let [result] = await Channel.findOrCreate({
    where: { id: channel.id },
    defaults: {
      id: channel.id,
      guild_id: channel.guild.id,
      name: channel.name
    }
  });
  // await ChannelData.findOrCreate({
  //   where: { channel_id: result.id },
  //   defaults: {
  //     channel_id: result.id
  //   }
  // });
  if (result.name != channel.name) {
    result.name = channel.name;
    result = await result.save();
  }
  return result;
}

/**
 * 
 * @param {Discord.User} user
 * @returns {Promise<null>|Promise<User>}
 */
async function checkUser(user) {
  let [result] = await User.findOrCreate({
    where: { id: user.id },
    defaults: {
      id: user.id,
      name: user.username,
      discriminator: user.discriminator
    }
  });
  await Profile.findOrCreate({
    where: {
      user_id: result.id,
      name: 'default'
    },
    defaults: {
      user_id: result.id,
      name: 'default'
    }
  });
  if (result.name != user.username || result.discriminator != user.discriminator) {
    result.name = user.username;
    result.discriminator = user.discriminator;
    result = await result.save()
  }
  return result;
}

/**
 * 
 * @param {Discord.User} user 
 * @param {Discord.Channel} channel 
 * @param {Boolean} activate 
 * @returns {Promise<null>|Promise<UserChannel>}
 */
async function checkUserChannel(user, channel, activate = true) {
  let authId = 0;
  do {
    authId = Math.floor(Math.random() * (1000000000 - 100000000) + 100000000);
  } while ((await UserChannel.findOne({ where: { auth: authId } })) != null)

  let [result] = await UserChannel.findOrCreate({
    where: {
      user_id: user.id,
      channel_id: channel.id
    },
    defaults: {
      auth: authId,
      user_id: user.id,
      channel_id: channel.id,
      isActive: activate
    }
  });
  if (activate) {
    let userDefault = await Profile.findOne({
      where: {
        user_id: user.id,
        name: 'default'
      }
    });
    await ChannelProfile.findOrCreate({
      where: {
        profile_id: userDefault.id,
        channel_id: channel.id
      },
      defaults: {
        profile_id: userDefault.id,
        channel_id: channel.id
      }
    });

    if (!result.isActive) {
      result.isActive = true;
      result = await result.save();
    }
  }
  return result;
}

/**
 * 
 * @param {Discord.Guild} guild 
 * @param {Discord.User} user 
 * @returns {Promise<null>|Promise<GuildUser>}
 */
async function checkGuildUser(guild, user) {
  let guildmember = await guild.members.fetch({ user, force: true });
  let [result] = await GuildUser.findOrCreate({
    where: {
      user_id: user.id,
      guild_id: guild.id
    },
    defaults: {
      guild_id: guild.id,
      user_id: user.id,
      displayname: guildmember.nickname
    }
  });
  if (result.displayname != guildmember.nickname) {
    result.displayname = guildmember.nickname;
    result = await result.save();
  }
  return result;
}

// ============================================================================
// CACHED METHODS - Enhanced versions with caching for better performance
// ============================================================================

/**
 * Get user with caching
 * @param {string} userId - User ID
 * @param {number} ttl - Time to live in seconds (default: 600 = 10 minutes)
 * @returns {Promise<User>} User entity
 */
async function getUserCached(userId, ttl = 600) {
  const cacheKey = `user:${userId}`;
  return cachedQuery(cacheKey, async () => {
    return await User.findByPk(userId);
  }, ttl, 'User', userId);
}

/**
 * Get guild with caching
 * @param {string} guildId - Guild ID
 * @param {number} ttl - Time to live in seconds (default: 600 = 10 minutes)
 * @returns {Promise<Guild>} Guild entity
 */
async function getGuildCached(guildId, ttl = 600) {
  const cacheKey = `guild:${guildId}`;
  return cachedQuery(cacheKey, async () => {
    return await Guild.findByPk(guildId);
  }, ttl, 'Guild', guildId);
}

/**
 * Get channel with caching
 * @param {string} channelId - Channel ID
 * @param {number} ttl - Time to live in seconds (default: 600 = 10 minutes)
 * @returns {Promise<Channel>} Channel entity
 */
async function getChannelCached(channelId, ttl = 600) {
  const cacheKey = `channel:${channelId}`;
  return cachedQuery(cacheKey, async () => {
    return await Channel.findByPk(channelId);
  }, ttl, 'Channel', channelId);
}

/**
 * Get user profiles with caching
 * @param {string} userId - User ID
 * @param {number} ttl - Time to live in seconds (default: 300 = 5 minutes)
 * @returns {Promise<Profile[]>} User profiles
 */
async function getUserProfilesCached(userId, ttl = 300) {
  const cacheKey = `profiles:${userId}`;
  return cachedQuery(cacheKey, async () => {
    return await Profile.findAll({
      where: { user_id: userId },
      include: [{ model: User }]
    });
  }, ttl, 'Profile', userId);
}

/**
 * Get user channels with caching
 * @param {string} userId - User ID
 * @param {number} ttl - Time to live in seconds (default: 300 = 5 minutes)
 * @returns {Promise<UserChannel[]>} User channels
 */
async function getUserChannelsCached(userId, ttl = 300) {
  const cacheKey = `user_channels:${userId}`;
  return cachedQuery(cacheKey, async () => {
    return await UserChannel.findAll({
      where: { user_id: userId },
      include: [{ model: Channel }, { model: User }]
    });
  }, ttl, 'UserChannel', userId);
}

/**
 * Get guild users with caching
 * @param {string} guildId - Guild ID
 * @param {number} ttl - Time to live in seconds (default: 300 = 5 minutes)
 * @returns {Promise<GuildUser[]>} Guild users
 */
async function getGuildUsersCached(guildId, ttl = 300) {
  const cacheKey = `guild_users_by_guild:${guildId}`;
  return cachedQuery(cacheKey, async () => {
    return await GuildUser.findAll({
      where: { guild_id: guildId },
      include: [{ model: User }, { model: Guild }]
    });
  }, ttl, 'GuildUser', guildId);
}

/**
 * Get channel profiles with caching
 * @param {string} channelId - Channel ID
 * @param {number} ttl - Time to live in seconds (default: 300 = 5 minutes)
 * @returns {Promise<ChannelProfile[]>} Channel profiles
 */
async function getChannelProfilesCached(channelId, ttl = 300) {
  const cacheKey = `channel_profiles:${channelId}`;
  return cachedQuery(cacheKey, async () => {
    return await ChannelProfile.findAll({
      where: { channel_id: channelId },
      include: [{ model: Profile }, { model: Channel }]
    });
  }, ttl, 'ChannelProfile', channelId);
}

/**
 * Cached version of CheckBaseData with optimized entity loading
 * @param {Discord.Guild} guild 
 * @param {Discord.Channel} channel 
 * @param {Discord.User} user 
 * @param {number} ttl - Time to live in seconds (default: 600 = 10 minutes)
 * @returns {Promise<DataContext>} Data context with cached entities
 */
async function CheckBaseDataCached(guild, channel, user, ttl = 600) {
  try {
    // Check and cache entities in parallel for better performance
    const [
      guildResult,
      channelResult, 
      userResult,
      userChannelResult,
      guildUserResult
    ] = await Promise.all([
      checkGuildCached(guild, ttl),
      checkChannelCached(channel, ttl),
      checkUserCached(user, ttl),
      checkUserChannelCached(user, channel, false, ttl),
      checkGuildUserCached(guild, user, ttl)
    ]);

    if (!guildResult) throw new Error('Guild');
    if (!channelResult) throw new Error('Channel');
    if (!userResult) throw new Error('User');
    if (!userChannelResult) throw new Error('UserChannel');
    if (!guildUserResult) throw new Error('GuildUser');

    // Get cached entity contexts
    const [userContext, guildContext, channelContext] = await Promise.all([
      getUserCached(user.id, ttl),
      getGuildCached(guild.id, ttl),
      getChannelCached(channel.id, ttl)
    ]);

    if (process.env.ENVIRONMENT == 'DEVELOPMENT') {
      console.log('Cached entities loaded:', {
        user: !!userContext,
        guild: !!guildContext,
        channel: !!channelContext
      });
    }

    return new DataContext(userContext, guildContext, channelContext);
  } catch (error) {
    if (process.env.ENVIRONMENT != 'PRODUCTION') {
      console.log('Unexpected error while checking cached data: ' + error);
    }
    throw error;
  }
}

/**
 * Cached version of checkGuild
 * @param {Discord.Guild} guild 
 * @param {number} ttl - Time to live in seconds (default: 600 = 10 minutes)
 * @returns {Promise<Guild>} Guild entity
 */
async function checkGuildCached(guild, ttl = 600) {
  const cacheKey = `guild_check:${guild.id}`;
  return cachedQuery(cacheKey, async () => {
    return await checkGuild(guild);
  }, ttl, 'Guild', guild.id);
}

/**
 * Cached version of checkChannel
 * @param {Discord.Channel} channel 
 * @param {number} ttl - Time to live in seconds (default: 600 = 10 minutes)
 * @returns {Promise<Channel>} Channel entity
 */
async function checkChannelCached(channel, ttl = 600) {
  const cacheKey = `channel_check:${channel.id}`;
  return cachedQuery(cacheKey, async () => {
    return await checkChannel(channel);
  }, ttl, 'Channel', channel.id);
}

/**
 * Cached version of checkUser
 * @param {Discord.User} user 
 * @param {number} ttl - Time to live in seconds (default: 600 = 10 minutes)
 * @returns {Promise<User>} User entity
 */
async function checkUserCached(user, ttl = 600) {
  const cacheKey = `user_check:${user.id}`;
  return cachedQuery(cacheKey, async () => {
    return await checkUser(user);
  }, ttl, 'User', user.id);
}

/**
 * Cached version of checkUserChannel
 * @param {Discord.User} user 
 * @param {Discord.Channel} channel 
 * @param {Boolean} activate 
 * @param {number} ttl - Time to live in seconds (default: 300 = 5 minutes)
 * @returns {Promise<UserChannel>} UserChannel entity
 */
async function checkUserChannelCached(user, channel, activate = true, ttl = 300) {
  const cacheKey = `user_channel_check:${user.id}:${channel.id}:${activate}`;
  return cachedQuery(cacheKey, async () => {
    return await checkUserChannel(user, channel, activate);
  }, ttl, 'UserChannel', `${user.id}:${channel.id}`);
}

/**
 * Cached version of checkGuildUser
 * @param {Discord.Guild} guild 
 * @param {Discord.User} user 
 * @param {number} ttl - Time to live in seconds (default: 300 = 5 minutes)
 * @returns {Promise<GuildUser>} GuildUser entity
 */
async function checkGuildUserCached(guild, user, ttl = 300) {
  const cacheKey = `guild_user_check:${user.id}:${guild.id}`;
  return cachedQuery(cacheKey, async () => {
    return await checkGuildUser(guild, user);
  }, ttl, 'GuildUser', `${user.id}:${guild.id}`);
}

// ============================================================================
// CACHE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Invalidate cache for specific user
 * @param {string} userId - User ID to invalidate cache for
 */
async function invalidateUserCache(userId) {
  const cache = getCache();
  await cache.invalidateEntity('User', userId);
}

/**
 * Invalidate cache for specific guild
 * @param {string} guildId - Guild ID to invalidate cache for
 */
async function invalidateGuildCache(guildId) {
  const cache = getCache();
  await cache.invalidateEntity('Guild', guildId);
}

/**
 * Invalidate cache for specific channel
 * @param {string} channelId - Channel ID to invalidate cache for
 */
async function invalidateChannelCache(channelId) {
  const cache = getCache();
  await cache.invalidateEntity('Channel', channelId);
}

/**
 * Invalidate cache for user-channel relationship
 * @param {string} userId - User ID
 * @param {string} channelId - Channel ID
 */
async function invalidateUserChannelCache(userId, channelId) {
  const cache = getCache();
  await cache.invalidateEntity('UserChannel', `${userId}:${channelId}`, {
    user_id: userId,
    channel_id: channelId
  });
}

/**
 * Invalidate cache for guild-user relationship
 * @param {string} userId - User ID
 * @param {string} guildId - Guild ID
 */
async function invalidateGuildUserCache(userId, guildId) {
  const cache = getCache();
  await cache.invalidateEntity('GuildUser', `${userId}:${guildId}`, {
    user_id: userId,
    guild_id: guildId
  });
}

/**
 * Clear all cache entries
 */
async function clearAllCache() {
  const cache = getCache();
  await cache.clearAll();
}

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
function getCacheStatistics() {
  const cache = getCache();
  return cache.getStatistics();
}

module.exports = {
  CheckBaseData,

  checkGuild,
  checkChannel,
  checkUser,
  checkUserChannel,
  checkGuildUser,

  // Cached versions of existing methods
  CheckBaseDataCached,
  getUserCached,
  getGuildCached,
  getChannelCached,
  getUserProfilesCached,
  getUserChannelsCached,
  getGuildUsersCached,
  getChannelProfilesCached,
  checkGuildCached,
  checkChannelCached,
  checkUserCached,
  checkUserChannelCached,
  checkGuildUserCached,

  // Cache management functions
  invalidateUserCache,
  invalidateGuildCache,
  invalidateChannelCache,
  invalidateUserChannelCache,
  invalidateGuildUserCache,
  clearAllCache,
  getCacheStatistics
}
