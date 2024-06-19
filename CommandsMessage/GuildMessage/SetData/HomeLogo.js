const { MessageContext } = require('../../../ClientHandlers/MessageContext');
const { Channel } = require('../../../Data/SQLWrapper');
const { LogMessage, LogLevel, LogStatus } = require('../../../Log/Logger');

module.exports = {
  name: 'setlogo-home',
  alt: ['hsetlogo', 'hlogo', 'logo-home'],
  description: 'Overrides the logo displayed on the overlay in the given channel.',

  /**
   * @description execution of the command
   * @param {MessageContext} context
   */
  execute: async (context) => {
    if (context.message.attachments.size > 0) {
      Channel.update({
        home_mkc_url: '',
        home_img: context.message.attachments.values().next().value.proxyURL
      }, {
        where: {
          id: context.data.channel.id
        }
      })
      .catch((err) => {
        context.reply('There was an error setting the logo for the home-team!\nPlease try again.');
        LogMessage('HomeLogo.FromImage', err, context, LogStatus.DBError, LogLevel.Error);
        return;
      })
      .then(() => {
        context.reply('Custom logo for the home team has been set successfully from uploaded image.');
        LogMessage('HomeLogo.FromImage', 'Home logo set.', context, LogStatus.Executed, LogLevel.Info);
      })
      .catch((err) => {
        context.reply('There was an error setting the logo for the home-team!\nPlease try again.');
        LogMessage('HomeLogo.FromImage', err, context, LogStatus.DiscordWarn, LogLevel.Warn);
      });
    }
    else if (context.args && context.args.length > 0) {
      Channel.update({
        home_mkc_url: '',
        home_img: context.args[0]
      }, {
        where: {
          id: context.data.channel.id
        }
      })
      .catch((err) => {
        context.reply('There was an error setting the logo for the home-team!\nPlease try again.');
        LogMessage('HomeLogo.FromURL', err, context, LogStatus.DBError, LogLevel.Error);
        return;
      })
      .then(() => {
        context.reply('Custom logo for the home team has been set successfully from URL.');
        LogMessage('HomeLogo.FromURL', 'Home logo set.', context, LogStatus.Executed, LogLevel.Info);
      })
      .catch((err) => {
        context.reply('There was an error setting the logo for the home-team!\nPlease try again.');
        LogMessage('HomeLogo.FromURL', err, context, LogStatus.DiscordWarn, LogLevel.Warn);
      });
    }
    else {
      Channel.update({
        home_mkc_url: '',
        home_img: ''
      }, {
        where: {
          id: context.data.channel.id
        }
      })
      .catch((err) => {
        context.reply('There was an error removing the logo for the home-team!\nPlease try again.');
        LogMessage('HomeLogo.Remove', err, context, LogStatus.DBError, LogLevel.Error);
        return;
      })
      .then(() => {
        context.reply('Custom logo for the home team has been removed successfully.');
        LogMessage('HomeLogo.Remove', 'Home logo removed.', context, LogStatus.Executed, LogLevel.Info);
      })
      .catch((err) => {
        context.reply('There was an error removing the logo for the home-team!\nPlease try again.');
        LogMessage('HomeLogo.Remove', err, context, LogStatus.DiscordWarn, LogLevel.Warn);
      });
    }
  }
}