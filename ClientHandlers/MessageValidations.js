const { Message, User } = require('discord.js');

module.exports = {
  /**
   * Checks, if the given message is a command executed as a user
   * @param {Message} message
   */
  isUserCommand: (message) => {
      if (message.content.startsWith(process.env.PREFIX) && !message.author.bot && message.guild !== null)
              return true;
      else
          return false;
  },

  /**
   * Checks, if the given message is a command executed as a user in private messages
   * @param {Message} message
   */
  isPrivateMessage: (message) => {
      if (!message.content.startsWith(process.env.PREFIX) 
          && !message.author.bot 
          && message.guild === null)
              return true;
      else
          return false;
  },

  /**
   * Checks, if the given message is a command executed as the Toad bot
   * @param {Message} message
   */
  isToadMessage: (message) => {
      if ((message.author.id == 177162177432649728n || message.author.id == 726933780677394532n)
          && message.author.bot)
              return true;
      else
          return false;
  },

  /**
   * Checks, if the given message is a keepalive message
   * @param {Message} message
   */
  isKeepaliveMessage: (message) => {
      if (message.author.id == process.env.BOT_ID 
          && message.author.bot
          && message.content == 'keepalive...')
              return true;
      else
          return false;
  }
};