const { ClientContext } = require('../ClientHandlers/ClientContext');
const { LogMessage, LogStatus, LogLevel } = require('../../Modules/Log/Logger');

module.exports = {
  name: 'Started MK',
  alt: [],
  description: 'Resets overlay to zero when starting a new war with Toad Bot.',

  /**
   * 
   * @param {ClientContext} context 
   */
  execute: async(context) => {
    await LogMessage('ToadBot.Startwar.Execute', 'Starting a new war.', context, LogStatus.Executing);
    context.data.channel.ChannelData.update({
      home_current: 0,
      guest_current: 0
    }, {
      where: {
          channel_id: context.data.channel.id
      }
    })
    .catch((err) => {
      message.channel.send('There was an error setting up a new war...\nPlease try again...');
      LogMessage('ToadBot.Startwar.Execute', err, context, LogStatus.DBError, LogLevel.Error);
    });
  }
}
