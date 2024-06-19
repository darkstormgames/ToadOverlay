const { MessageContext } = require('../../../ClientHandlers/MessageContext');
const { LogApplication, LogMessage, LogStatus, LogLevel } = require('../../../Log/Logger');
const { Helper, UserChannel } = require('../../../Data/SQLWrapper');
const { SetupOverlay } = require('../../../Help/HelpTexts');
const Instructions = require('../../../Help/HelpInstructions');

module.exports = {
  name: 'setup-overlay',
  alt: ['setup'],
  description: '',

  /**
     * @param {MessageContext} context
     * @returns {Promise<void>}
     */
  async execute(context) {
    if (context.args && context.args.length == 1 && context.args[0] && (context.args[0] == 'help' || context.args[0] == '?')) {
      context.reply(SetupOverlay);
      return;
    }

    let userChannel = await Helper.checkUserChannel(context.message.author, context.message.channel, false);
    if (userChannel == null) {
      userChannel = await Helper.checkUserChannel(context.message.author, context.message.channel, false);
    }
    let hasOverlay = userChannel.isActive;

    if (!userChannel) {
      await LogMessage('Setup.Execute', 'Unable to find UserChannel', context, LogStatus.Failed, LogLevel.Warn);
      context.reply('There was an error creating your overlay.\n\nPlease try again later...');
    }

    if (!hasOverlay && !userChannel.isActive) { // create completely new entry
      await Helper.checkUserChannel(context.message.author, context.message.channel, true);
      await LogMessage('Setup.Execute', 'Executed with first entry.', context, LogStatus.Executed, LogLevel.Info);
      context.reply(`'${context.message.author.toString()} Your overlay for this channel has been created successfully.\nFurther instructions should be in your DMs.`);
      let text = Instructions.get(userChannel.auth, context.message.author, context.message.guild, context.message.channel);
      context.message.author.send({ embeds: [text.instructEmbed] });
      context.message.author.send({ embeds: [text.linkEmbed] });
    }
    else if (hasOverlay && !userChannel.isActive) { // create new without instructions
      await Helper.checkUserChannel(context.message.author, context.message.channel, true);
      await LogMessage('Setup.Execute', 'Executed with new entry.', context, LogStatus.Executed, LogLevel.Info);
      context.reply(`'${context.message.author.toString()} Your overlay for this channel has been created successfully.\nFurther instructions should be in your DMs.`);
      var text = Instructions.get(userChannel.auth, context.message.author, context.message.guild, context.message.channel);
      context.message.author.send({ embeds: [text.linkEmbed] });
    }
    else if (hasOverlay && userChannel.isActive) { // resend URL
      await LogMessage('Setup.Execute', 'Executed with existing entry.', context, LogStatus.Executed, LogLevel.Info);
      context.reply(`'${context.message.author.toString()} There already is an overlay for you on this channel!\nThe URL will be sent to you again.`);
      var text = Instructions.get(userChannel.auth, context.message.author, context.message.guild, context.message.channel);
      context.message.author.send({ embeds: [text.linkEmbed] });
    }
    else {
      await LogMessage('Setup.Execute', 'Unexpected overlay state.', context, LogStatus.Error, LogLevel.Error);
      context.reply('There was an error creating your overlay.\n\nPlease try again later...');
    }
  }
}