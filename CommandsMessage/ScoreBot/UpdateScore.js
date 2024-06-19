const { MessageContext } = require('../../ClientHandlers/MessageContext');
const { LogMessage, LogStatus, LogLevel } = require('../../Log/Logger');

module.exports = {
  name: 'Total Score after Race',
  alt: [],
  description: '',

  /**
   * @param {MessageContext} context 
   */
  execute: async (context) => {
    context.message.embeds.forEach((value) => {
      if (value.title && value.title.startsWith('Total Score after Race')) {
        LogMessage('UpdateScore.Execute', `Updating Scores (${value.fields[0].value} - ${value.fields[1].value})`, context, LogStatus.Executing, LogLevel.Debug);
        context.data.channel.update({
          home_current: value.fields[0].value,
          guest_current: value.fields[1].value
        })
        .catch((err) => {
          context.reply('There was an error updating scores...\nPlease try again next race...');
          LogMessage('UpdateScore.Execute', err, context, LogStatus.DBError, LogLevel.Error);
        });
      }
    });
  }
}