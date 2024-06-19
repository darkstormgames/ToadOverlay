const { MessageContext } = require('../../../ClientHandlers/MessageContext');
const { Channel } = require('../../../Data/SQLWrapper');
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
      Channel.update({
        guest_mkc_url: '',
        guest_tag: context.args[0]
      }, {
        where: {
          id: context.data.channel.id
        }
      })
      .catch((err) => {
        context.reply('There was an error setting the tag for the guest-team!\nPlease try again.');
        LogMessage('GuestTag.Execute', err, context, LogStatus.DBError, LogLevel.Error);
        return;
      })
      .then(() => {
        context.reply('Custom tag for the guest team has been set successfully.');
        LogMessage('GuestTag.Execute', 'Guest tag set.', context, LogStatus.Executed, LogLevel.Info);
      })
      .catch((err) => {
        context.reply('There was an error setting the tag for the guest-team!\nPlease try again.');
        LogMessage('GuestTag.Execute', err, context, LogStatus.DiscordWarn, LogLevel.Warn);
      });
    }
    else {
      context.reply('No valid tag given!\n```Example:\n  _settag-guest N/A```');
    }
  }
}