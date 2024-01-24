const { MessageContext } = require('../../../ClientHandlers/MessageContext');
const Help = require('../../../Help/HelpTexts');

module.exports = {
    name: 'help',
    alt: ['?'],
    description: 'Get some basic help on commands.',

    /**
     * @param {MessageContext} context
     * @returns {Promise<void>}
     */
    async execute(context) {
        if (!context.args || (context.args && context.args.length == 0)) {
            if (context.message.content == process.env.PREFIX + 'help') {
                context.reply(   '```' + 
                                        'Setup/Basic commands:\n' +
                                        '  _setup\n' +
                                        '  _delete\n' +
                                        '  _reset\n' +
                                        '  _home\n' +
                                        '  _guest\n' +
                                        'Overlay override commands:\n' +
                                        '  _hlogo\n' +
                                        '  _glogo\n' +
                                        '  _hname\n' +
                                        '  _gname\n' +
                                        '  _htag\n' +
                                        '  _gtag\n' +
                                        'Other commands:\n' +
                                        '  _war\n' +
                                        '  _fc\n' +
                                        '  _track\n\n' +
                                        'For more help on commands, type `_?`.```');
            }
            else if (context.message.content == process.env.PREFIX + '?') {
                context.reply(Help.OverlaySetup);
                context.reply(Help.OverlayOverride);
                context.reply(Help.OtherCommands);
            }
        }
        else if (context.args && context.args.length == 1) {
            let cmd = context.args[0].replace('_', '');
            switch(cmd) {
                // setup commands
                case 'setup-overlay':
                case 'setup':
                    context.reply(Help.SetupOverlay);
                    break;
                case 'delete-overlay':
                case 'delete':
                    context.reply(Help.DeleteOverlay);
                    break;
                case 'reset-scores':
                case 'reset':
                    context.reply(Help.ResetOverlay);
                    break;
                case 'setmkc-home':
                case 'home':
                    context.reply(Help.MKCSetHome);
                    break;
                case 'setmkc-guest':
                case 'guest':
                    context.reply(Help.MKCSetGuest);
                    break;
                
                // override commands
                case 'setlogo-home':
                case 'hlogo':
                    context.reply(Help.OverrideHomeLogo);
                    break;
                case 'setlogo-guest':
                case 'glogo':
                    context.reply(Help.OverrideGuestLogo);
                    break;
                case 'setname-home':
                case 'hname':
                    context.reply(Help.OverrideHomeName);
                    break;
                case 'setname-guest':
                case 'gname':
                    context.reply(Help.OverrideGuestName);
                    break;
                case 'settag-home':
                case 'htag':
                    context.reply(Help.OverrideHomeTag);
                    break;
                case 'settag-guest':
                case 'gtag':
                    context.reply(Help.OverrideGuestTag);
                    break;

                // other commands
                case 'schedulewar':
                case 'war':
                    context.reply(Help.ScheduleWar);
                    break;
                case 'friendcode':
                case 'fc':
                    context.reply(Help.Friendcode);
                    break;
                case 'tracktable':
                case 'track':
                    context.reply(Help.Tracktable);
                    break;
                
                default:
                    context.reply('Unknown command...\nTry `_?` for help on available commands.');
                    break;
            }
        }
        else if (context.args && context.args.length == 2) {
            if (context.args[0] == 'schedulewar' || context.args[0] == 'war') {
                if (context.args[1] == 'setdefault') {
                    context.reply(Help.ScheduleWarDefault);
                }
                else if (context.args[1] == 'settimeout') {
                    context.reply(Help.ScheduleWarTimeout)
                }
                else {
                    context.reply('Unknown command...\nTry `_?` for help on available commands.');
                }
            }
        }
        else {
            context.reply('Unknown command...\nTry `_?` for help on available commands.');
        }
    }
};
