const { MessageContext } = require('../../../ClientHandlers/MessageContext');
const { Channel } = require('../../../Data/SQLWrapper');
const { LogMessage, LogLevel, LogStatus } = require('../../../Log/Logger');

module.exports = {
  name: 'setlogo-guest',
  alt: ['gsetlogo', 'glogo', 'logo-guest'],
  description: 'Overrides the logo displayed on the overlay in the given channel.',

  /**
   * @description execution of the command
   * @param {MessageContext} context
   */
  execute: async (context) => {
    if (context.message.attachments.size > 0) {
      Channel.update({
        guest_mkc_url: '',
        guest_img: context.message.attachments.values().next().value.proxyURL
      }, {
        where: {
          id: context.data.channel.id
        }
      })
      .catch((err) => {
        context.reply('There was an error setting the logo for the guest-team!\nPlease try again.');
        LogMessage('GuestLogo.FromImage', err, context, LogStatus.DBError, LogLevel.Error);
        return;
      })
      .then(() => {
        context.reply('Custom logo for the guest team has been set successfully from uploaded image.');
        LogMessage('GuestLogo.FromImage', 'Guest logo set.', context, LogStatus.Executed, LogLevel.Info);
      })
      .catch((err) => {
        context.reply('There was an error setting the logo for the guest-team!\nPlease try again.');
        LogMessage('GuestLogo.FromImage', err, context, LogStatus.DiscordWarn, LogLevel.Warn);
      });
    }
    else if (context.args && context.args.length > 0) {
      Channel.update({
        guest_mkc_url: '',
        guest_img: context.args[0]
      }, {
        where: {
          id: context.data.channel.id
        }
      })
      .catch((err) => {
        context.reply('There was an error setting the logo for the guest-team!\nPlease try again.');
        LogMessage('GuestLogo.FromURL', err, context, LogStatus.DBError, LogLevel.Error);
        return;
      })
      .then(() => {
        context.reply('Custom logo for the guest team has been set successfully from URL.');
        LogMessage('GuestLogo.FromURL', 'Guest logo set.', context, LogStatus.Executed, LogLevel.Info);
      })
      .catch((err) => {
        context.reply('There was an error setting the logo for the guest-team!\nPlease try again.');
        LogMessage('GuestLogo.FromURL', err, context, LogStatus.DiscordWarn, LogLevel.Warn);
      });
    }
    else {
      Channel.update({
        guest_mkc_url: '',
        guest_img: ''
      }, {
        where: {
          id: context.data.channel.id
        }
      })
      .catch((err) => {
        context.reply('There was an error removing the logo for the guest-team!\nPlease try again.');
        LogMessage('GuestLogo.Remove', err, context, LogStatus.DBError, LogLevel.Error);
        return;
      })
      .then(() => {
        context.reply('Custom logo for the guest team has been removed successfully.');
        LogMessage('GuestLogo.Remove', 'Guest logo removed.', context, LogStatus.Executed, LogLevel.Info);
      })
      .catch((err) => {
        context.reply('There was an error removing the logo for the guest-team!\nPlease try again.');
        LogMessage('GuestLogo.Remove', err, context, LogStatus.DiscordWarn, LogLevel.Warn);
      });
    }
  }
}