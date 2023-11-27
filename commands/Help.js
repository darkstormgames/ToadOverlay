const { Message, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { Log, LogStatus, LogLevel } = require('../log/Logger');
const { getRandomColor } = require('../ColorHelper');
const fs = require('fs');

module.exports = {
  name: 'help',
  alt: ['?'],
  description: '',

  /**
   * @param {Message} message 
   * @param {string[]} args 
   */
  execute: async (message, args) => {
    message.channel.send(
      'The bot is currently under maintenance, because something went horribly wrong.\n' + 
      'I\'ll gradually rebuild the bot in the next few days, but most commands will not be available until I\'m done with database migration and testing.\n\n' + 
      'Available commands:\n' + 
      '```' + 
      'Scheduling matches:\n' + 
      '  _schedulewar\n  _war\n\n' + 
      'Setting new default times:\n' + 
      '  _schedulewar setdefault 8pm 11am 20 21\n  _war setdefault 20 22 9pm 10pm\n' + 
      'If you\'ve previously set default times, you have to do so again for now.'
      + '```' + 
      'For more information on how to use available commands, refer to the tutorial on MKC:\nhttps://www.mariokartcentral.com/forums/index.php?threads/toadoverlay-an-extension-bot-to-toad-for-streamers-and-more.10749/');
  }
}