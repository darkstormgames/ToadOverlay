const { MessageContext } = require('../../../ClientHandlers/MessageContext');
const { MKCSetHome } = require('../../../Help/HelpTexts');
const { LogMessage, LogStatus, LogLevel } = require('../../../Log/Logger');
const { SetHomeTeam } = require('../../../Modules/SetMKCTeam');

module.exports = {
  name: 'setmkc-home',
  alt: ['home', 'setmkchome', 'set-home', 'sethome', 'mkc-home', 'mkchome'], // ToDo: Check usage of alt-commands
  description: 'Set the home team from the given mkc identifier.',

  /**
   * 
   * @param {MessageContext} context 
   */
  execute: async(context) => {
    if (!context.args[0]) {
      context.reply('There was an error setting the home-team!\nPlease try again with a valid team-id from MKC.');
      LogMessage('SetHome.Execute', 'No argument given!', context, LogStatus.Failed, LogLevel.Warn);
      return;
    }
    else if (context.args[0] == 'help') {
      context.reply(MKCSetHome);
      return;
    }

    let value = context.args[0].split('/')[context.args[0].split('/').length - 1];
    if (/^\d+$/.test(value) == false) {
      context.reply('There was an error setting the home-team!\nPlease try again with a valid team-id from MKC.');
      LogMessage('SetHome.Execute','Team-Id parsing failed!', context, LogStatus.Failed, LogLevel.Warn);
      return;
    }

    SetHomeTeam(value, context);
  }
}