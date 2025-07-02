const { Events, MessageReaction, PermissionsBitField, User } = require('discord.js');
const { LogApplication, LogReaction, LogStatus, LogLevel } = require('../Log/Logger');
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
        
        // Log the war reaction event
        await LogReaction('ReactionHandler.HandleWarReaction',
          'War scheduling reaction received',
          {
            emoji: reaction.emoji.name,
            messageId: reaction.message.id,
            userId: user.id,
            channelId: reaction.message.channel.id,
            guildId: reaction.message.guild.id
          },
          LogStatus.Executing, LogLevel.Debug);
        
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
                LogApplication('ClientHandler.HandleReactions', `Failed to remove ${reactionUser.displayName} (${reactionUser.id}) from ${reaction.message.embeds[0].title} (${reaction.message.id}) in ${reaction.message.channel.name} (${reaction.message.channel.id})`, LogStatus.Failed, LogLevel.Warn);
              }
            }
          });
        }
      }
    } else { // reaction in DM channel on bot's message from user
      if (reaction.emoji.name === '❌') {
        try {
          await LogApplication('ReactionHandler.HandleDMReaction', 
            `User ${user.displayName} (${user.id}) requested deletion of bot message (${reaction.message.id}) in DM`, 
            LogStatus.Executing, LogLevel.Info);
          
          // Log the reaction event for debugging and tracking
          await LogReaction('ReactionHandler.HandleDMReaction',
            'DM message deletion requested',
            {
              emoji: reaction.emoji.name,
              messageId: reaction.message.id,
              userId: user.id,
              channelId: null,
              guildId: null
            },
            LogStatus.Executing, LogLevel.Debug);
          
          await reaction.message.delete();
          
          await LogApplication('ReactionHandler.HandleDMReaction', 
            `Successfully deleted bot message (${reaction.message.id}) in DM with ${user.displayName} (${user.id})`, 
            LogStatus.Executed, LogLevel.Info);
            
          // Log successful deletion
          await LogReaction('ReactionHandler.HandleDMReaction',
            'DM message deletion completed',
            {
              emoji: reaction.emoji.name,
              messageId: reaction.message.id,
              userId: user.id,
              channelId: null,
              guildId: null
            },
            LogStatus.Executed, LogLevel.Debug);
            
        } catch (error) {
          await LogApplication('ReactionHandler.HandleDMReaction', 
            `Failed to delete bot message (${reaction.message.id}) in DM with ${user.displayName} (${user.id}): ${error.message}`, 
            LogStatus.Failed, LogLevel.Error, error.stack);
            
          // Log failed deletion
          await LogReaction('ReactionHandler.HandleDMReaction',
            `DM message deletion failed: ${error.message}`,
            {
              emoji: reaction.emoji.name,
              messageId: reaction.message.id,
              userId: user.id,
              channelId: null,
              guildId: null
            },
            LogStatus.Failed, LogLevel.Error);
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