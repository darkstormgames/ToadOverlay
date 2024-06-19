const { MessageContext } = require('../../../ClientHandlers/MessageContext');
const { MKCSetGuest } = require('../../../Help/HelpTexts');
const { LogMessage, LogStatus, LogLevel } = require('../../../Log/Logger');
const { SetGuestTeam } = require('../../../Modules/SetMKCTeam');

module.exports = {
  name: 'setmkc-guest',
  alt: ['guest', 'setmkcguest', 'set-guest', 'setguest', 'mkc-guest', 'mkcguest'], // ToDo: Check usage of alt-commands
  description: 'Set the guest team from the given mkc identifier.',

  /**
   * 
   * @param {MessageContext} context 
   */
  execute: async(context) => {
    if (!context.args[0]) {
      context.reply('There was an error setting the guest-team!\nPlease try again with a valid team-id from MKC.');
      LogMessage('SetGuest.Execute', 'No argument given!', context, LogStatus.Failed, LogLevel.Warn);
      return;
    }
    else if (context.args[0] == 'help') {
      context.reply(MKCSetGuest);
      return;
    }

    let value = context.args[0].split('/')[context.args[0].split('/').length - 1];
    if (/^\d+$/.test(value) == false) {
      context.reply('There was an error setting the guest-team!\nPlease try again with a valid team-id from MKC.');
      LogMessage('SetGuest.Execute','Team-Id parsing failed!', context, LogStatus.Failed, LogLevel.Warn);
      return;
    }

    SetGuestTeam(value, context);
  }
}