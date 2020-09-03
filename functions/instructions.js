function getInstructionsMessage(internalId, userId, guildId) {
    //http://toad.darkstormgames.de/?g=534303170785181708&u=329925485796524053&auth=11
    var linkEmbed = {
        color: 3447003,
        title: 'URL to your overlay',
        fields: [
            {
                name: 'URL',
                value: '```http://toad.darkstormgames.de/?g=' + guildId + '&u=' + userId + '&auth=' + internalId + '```'
            },
            {
                name: 'Basic instructions',
                value: 'To use this overlay in obs, (or slobs) just add a new browser source and paste this URL in the URL-field in the properties window.'
            },
            {
                name: 'Default settings',
                value: '- Width: 962\n- Make sure, the following boxes are checked:\n> "Shutdown source when not visible"\n> "Refresh browser when scene becomes active"'
            }
        ],
        timestamp: new Date(),
        footer: {
            text: '© darkstormgames'
        }
    }
    var instructEmbed = {
        color: 3447003,
        title: 'Editing your overlay',
        description: 'To edit your overlay, just write some html how you want it to look like and paste the result in this chat with the following commands.',
        fields: [
            {
                name: 'Important note',
                value: 'Always include your pasted HTML and CSS in these [] square brackets to make sure, parsing the data won´t fail and (obviously) don´t use square brackets in your code.'
            },
            {
                name: 'Full instructions and basic help',
                value: 'Take a look at [this thread on mkc](https://www.mariokartcentral.com/forums/index.php?forums/game-discussion.6/)'
            },
            {
                name: 'Support',
                value: 'If you have any problems or questions while following the instructions on the forum, feel free to dm me @ Rollo#7568'
            }
        ]
    };
    var htmlEmbed = {
        color: 3447003,
        title: 'Setting the body-content',
        fields: [
            {
                name: 'Command',
                value: '```sethtml [Your HTML]```'
            },
            {
                name: 'Example and Default',
                value: '```sethtml [<div id="container">\n  <img id="bg" src="" >\n  <div id="difference"></div>\n\n  <div id="home-current"></div>\n  <img id="home-logo" src="">\n  <div id="home-tag"></div>\n\n  <div id="guest-current"></div>\n  <img id="guest-logo" src="">\n  <div id="guest-tag"></div>\n</div>]```'
            },
            {
                name: 'IDs for data',
                value: '> difference\n> home-current\n> home-logo\n> home-tag\n> home-name\n> guest-current\n> guest-logo\n> guest-tag\n> guest-name'
            },
            {
                name: 'Important note',
                value: 'Make sure to have the empty img-element (<img id="bg" src="" >) in your html, as this will be where the background-image is loaded into.'
            }
        ]
    };
    var styleEmbed = {
        color: 3447003,
        title: 'Setting the styles (CSS)',
        fields: [
            {
                name: 'Command',
                value: '```setstyle [Your Styles]```'
            },
            {
                name: 'Example and Default',
                value: '```setstyle [body{ background-color:rgba(0,255,0,0); }\n#container{ position:relative; text-align:center; color:white; font-size:14px; }\n#difference{ position:absolute; top:70%; left:50.5%; transform:translate(-50%,-50%); font-size:28px; }\n\n#home-current{ position:absolute; top:60px; left:25%; transform:translate(-50%,-50%); font-size:28px; }\n#home-tag{ position:absolute; top:20px; left:25%; transform:translate(-50%,-50%); font-size:28px; }\n#home-logo{ position:absolute; top:40px; left:37%; transform:translate(-50%,-50%); height:70px; }\n\n#guest-current{ position:absolute; top:60px; left:75%; transform:translate(-50%,-50%); font-size:28px; }\n#guest-tag{ position:absolute; top:20px; left:75%; transform:translate(-50%,-50%); font-size:28px; }\n#guest-logo{ position:absolute; top:40px; left:65%; transform:translate(-50%,-50%); height:70px; }]```'
            },
            {
                name: 'Dev notes',
                value: 'Don´t expect this to be good CSS, because I really suck at HTML and CSS... It works so I am fine with it.'
            }
        ]
    }
    var imageEmbed = {
        color: 3447003,
        title: 'Setting the background image',
        fields: [
            {
                name: 'Command',
                value: '```setimage [Full URL to your background-image]```'
            },
            {
                name: 'Example and Default',
                value: '```setimage [http://toad.darkstormgames.de/images/default.png]```'
            },
            {
                name: 'Important notes',
                value: 'Make sure your background-image is publicly available (or at least from your IP) and has the wanted dimensions (as long as you don´t want to change it via CSS).'
            }
        ]
    }
    var keepEmbed = {
        color: 3447003,
        title: 'Resetting scores on "_stopwar"',
        fields: [
            {
                name: 'Command',
                value: '```keepresults [{0|1}]```'
            },
            {
                name: 'Example and Default',
                value: '```keepresults [0]```'
            },
            {
                name: 'Explanation',
                value: 'This setting determines, if scores should be kept after the "_stopwar" command was executed. A "1" keeps the result until the next "_startwar" and a "0" resets it to zero, when the war has been stopped.'
            }
        ]
    }
    var commandsEmbed = {
        color: 3447003,
        title: 'Commands per discord server',
        fields: [
            {
                name: '_home {mkc-id}',
                value: 'Sets the home team to the given team on mkc.\n```Example (eXodus): \n_home 139```'
            },
            {
                name: '_guest {mkc-id}',
                value: 'Sets the home team to the given team on mkc.\n```Example (Greed Island Coast): \n_home 889```'
            },
            {
                name: '_setup-overlay',
                value: 'Use this to setup your overlay. You can also use this command to resend these instructions.'
            },
            {
                name: '_delete-overlay',
                value: 'This command irreversibly deletes your overlay for the server this command has been executed on.'
            }
        ]
    }

    return {
        linkEmbed: linkEmbed,
        instructEmbed: instructEmbed,
        htmlEmbed: htmlEmbed,
        styleEmbed: styleEmbed,
        imageEmbed: imageEmbed,
        keepEmbed: keepEmbed,
        commandsEmbed: commandsEmbed
    };
}

// --------------------------------------------------

module.exports = {
    get: getInstructionsMessage
};