const { MessageContext } = require('../../../ClientHandlers/MessageContext');
const { Channel, invalidateChannelCache } = require('../../../Data/SQLWrapper');
const { LogMessage, LogLevel, LogStatus } = require('../../../Log/Logger');

module.exports = {
  name: 'settag-guest',
  alt: ['gsettag', 'gtag', 'tag-guest'],
  description: 'Overrides the tag displayed on the overlay in the given channel.',

  /**
   * @description execution of the command
   * @param {MessageContext} context
   */
  execute: async (context) => {
    if (context.args && context.args.length > 0) {
      try {
        await Channel.update({
          guest_mkc_url: '',
          guest_tag: context.args[0]
        }, {
          where: {
            id: context.data.channel.id
          }
        });
        await invalidateChannelCache(context.data.channel.id);
        await context.reply('Custom tag for the guest team has been set successfully.');
      } catch (err) {
        context.reply('There was an error setting the tag for the guest-team!\nPlease try again.');
        LogMessage('GuestTag.Execute', err, context, LogStatus.DBError, LogLevel.Error);
      }
    }
    else {
      context.reply('No valid tag given!\n```Example:\n  _settag-guest N/A```');
    }
  }
}