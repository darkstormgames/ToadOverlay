const { ClientContext } = require('../ClientHandlers/ClientContext');
const { LogMessage, LogStatus, LogLevel } = require('../../Modules/Log/Logger');

module.exports = {
  name: 'Total Score after Race',
  alt: [],
  description: '',

  /**
   * @param {ClientContext} context 
   */
  execute: async (context) => {
    context.message.embeds.forEach((value) => {
      if (value.title && value.title.startsWith('Total Score after Race')) {
        LogMessage('ToadBot.UpdateScore.Execute', `Updating Scores (${value.fields[0].value} - ${value.fields[1].value})`, context, LogStatus.Executing, LogLevel.Debug);
        context.data.channel.ChannelData.update({
          home_current: value.fields[0].value,
          guest_current: value.fields[1].value
        }, {
          where: {
              channel_id: context.data.channel.id
          }
        })
        .catch((err) => {
          context.message.channel.send('There was an error updating scores...\nPlease try again next race...');
          LogMessage('ToadBot.Startwar.Execute', err, context, LogStatus.DBError, LogLevel.Error);
        });
      }
    });
  }
}