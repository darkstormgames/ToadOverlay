const Discord = require('discord.js');
const Data = require('../../Modules/Data/SQLWrapper');
const Log = require('../../Modules/Log/Logger');
const Help = require('../../Modules/Help/HelpTexts');

module.exports = {
    name: 'help',
    alt: ['?'],
    description: 'Get some basic help on commands.',
    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        Data.CheckBaseData(message.guild, message.channel, message.author)
        .then(() => {
            if (!args || (args && args.length == 0)) {
                if (message.content == process.env.PREFIX + 'help') {
                    message.channel.send(   '```' + 
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
                                            '  _track\n' +
                                            '```For more help on commands, type `_?` or review the tutorial on MKC:\nhttps://www.mariokartcentral.com/forums/index.php?threads/toadoverlay-an-extension-bot-to-toad-for-streamers-and-more.10749/');
                }
                else if (message.content == process.env.PREFIX + '?') {
                    message.channel.send(Help.OverlaySetup);
                    message.channel.send(Help.OverlayOverride);
                    message.channel.send(Help.OtherCommands);
                }
            }
            else if (args && args.length == 1) {
                let cmd = args[0].replace('_', '');
                switch(cmd) {
                    // setup commands
                    case 'setup-overlay':
                    case 'setup':
                        message.channel.send(Help.SetupOverlay);
                        break;
                    case 'delete-overlay':
                    case 'delete':
                        message.channel.send(Help.DeleteOverlay);
                        break;
                    case 'reset-scores':
                    case 'reset':
                        message.channel.send(Help.ResetOverlay);
                        break;
                    case 'setmkc-home':
                    case 'home':
                        message.channel.send(Help.MKCSetHome);
                        break;
                    case 'setmkc-guest':
                    case 'guest':
                        message.channel.send(Help.MKCSetGuest);
                        break;
                    
                    // override commands
                    case 'setlogo-home':
                    case 'hlogo':
                        message.channel.send(Help.OverrideHomeLogo);
                        break;
                    case 'setlogo-guest':
                    case 'glogo':
                        message.channel.send(Help.OverrideGuestLogo);
                        break;
                    case 'setname-home':
                    case 'hname':
                        message.channel.send(Help.OverrideHomeName);
                        break;
                    case 'setname-guest':
                    case 'gname':
                        message.channel.send(Help.OverrideGuestName);
                        break;
                    case 'settag-home':
                    case 'htag':
                        message.channel.send(Help.OverrideHomeTag);
                        break;
                    case 'settag-guest':
                    case 'gtag':
                        message.channel.send(Help.OverrideGuestTag);
                        break;

                    // other commands
                    case 'schedulewar':
                    case 'war':
                        message.channel.send(Help.ScheduleWar);
                        break;
                    case 'friendcode':
                    case 'fc':
                        message.channel.send(Help.Friendcode);
                        break;
                    case 'tracktable':
                    case 'track':
                        message.channel.send(Help.Tracktable);
                        break;
                    
                    default:
                        message.channel.send('Unknown command...\nTry `_?` for a list of available commands.');
                        break;
                }
            }
            else if (args && args.length == 2) {
                if (args[0] == 'schedulewar' || args[0] == 'war') {
                    if (args[1] == 'setdefault') {
                        message.channel.send(Help.ScheduleWarDefault);
                    }
                    else if (args[1] == 'settimeout') {
                        message.channel.send(Help.ScheduleWarTimeout)
                    }
                    else {
                        message.channel.send('Unknown command...\nTry `_?` for a list of available commands.');
                    }
                }
            }
            else {
                message.channel.send('Unknown command...\nTry `_?` for a list of available commands.');
            }
        });
    }
};
