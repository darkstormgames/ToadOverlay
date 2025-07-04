const { MessageContext } = require('../../../ClientHandlers/MessageContext');
const { Channel, invalidateChannelCache } = require('../../../Data/SQLWrapper');
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
      try {
        await Channel.update({
          guest_mkc_url: '',
          guest_img: context.message.attachments.values().next().value.proxyURL
        }, {
          where: {
            id: context.data.channel.id
          }
        });
        await invalidateChannelCache(context.data.channel.id);
        await context.reply('Custom logo for the guest team has been set successfully from uploaded image.');
      } catch (err) {
        context.reply('There was an error setting the logo for the guest-team!\nPlease try again.');
        LogMessage('GuestLogo.FromImage', err, context, LogStatus.DBError, LogLevel.Error);
      }
    }
    else if (context.args && context.args.length > 0) {
      try {
        await Channel.update({
          guest_mkc_url: '',
          guest_img: context.args[0]
        }, {
          where: {
            id: context.data.channel.id
          }
        });
        await invalidateChannelCache(context.data.channel.id);
        await context.reply('Custom logo for the guest team has been set successfully from URL.');
      } catch (err) {
        context.reply('There was an error setting the logo for the guest-team!\nPlease try again.');
        LogMessage('GuestLogo.FromURL', err, context, LogStatus.DBError, LogLevel.Error);
      }
    }
    else {
      context.reply('No valid logo given!\nTo set a logo, either upload an image with the command, or provide a URL.');
    }
  }
}