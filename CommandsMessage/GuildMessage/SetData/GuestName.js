const { MessageContext } = require('../../../ClientHandlers/MessageContext');
const { Channel, invalidateChannelCache } = require('../../../Data/SQLWrapper');
const { LogMessage, LogLevel, LogStatus } = require('../../../Log/Logger');

module.exports = {
  name: 'setname-guest',
  alt: ['gsetname', 'gname', 'name-guest'],
  description: 'Overrides the name displayed on the overlay in the given channel.',

  /**
   * @description execution of the command
   * @param {MessageContext} context
   */
  execute: async (context) => {
    if (context.args && context.args.length > 0) {
      try {
        await Channel.update({
          guest_mkc_url: '',
          guest_name: context.args[0]
        }, {
          where: {
            id: context.data.channel.id
          }
        });
        await invalidateChannelCache(context.data.channel.id);
        await context.reply('Custom name for the guest team has been set successfully.');
      } catch (err) {
        context.reply('There was an error setting the name for the guest-team!\nPlease try again.');
        LogMessage('GuestName.Execute', err, context, LogStatus.DBError, LogLevel.Error);
      }
    }
    else {
      context.reply('No valid name given!\n```Example:\n  _setname-guest N/A```');
    }
  }
}