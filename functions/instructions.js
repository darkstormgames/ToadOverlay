const seedrandom = require('seedrandom');

function getColor(internalId, guild, channel) {
    var rng_r = seedrandom(((internalId * 91) * (guild.id % 42)).toString());
    var rng_b = seedrandom(((guild.id % 87) * (channel.id % 42)).toString());
    var rng_g = seedrandom(((channel.id % 89) * (internalId * 42)).toString());

    var r = (((rng_r() * 100000000) % 1000) % 256),
        g = (((rng_b() * 1000000000) % 1000) % 256),
        b = (((rng_g() * 10000000) % 1000) % 256);

    return ((b & 0xFF) + ((g << 8) & 0xFF00) + ((r << 16) & 0xFF0000));
}

function getInstructionsMessage(internalId, userId, guild, channel) {
    var colorCode = getColor(internalId, guild, channel);

    var linkEmbed = {
        color: colorCode,
        title: 'Overlay-URL for the channel "' + channel.name + '" on "' + guild.name + '"',
        fields: [
            {
                name: 'URL',
                value: '```http://toad.darkstormgames.de/?g=' + guild.id + '&u=' + userId + '&auth=' + internalId + '```'
            }
        ],
        timestamp: new Date(),
        footer: {
            text: '© darkstormgames'
        }
    }
    var instructEmbed = {
        color: 14540253,
        title: 'Editing your overlay',
        description: 'To edit your overlay, just write some html how you want it to look like and paste the result in this chat with the following commands.',
        fields: [
            {
                name: 'Basic instructions',
                value: 'To use this overlay in obs, (or streamlabs obs) just add a new browser source and paste the corresponding URL in the URL-field in the properties window.'
            },
            {
                name: 'Default settings for browser source in obs and slobs',
                value: '- Width: 962\n- Make sure, the following boxes are checked:\n> "Shutdown source when not visible"\n> "Refresh browser when scene becomes active"'
            },
            {
                name: 'Commands',
                value: '```sethtml [Your HTML body]\nsetstyle [Your CSS styles]\nsetimage [Full URL to your background-image]\nkeepresults [{0|1}]```For more help regarding commands, just write "help" in this chat.'
            },
            {
                name: 'Important note',
                value: 'Always include your pasted HTML and CSS in these [] square brackets to make sure, parsing the data won´t fail and (obviously) don´t use square brackets in your code.'
            },
            {
                name: 'Full instructions and basic help',
                value: 'Take a look at [this thread on MKCentral](https://www.mariokartcentral.com/forums/index.php?forums/game-discussion.6/) or the help in [the github repository](https://github.com/darkstormgames/ToadOverlay)'
            },
            {
                name: 'Support',
                value: 'If you have any problems, questions or found a bug, feel free to dm me @ Rollo#7568'
            }
        ],
        timestamp: new Date(),
        footer: {
            text: '© darkstormgames'
        }
    };
    // var htmlEmbed = {
    //     color: 3447003,
    //     title: 'Setting the body-content',
    //     fields: [
    //         {
    //             name: 'Command',
    //             value: '```sethtml [Your HTML]```'
    //         },
    //         {
    //             name: 'Example and Default',
    //             value: '```sethtml [<div id="container">\n  <img id="bg" src="" >\n  <div id="difference"></div>\n\n  <div id="home-current"></div>\n  <img id="home-logo" src="">\n  <div id="home-tag"></div>\n\n  <div id="guest-current"></div>\n  <img id="guest-logo" src="">\n  <div id="guest-tag"></div>\n</div>]```'
    //         },
    //         {
    //             name: 'IDs for data',
    //             value: '> difference\n> home-current\n> home-logo\n> home-tag\n> home-name\n> guest-current\n> guest-logo\n> guest-tag\n> guest-name'
    //         },
    //         {
    //             name: 'Important note',
    //             value: 'Make sure to have the empty img-element (<img id="bg" src="" >) in your html, as this will be where the background-image is loaded into.'
    //         }
    //     ]
    // };
    // var styleEmbed = {
    //     color: 3447003,
    //     title: 'Setting the styles (CSS)',
    //     fields: [
    //         {
    //             name: 'Command',
    //             value: '```setstyle [Your Styles]```'
    //         },
    //         {
    //             name: 'Example and Default',
    //             value: '```setstyle [body{ background-color:rgba(0,255,0,0); }\n#container{ position:relative; text-align:center; color:white; font-size:14px; }\n#difference{ position:absolute; top:70%; left:50.5%; transform:translate(-50%,-50%); font-size:28px; }\n\n#home-current{ position:absolute; top:60px; left:25%; transform:translate(-50%,-50%); font-size:28px; }\n#home-tag{ position:absolute; top:20px; left:25%; transform:translate(-50%,-50%); font-size:28px; }\n#home-logo{ position:absolute; top:40px; left:37%; transform:translate(-50%,-50%); height:70px; }\n\n#guest-current{ position:absolute; top:60px; left:75%; transform:translate(-50%,-50%); font-size:28px; }\n#guest-tag{ position:absolute; top:20px; left:75%; transform:translate(-50%,-50%); font-size:28px; }\n#guest-logo{ position:absolute; top:40px; left:65%; transform:translate(-50%,-50%); height:70px; }]```'
    //         },
    //         {
    //             name: 'Dev notes',
    //             value: 'Don´t expect this to be good CSS, because I really suck at HTML and CSS... It works so I am fine with it.'
    //         }
    //     ]
    // }
    // var imageEmbed = {
    //     color: 3447003,
    //     title: 'Setting the background image',
    //     fields: [
    //         {
    //             name: 'Command',
    //             value: '```setimage [Full URL to your background-image]```'
    //         },
    //         {
    //             name: 'Example and Default',
    //             value: '```setimage [http://toad.darkstormgames.de/images/default.png]```'
    //         },
    //         {
    //             name: 'Important notes',
    //             value: 'Make sure your background-image is publicly available (or at least from your IP) and has the wanted dimensions (as long as you don´t want to change it via CSS).'
    //         }
    //     ]
    // }
    // var keepEmbed = {
    //     color: 3447003,
    //     title: 'Resetting scores on "_stopwar"',
    //     fields: [
    //         {
    //             name: 'Command',
    //             value: '```keepresults [{0|1}]```'
    //         },
    //         {
    //             name: 'Example and Default',
    //             value: '```keepresults [0]```'
    //         },
    //         {
    //             name: 'Explanation',
    //             value: 'This setting determines, if scores should be kept after the "_stopwar" command was executed. A "1" keeps the result until the next "_startwar" and a "0" resets it to zero, when the war has been stopped.'
    //         }
    //     ]
    // }
    // var commandsEmbed = {
    //     color: 3447003,
    //     title: 'Commands per discord server',
    //     fields: [
    //         {
    //             name: '_home {mkc-id}',
    //             value: 'Sets the home team to the given team on mkc.\n```Example (eXodus): \n_home 139```'
    //         },
    //         {
    //             name: '_guest {mkc-id}',
    //             value: 'Sets the home team to the given team on mkc.\n```Example (Greed Island Coast): \n_home 889```'
    //         },
    //         {
    //             name: '_setup-overlay',
    //             value: 'Use this to setup your overlay. You can also use this command to resend these instructions.'
    //         },
    //         {
    //             name: '_delete-overlay',
    //             value: 'This command irreversibly deletes your overlay for the server this command has been executed on.'
    //         }
    //     ]
    // }

    return {
        linkEmbed: linkEmbed,
        instructEmbed: instructEmbed,
        // htmlEmbed: htmlEmbed,
        // styleEmbed: styleEmbed,
        // imageEmbed: imageEmbed,
        // keepEmbed: keepEmbed,
        // commandsEmbed: commandsEmbed
    };
}

// --------------------------------------------------

module.exports = {
    get: getInstructionsMessage
};