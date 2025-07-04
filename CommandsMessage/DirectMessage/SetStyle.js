const { MessageContext } = require('../../ClientHandlers/MessageContext');
const { Profile, invalidateUserCache } = require('../../Data/SQLWrapper');
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
    try {
      await Profile.update({
        css: context.args
      }, {
        where: {
          user_id: context.message.author.id
        }
      });

      await invalidateUserCache(context.message.author.id);
      await context.reply('Your CSS styles have been updated. Refresh your overlay to see the changes.');
    } catch (err) {
      await context.reply('There was an error updating your styles...\nPlease try again later.');
      LogDM('SetStyle.Execute', 'Failed to update or reply.', { error: err, args: context.args }, context.message.author, LogStatus.DBError, LogLevel.Warn);
    }
  }
}