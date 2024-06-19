const { MessageContext } = require('../../ClientHandlers/MessageContext');
const Data = require('../../Data/SQLWrapper');
const { LogDM, LogLevel, LogStatus } = require('../../Log/Logger');

module.exports = {
  name: 'setstyle',
  alt: ['style', 'css'],
  description: '',

  /**
   * 
   * @param {MessageContext} context 
   */
  execute: async (context) => {
    Data.Profile.update({
      css: context.args
    }, {
      where: {
        user_id: context.message.author.id
      }
    })
    .catch((err) => {
      context.reply('There was an error updating your styles...\nPlease try again later.');
      LogDM('SetStyle.Execute', 'Failed to update database entry.', context.args, context.message.author, LogStatus.DBError, LogLevel.Warn);
      return;
    })
    .then(() => {
      context.reply('Your CSS styles have been updated. Refresh your overlay to see the changes.');
    })
    .catch((err) => {
      context.reply('There was an error updating your styles...\nPlease try again later.');
      LogDM('SetStyle.Execute', 'Failed to reply.', context.args, context.message.author, LogStatus.DiscordWarn, LogLevel.Warn);
    });
  }
}