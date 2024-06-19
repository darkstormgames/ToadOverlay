const { existsSync, mkdirSync } = require('fs');
const { ActivityType, Client, Events, Guild, GuildChannel, GuildEmoji, GuildMember, User } = require('discord.js');
const Data = require('../Data/SQLWrapper');
const { LogApplication, LogMessage, LogDM, LogLevel, LogStatus } = require('../Log/Logger');

let client = null;

/**
 * Executed, whenever the client enters a ready state.
 * @param {Client} discordClient 
 */
function onReady(discordClient) {
  LogApplication('ClientEventHandler.OnReady', 'Client ready.', LogStatus.Initialize, LogLevel.Info);
  client.user.setActivity({
    type: ActivityType.Watching,
    name: `Toad on ${discordClient.guilds.cache.size} servers.`,
    //state: `Type "_?" for help on available commands.`
    state: 'Type "_status" for information on the current state of the bot.'
  });
}

/**
 * Executed, whenever the client goes offline.
 * Restarts the bot by itself.
 */
function onInvalidated() {
  LogApplication('ClientEventHandler.OnInvalidated', 'Client invalidated!', LogStatus.DiscordWarn, LogLevel.Warn);
  client.login(process.env.CLIENT_TOKEN);
}

/**
 * Executed on every debug message sent from discord.js.
 * @param {string} message 
 */
function onDebug(message) {
  LogApplication('ClientEventHandler.OnDebug', message, LogStatus.Executing, LogLevel.Debug, '', false);
}

/**
 * Executed on every warn message sent from discord.js.
 * @param {string} message 
 */
function onWarn(message) {
  LogApplication('ClientEventHandler.OnWarn', message, LogStatus.DiscordWarn, LogLevel.Warn, '');
}

/**
 * Executed, whenever discord.js throws an error.
 * The error is still unhandled after this.
 * @param {Error} error 
 */
function onError(error) {
  LogApplication('ClientEventHandler.OnError', error.message, LogStatus.Error, LogLevel.Error, error.stack);
}


/**
 * Executed, whenever a channel in an available guild is deleted.
 * @param {GuildChannel} channel
 */
function onChannelDelete(channel) {
  // ToDo: remove corresponding database entries for the deleted channel

}

/**
 * Executed, whenever a channel in an available guild is updated.
 * @param {GuildChannel} oldChannel
 * @param {GuildChannel} newChannel
 */
function onChannelUpdate(oldChannel, newChannel) {
  // ToDo: update corresponding database entries for the updated channel

}

/**
 * Executed, whenever an emoji in an available guild is deleted.
 * @param {GuildEmoji} channel
 */
function onEmojiDelete(emoji) {
  // ToDo: revert used emojis back to default, if it has been used

}

/**
 * Executed, whenever an emoji in an available guild is updated.
 * @param {GuildEmoji} oldEmoji
 * @param {GuildEmoji} newEmoji
 */
function onEmojiUpdate(oldEmoji, newEmoji) {
  // ToDo: update emoji in database, if used

}

/**
 * Executed, whenever the bot is invited to a new server.
 * @param {Guild} guild 
 */
function onGuildCreate(guild) {
  // ToDo: insert guild details to the database and create a default configuration

}

/**
 * Executed, whenever the details of an available guild are changed.
 * @param {Guild} oldGuild 
 * @param {Guild} newGuild 
 */
function onGuildUpdate(oldGuild, newGuild) {
  // ToDo: update guild details for the corresponding guild in the database

}

/**
 * Executed, whenever the bot is removed from a guild, or an available guild is being deleted.
 * @param {Guild} guild 
 */
function onGuildDelete(guild) {
  // ToDo: clean up any dependencies (channels, configs, etc.) for the removed guild 
  // ToDo: clean up any users, that only used the bot in the deleted guild
  // ToDo: DM removed users their overlay details, if they have any custom html/css
  // ToDo: remove the guild from the database

}

/**
 * Executed, whenever a user leaves a guild or is removed from it.
 * @param {GuildMember} guildMember 
 */
function onGuildMemberRemove(guildMember) {
  // only update users, that are known to have interacted with the bot
  // ToDo: remove connections between the user and the corresponding guild
  // ToDo: DM the removed user their overlay details, if they only used the bot in this guild and have custom html/css
  // ToDo: remove the user from the database, if they were not in any other guild

}

/**
 * Executed, whenever a user changes his details (nickname) for a guild.
 * @param {GuildMember} oldMember 
 * @param {GuildMember} newMember 
 */
function onGuildMemberUpdate(oldMember, newMember) {
  // only update users, that are known to have interacted with the bot
  // ToDo: update changed user details

}

/**
 * Executed, whenever a user changes his global details.
 * @param {User} oldUser 
 * @param {User} newUser 
 */
function onUserUpdate(oldUser, newUser) {
  // only update users, that are known to have interacted with the bot
  // ToDo: update changed user details

}


module.exports = {
  /**
  * @param {Client} discordClient
  */
  initialize: async (discordClient) => {
    await LogApplication('ClientEventHandler.Initialize', 'Initialize ClientHandler', LogStatus.Initialize, LogLevel.Debug, '', false);
    client = discordClient;

    if (!client) {
      await LogApplication('ClientEventHandler.Initialize', 'DiscordClient is null!', LogStatus.Error, LogLevel.Fatal, new Error().stack, false);
      process.exit(3);
    }

    await LogApplication('ClientEventHandler.Initialize', 'Initialize Discord.Events.ClientReady', LogStatus.Initialize, LogLevel.Trace);
    client.on(Events.ClientReady, onReady);
    await LogApplication('ClientEventHandler.Initialize', 'Initialize Discord.Events.Invalidated', LogStatus.Initialize, LogLevel.Trace);
    client.on(Events.Invalidated, onInvalidated);

    if (process.env.ENVIRONMENT == "DEVELOPMENT") {
      await LogApplication('ClientEventHandler.Initialize', 'Initialize Discord.Events.Debug', LogStatus.Initialize, LogLevel.Trace);
      client.on(Events.Debug, onDebug);
    }

    await LogApplication('ClientEventHandler.Initialize', 'Initialize Discord.Events.Warn', LogStatus.Initialize, LogLevel.Trace);
    client.on(Events.Warn, onWarn);
    await LogApplication('ClientEventHandler.Initialize', 'Initialize Discord.Events.Error', LogStatus.Initialize, LogLevel.Trace);
    client.on(Events.Error, onError);

    await LogApplication('ClientEventHandler.Initialize', 'Initialize Discord.Events.ChannelDelete', LogStatus.Initialize, LogLevel.Trace);
    client.on(Events.ChannelDelete, onChannelDelete);
    await LogApplication('ClientEventHandler.Initialize', 'Initialize Discord.Events.ChannelUpdate', LogStatus.Initialize, LogLevel.Trace);
    client.on(Events.ChannelUpdate, onChannelUpdate);

    await LogApplication('ClientEventHandler.Initialize', 'Initialize Discord.Events.GuildEmojiDelete', LogStatus.Initialize, LogLevel.Trace);
    client.on(Events.GuildEmojiDelete, onEmojiDelete);
    await LogApplication('ClientEventHandler.Initialize', 'Initialize Discord.Events.GuildEmojiUpdate', LogStatus.Initialize, LogLevel.Trace);
    client.on(Events.GuildEmojiUpdate, onEmojiUpdate);

    await LogApplication('ClientEventHandler.Initialize', 'Initialize Discord.Events.GuildCreate', LogStatus.Initialize, LogLevel.Trace);
    client.on(Events.GuildCreate, onGuildCreate);
    await LogApplication('ClientEventHandler.Initialize', 'Initialize Discord.Events.GuildUpdate', LogStatus.Initialize, LogLevel.Trace);
    client.on(Events.GuildUpdate, onGuildUpdate);
    await LogApplication('ClientEventHandler.Initialize', 'Initialize Discord.Events.GuildDelete', LogStatus.Initialize, LogLevel.Trace);
    client.on(Events.GuildDelete, onGuildDelete);

    await LogApplication('ClientEventHandler.Initialize', 'Initialize Discord.Events.GuildMemberRemove', LogStatus.Initialize, LogLevel.Trace);
    client.on(Events.GuildMemberRemove, onGuildMemberRemove);
    await LogApplication('ClientEventHandler.Initialize', 'Initialize Discord.Events.GuildMemberUpdate', LogStatus.Initialize, LogLevel.Trace);
    client.on(Events.GuildMemberUpdate, onGuildMemberUpdate);

    await LogApplication('ClientEventHandler.Initialize', 'Initialize Discord.Events.UserUpdate', LogStatus.Initialize, LogLevel.Trace);
    client.on(Events.UserUpdate, onUserUpdate);
  }
}