const { CommandInteraction, CommandInteractionOptionResolver } = require('discord.js');
const { DataContext } = require('./DataContext');

///**
// * @typedef {Object} CommandContext
// */
class CommandContext {
  /**
   * @param {CommandInteraction} interaction 
   * @param {DataContext} dataContext 
   */
  constructor(interaction, dataContext) {
    this.interaction = interaction;
    this.data = dataContext;
  }

  /**
   * @type {CommandInteraction}
   */
  interaction;

  /**
   * @type {DataContext}
   */
  data;

  /**
   * @type {Omit<CommandInteractionOptionResolver<Cached>, | 'getMessage' | 'getFocused' | 'getMentionable' | 'getRole' | 'getUser' | 'getMember' | 'getAttachment' | 'getNumber' | 'getInteger' | 'getString' | 'getChannel' | 'getBoolean' | 'getSubcommandGroup' | 'getSubcommand' | null>}
   */
  get options() {
    if (this.interaction && this.interaction.options) {
      return this.interaction.options;
    } else {
      return null;
    }
  }
}

module.exports.CommandContext = CommandContext;