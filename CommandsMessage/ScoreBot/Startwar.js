const { MessageContext } = require('../../ClientHandlers/MessageContext');
const { LogMessage, LogStatus, LogLevel } = require('../../Log/Logger');

module.exports = {
  name: 'Started MK',
  alt: ['started war between'],
  description: 'Resets overlay to zero when starting a new war with Toad Bot.',

  /**
   * 
   * @param {MessageContext} context 
   */
  execute: async(context) => {
    await LogMessage('Startwar.Execute', 'Starting a new war.', context, LogStatus.Executing);
    context.data.channel.update({
      home_current: 0,
      guest_current: 0
    })
    .catch((err) => {
      message.channel.send('There was an error setting up a new war...\nPlease try again...');
      LogMessage('Startwar.Execute', err, context, LogStatus.DBError, LogLevel.Error);
    });
  }
}
