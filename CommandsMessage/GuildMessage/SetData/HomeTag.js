const { MessageContext } = require('../../../ClientHandlers/MessageContext');
const { Channel } = require('../../../Data/SQLWrapper');
const { LogMessage, LogLevel, LogStatus } = require('../../../Log/Logger');

module.exports = {
  name: 'settag-home',
  alt: ['hsettag', 'htag', 'tag-home'],
  description: 'Overrides the tag displayed on the overlay in the given channel.',

  /**
   * @description execution of the command
   * @param {MessageContext} context
   */
  execute: async (context) => {
    if (context.args && context.args.length > 0) {
      Channel.update({
        home_mkc_url: '',
        home_tag: context.args[0]
      }, {
        where: {
          id: context.data.channel.id
        }
      })
      .catch((err) => {
        context.reply('There was an error setting the tag for the home-team!\nPlease try again.');
        LogMessage('HomeTag.Execute', err, context, LogStatus.DBError, LogLevel.Error);
        return;
      })
      .then(() => {
        context.reply('Custom tag for the home team has been set successfully.');
        LogMessage('HomeTag.Execute', 'Home tag set.', context, LogStatus.Executed, LogLevel.Info);
      })
      .catch((err) => {
        context.reply('There was an error setting the tag for the home-team!\nPlease try again.');
        LogMessage('HomeTag.Execute', err, context, LogStatus.DiscordWarn, LogLevel.Warn);
      });
    }
    else {
      context.reply('No valid tag given!\n```Example:\n  _settag-home N/A```');
    }
  }
}