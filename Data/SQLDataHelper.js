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

/**
 * @param {Discord.Guild} guild 
 * @param {Discord.Channel} channel 
 * @param {Discord.User} user 
 * @returns {DataContext}
 */
async function CheckBaseData(guild, channel, user) {
  try {
    if (!(await checkGuild(guild))) throw new Error('Guild');
    if (!(await checkChannel(channel))) throw new Error('Channel');
    if (!(await checkUser(user))) throw new Error('User');
    if (!(await checkUserChannel(user, channel, false))) throw new Error('UserChannel');
    if (!(await checkGuildUser(guild, user))) throw new Error('GuildUser');

    let userContext = await User.findByPk(user.id, {
      //  include: [
      //    Channel,
      //   // Guild,
      //   // GuildUser,
      //   // Profile,
      //   // UserChannel
      //  ]
    });
    if (process.env.ENVIRONMENT == 'DEVELOPMENT') console.log(JSON.stringify(userContext, null, 2));

    let guildContext = await Guild.findByPk(guild.id, {
      // include: [
        // Channel,
        // GuildUser,
        // User
      // ]
    });
    if (process.env.ENVIRONMENT == 'DEVELOPMENT') console.log(JSON.stringify(guildContext, null, 2));

    let channelContext = await Channel.findByPk(channel.id, {
      // include: [
        // {
        //   model: ChannelData,
        //   as: 'ChannelData'
        // },
        // ChannelProfile,
        // Guild,
        // Profile,
        // User,
        // UserChannel,
        // {
        //   model: LogMessage,
        //   separate: true,
        //   limit: 10,
        //   order: [['created', 'DESC']],
        //   where: {
        //     channel_id: channel.id
        //   }
        // }
      // ]
    });
    if (process.env.ENVIRONMENT == 'DEVELOPMENT') console.log(JSON.stringify(channelContext, null, 2));

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

module.exports = {
  CheckBaseData,

  checkGuild,
  checkChannel,
  checkUser,
  checkUserChannel,
  checkGuildUser
}
