const { Op } = require('sequelize');
const { connection } = require('./SQLBase');
const { LogApplication, sync: AppSync } = require('./Entities/LogApplication');
const { User, sync: UserSync } = require('./Entities/User');
const { Guild, sync: GuildSync } = require('./Entities/Guild');
const { GuildUser, sync: GuildUserSync } = require('./Entities/GuildUser');
const { Channel, sync: ChannelSync } = require('./Entities/Channel');
const { ChannelData, sync: ChannelDataSync } = require('./Entities/ChannelData');
const { UserChannel, sync: UserChannelSync } = require('./Entities/UserChannel');
const { Profile, sync: ProfileSync } = require('./Entities/Profile');
const { ChannelProfile, sync: ChannelProfileSync } = require('./Entities/ChannelProfile');
const { LogCommand, sync: CommandSync } = require('./Entities/LogCommand');
const { LogDM, sync: DMSync } = require('./Entities/LogDM');
const helper = require('./SQLDataHelper');
const { ClientContext } = require('../ClientHandlers/ClientContext');
// const { Client } = require('discord.js');

// Set User direct associations
User.hasMany(GuildUser, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'RESTRICT' });
GuildUser.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'RESTRICT' });
User.hasMany(UserChannel, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'RESTRICT' });
UserChannel.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'RESTRICT' });
User.hasMany(Profile, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'RESTRICT' });
Profile.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'RESTRICT' });
User.hasMany(LogCommand, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'RESTRICT' });
LogCommand.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'RESTRICT' });
User.hasMany(LogDM, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'RESTRICT' });
LogDM.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'RESTRICT' });

// Set Guild direct associations
Guild.hasMany(GuildUser, { foreignKey: { name: 'guild_id', allowNull: false }, onDelete: 'RESTRICT' });
GuildUser.belongsTo(Guild, { foreignKey: { name: 'guild_id', allowNull: false }, onDelete: 'RESTRICT' });
Guild.hasMany(Channel, { foreignKey: { name: 'guild_id', allowNull: false }, onDelete: 'RESTRICT' });
Channel.belongsTo(Guild, { foreignKey: { name: 'guild_id', allowNull: false }, onDelete: 'RESTRICT' });
Guild.hasMany(LogCommand, { foreignKey: { name: 'guild_id', allowNull: false }, onDelete: 'RESTRICT' });
LogCommand.belongsTo(Guild, { foreignKey: { name: 'guild_id', allowNull: false }, onDelete: 'RESTRICT' });

// Set Channel direct associations
Channel.hasMany(UserChannel, { foreignKey: { name: 'channel_id', allowNull: false }, onDelete: 'RESTRICT' });
UserChannel.belongsTo(Channel, { foreignKey: { name: 'channel_id', allowNull: false }, onDelete: 'RESTRICT' });
Channel.hasOne(ChannelData, { foreignKey: { name: 'channel_id', allowNull: false }, onDelete: 'RESTRICT', as: 'ChannelData' });
ChannelData.belongsTo(Channel, { foreignKey: { name: 'channel_id', allowNull: false }, onDelete: 'RESTRICT', as: 'ChannelData' });
Channel.hasMany(ChannelProfile, { foreignKey: { name: 'channel_id', allowNull: false }, onDelete: 'RESTRICT' });
ChannelProfile.belongsTo(Channel, { foreignKey: { name: 'channel_id', allowNull: false }, onDelete: 'RESTRICT' });
Channel.hasMany(LogCommand, { foreignKey: { name: 'channel_id', allowNull: false }, onDelete: 'RESTRICT' });
LogCommand.belongsTo(Channel, { foreignKey: { name: 'channel_id', allowNull: false }, onDelete: 'RESTRICT' });

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
  ChannelData,
  ChannelDataSync,
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

  LogApplication,
  AppSync,
  LogCommand,
  CommandSync,
  LogDM,
  DMSync,

  /**
   * @type {ClientContext}
   */
  ClientContext: ClientContext,
  CheckBaseData: helper.CheckBaseData,
  Helper: helper,
  Op: Op
}
