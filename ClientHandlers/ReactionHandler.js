const { Events, MessageReaction, PermissionsBitField, User } = require('discord.js');
const { LogApplication, LogStatus, LogLevel } = require('../Log/Logger');
const { addCan, addCant, addNotSure, addSub, removeEntry } = require('../Modules/WarScheduling');

/**
 * @param {MessageReaction} reaction 
 * @param {User} user 
 */
async function handleReactions(reaction, user) {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    }
    catch (err) {
      return;
    }
  }
  
  if (!user.bot && user.id != reaction.client.user.id && reaction.message.author.id == reaction.client.user.id) {
    if (reaction.message.guild) { // reaction in guild channel on bot's message from user
      if (reaction.message.embeds && reaction.message.embeds[0] && reaction.message.embeds[0].title.startsWith('**War')) {
        let guildMember = await reaction.message.guild.members.fetch({ user });
        switch (reaction.emoji.name) {
          case '✅':
            addCan(reaction.message, guildMember);
            break;
          case '❌':
            addCant(reaction.message, guildMember);
            break;
          case '❕':
            addSub(reaction.message, guildMember);
            break;
          case '❔':
            addNotSure(reaction.message, guildMember);
            break;
          case '♿':
            removeEntry(reaction.message, guildMember);
            break;
        }

        if (reaction.message.channel.permissionsFor(reaction.message.guild.members.me).has([ PermissionsBitField.Flags.ManageMessages ])) {
          reaction.users.cache.forEach(reactionUser => {
            if (reactionUser.id != reaction.message.client.user.id) {
              try {
                reaction.users.remove(reactionUser.id);
              }
              catch {
                Log('ClientHandler.HandleReactions', `Failed to remove ${reactionUser.displayName} (${reactionUser.id}) from ${reaction.message.embeds[0].title} (${reaction.message.id}) in ${reaction.message.channel.name} (${reaction.message.channel.id})`, LogStatus.Failed, LogLevel.Warn);
              }
            }
          });
        }
      }
    }
  }
}

module.exports = {
  Initialize: async (discordClient) => {
    await LogApplication('ReactionHandler.Initialize', 'Initialize ReactionHandler', LogStatus.Initialize, LogLevel.Trace);

    if (discordClient == null) {
      await LogApplication('ReactionHandler.Initialize', 'DiscordClient is null!', LogStatus.Error, LogLevel.Fatal, new Error().stack, false);
      process.exit(1)
    }

    discordClient.on(Events.MessageReactionAdd, handleReactions);
  }
}