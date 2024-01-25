const { EmbedBuilder } = require('discord.js');
const { MessageContext } = require('../../../ClientHandlers/MessageContext');
const { getRandomColor } = require('../../../Help/ColorHelper');

module.exports = {
  name: 'status',
  alt: [],
  description: '',

  /**
     * @param {MessageContext} context
     * @returns {Promise<void>}
     */
  async execute(context) {
    let colorCode = getRandomColor(context.data.user.id, context.data.guild.id, context.data.channel.id);

    let statusEmbed = new EmbedBuilder()
      .setColor(colorCode)
      .setTitle('Current Status of ToadOverlay')
      .setDescription('Hey all, Rollo here.\nThe bot has been in a dire state for a while now and after a lot of procrastinating (damn you, Baldur\'s Gate) I finally managed to fix some features and will continue to do so, until it is fully running again.\n\nBelow is a small overview on what should work by now, and what\'s still to be done.\n')
      .addFields(
        {
          name: 'Implemented and tested commands',
          value: '```' + 
            '_setup\n' +
            '_setmkc-home (alt: _home)\n' +
            '_setlogo_home (alt: _hlogo)\n' +
            '_settag_home (alt: _htag)\n' +
            '_setname_home (alt: _hname)\n' +
            '_setmkc-guest (alt: _guest)\n' +
            '_setlogo_guest (alt: _glogo)\n' +
            '_settag_guest (alt: _gtag)\n' +
            '_setname_guest (alt: _gname)\n' +
            '_track (up to wave 3, needs an update)\n' +
            '_war\n' +
            '_help (alt: _?)\n' +
            '\n' +
            'Any updates to the overlay from Toad and Quaxly' +
            '```'
        },
        {
          name: 'Implemented, but untested',
          value: '```Any command to customize your overlay in DMs\n html [html body]\n style [css styles]\n img [background image URL]```'
        },
        {
          name: 'Not yet implemented',
          value: '```' + 
            'Slash commands (/home and /guest)\n' +
            'Friendcode stuff (it was pretty bad, anyways...)' +
            '```'
        },
        {
          name: 'Support',
          value: 'To get some basic help for the commands, type `_?` for more information.\nIf you have any problems, feel free to DM me what went wrong @ rollo_dev'
        }
      )
      .setTimestamp()
      .setFooter({ text: '© darkstormgames 2024' });

    context.reply({embeds: [statusEmbed]});
  }
}