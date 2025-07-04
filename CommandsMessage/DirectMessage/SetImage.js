const { MessageContext } = require('../../ClientHandlers/MessageContext');
const { Profile, invalidateUserCache } = require('../../Data/SQLWrapper');
const { LogDM, LogLevel, LogStatus } = require('../../Log/Logger');

module.exports = {
  name: 'setimage',
  alt: ['image', 'img'],
  description: '',

  /**
   * 
   * @param {MessageContext} context 
   */
  execute: async (context) => {
    try {
      await Profile.update({
        bg_url: context.args
      }, {
        where: {
          user_id: context.message.author.id
        }
      });

      await invalidateUserCache(context.message.author.id);
      await context.reply('Your background image has been updated. Refresh your overlay to see the changes.');
    } catch (err) {
      await context.reply('There was an error updating your background image...\nPlease try again later.');
      LogDM('SetImage.Execute', 'Failed to update or reply.', { error: err, args: context.args }, context.message.author, LogStatus.DBError, LogLevel.Warn);
    }
  }
}