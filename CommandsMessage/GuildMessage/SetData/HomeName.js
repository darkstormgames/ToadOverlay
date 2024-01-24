const { MessageContext } = require('../../../ClientHandlers/MessageContext');
const { Channel } = require('../../../Data/SQLWrapper');
const { LogMessage, LogLevel, LogStatus } = require('../../../Log/Logger');

module.exports = {
  name: 'setname-home',
  alt: ['hsetname', 'hname', 'name-home'],
  description: 'Overrides the name displayed on the overlay in the given channel.',

  /**
   * @description execution of the command
   * @param {MessageContext} context
   */
  execute: async (context) => {
    if (context.args && context.args.length > 0) {
      Channel.update({
        home_mkc_url: '',
        home_name: context.args[0]
      }, {
        where: {
          id: context.data.channel.id
        }
      })
      .catch((err) => {
        context.reply('There was an error setting the name for the home-team!\nPlease try again.');
        LogMessage('HomeName.Execute', err, context, LogStatus.DBError, LogLevel.Error);
        return;
      })
      .then(() => {
        context.reply('Custom name for the home team has been set successfully.');
        LogMessage('HomeName.Execute', 'Home name set.', context, LogStatus.Executed, LogLevel.Info);
      })
      .catch((err) => {
        context.reply('There was an error setting the name for the home-team!\nPlease try again.');
        LogMessage('HomeName.Execute', err, context, LogStatus.DiscordWarn, LogLevel.Warn);
      });
    }
    else {
      context.reply('No valid name given!\n```Example:\n  _setname-home N/A```');
    }
  }
}