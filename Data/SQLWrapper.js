const { Op, OpTypes } = require('sequelize');
const { connection, cachedQuery, getCache } = require('./SQLBase');
const { User, sync: UserSync } = require('./Entities/User');
const { Guild, sync: GuildSync } = require('./Entities/Guild');
const { GuildUser, sync: GuildUserSync } = require('./Entities/GuildUser');
const { Channel, sync: ChannelSync } = require('./Entities/Channel');
//const { ChannelData, sync: ChannelDataSync } = require('./Entities/ChannelData');
const { UserChannel, sync: UserChannelSync } = require('./Entities/UserChannel');
const { Profile, sync: ProfileSync } = require('./Entities/Profile');
const { ChannelProfile, sync: ChannelProfileSync } = require('./Entities/ChannelProfile');
const helper = require('./SQLDataHelper');
const { MessageContext } = require('../ClientHandlers/MessageContext');
// const { Client } = require('discord.js');

// Set User direct associations
User.hasMany(GuildUser, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'RESTRICT' });
GuildUser.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'RESTRICT' });
User.hasMany(UserChannel, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'RESTRICT' });
UserChannel.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'RESTRICT' });
User.hasMany(Profile, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'RESTRICT' });
Profile.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'RESTRICT' });
// Note: Log entity associations removed - logs now use NoSQL storage

// Set Guild direct associations
Guild.hasMany(GuildUser, { foreignKey: { name: 'guild_id', allowNull: false }, onDelete: 'RESTRICT' });
GuildUser.belongsTo(Guild, { foreignKey: { name: 'guild_id', allowNull: false }, onDelete: 'RESTRICT' });
Guild.hasMany(Channel, { foreignKey: { name: 'guild_id', allowNull: false }, onDelete: 'RESTRICT' });
Channel.belongsTo(Guild, { foreignKey: { name: 'guild_id', allowNull: false }, onDelete: 'RESTRICT' });
// Note: Log entity associations removed - logs now use NoSQL storage

// Set Channel direct associations
Channel.hasMany(UserChannel, { foreignKey: { name: 'channel_id', allowNull: false }, onDelete: 'RESTRICT' });
UserChannel.belongsTo(Channel, { foreignKey: { name: 'channel_id', allowNull: false }, onDelete: 'RESTRICT' });
//Channel.hasOne(ChannelData, { foreignKey: { name: 'channel_id', allowNull: false }, onDelete: 'RESTRICT', as: 'ChannelData' });
//ChannelData.belongsTo(Channel, { foreignKey: { name: 'channel_id', allowNull: false }, onDelete: 'RESTRICT', as: 'ChannelData' });
Channel.hasMany(ChannelProfile, { foreignKey: { name: 'channel_id', allowNull: false }, onDelete: 'RESTRICT' });
ChannelProfile.belongsTo(Channel, { foreignKey: { name: 'channel_id', allowNull: false }, onDelete: 'RESTRICT' });
// Note: Log entity associations removed - logs now use NoSQL storage

// Set remaining Profile direct associations
Profile.hasMany(ChannelProfile, { foreignKey: { name: 'profile_id', allowNull: false }, onDelete: 'RESTRICT' });
ChannelProfile.belongsTo(Profile, { foreignKey: { name: 'profile_id', allowNull: false }, onDelete: 'RESTRICT' });

// Set many-to-many associations
//      User <-> Channel
User.belongsToMany(Channel, { through: UserChannel, foreignKey: 'user_id', otherKey: 'channel_id' });
Channel.belongsToMany(User, { through: UserChannel, foreignKey: 'channel_id', otherKey: 'user_id' });
//     Guild <-> User
Guild.belongsToMany(User, { through: GuildUser, foreignKey: 'guild_id' });
User.belongsToMany(Guild, { through: GuildUser, foreignKey: 'user_id' });
//   Profile <-> Channel
Profile.belongsToMany(Channel, { through: ChannelProfile, foreignKey: 'profile_id' });
Channel.belongsToMany(Profile, { through: ChannelProfile, foreignKey: 'channel_id' });

console.log('stuff');

module.exports = {
  connection,
  Channel,
  ChannelSync,
//  ChannelData,
//  ChannelDataSync,
  ChannelProfile,
  ChannelProfileSync,
  Guild,
  GuildSync,
  GuildUser,
  GuildUserSync,
  Profile,
  ProfileSync,
  User,
  UserSync,
  UserChannel,
  UserChannelSync,

  // Note: Log entities removed - logs now use NoSQL storage
  // LogApplication, AppSync, LogMessage, MessageSync, LogDM, DMSync, LogReaction, ReactionSync

  /**
   * @type {MessageContext}
   */
  MessageContext: MessageContext,
  /**
  * @param {Discord.Guild} guild 
  * @param {Discord.Channel} channel 
  * @param {Discord.User} user 
  * @returns {DataContext}
  */
  CheckBaseData: async (guild, channel, user) => helper.CheckBaseData(guild, channel, user),
  
  // Cached version of CheckBaseData for improved performance
  CheckBaseDataCached: async (guild, channel, user, ttl) => helper.CheckBaseDataCached(guild, channel, user, ttl),
  
  Helper: helper,
  
  // Cache management functions
  cachedQuery,
  getCache,
  getCacheStatistics: () => helper.getCacheStatistics(),
  clearAllCache: () => helper.clearAllCache(),
  invalidateUserCache: (userId) => helper.invalidateUserCache(userId),
  invalidateGuildCache: (guildId) => helper.invalidateGuildCache(guildId),
  invalidateChannelCache: (channelId) => helper.invalidateChannelCache(channelId),
  
  /**
   * @type {OpTypes}
   */
  Op: Op
}
