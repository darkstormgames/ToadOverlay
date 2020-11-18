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

function getInstructionsMessage(internalId, user, guild, channel) {
    var colorCode = getColor(internalId, guild, channel);

    var linkEmbed = {
        color: colorCode,
        title: 'Overlay-URL for the channel "' + channel.name + '" on "' + guild.name + '"',
        // author: {
        //     name: 'ToadOverlay',
        //     icon_url: 'https://gamesites.nintendo.com.au/paper-mario-color-splash/assets/img/tip-toad1.png',
        //     url: 'https://github.com/darkstormgames/ToadOverlay',
        // },
        fields: [
            {
                name: 'URL',
                value: '```http://toad.darkstormgames.de/index.php?g=' + guild.id + '&u=' + user.id + '&auth=' + internalId + '```'
            }
        ],
        timestamp: new Date(),
        footer: {
            text: '© darkstormgames'
        }
    };
    var instructEmbed = {
        color: 14540253,
        title: 'Using/Editing your overlay',
        fields: [
            {
                name: 'Basic instructions',
                value: 'To use this overlay in obs, (or streamlabs obs) just add a new browser source and paste the corresponding URL in the URL-field in the properties window.'
            },
            {
                name: 'Default settings for browser source in obs and slobs',
                value: '- Width: 1000\n- Make sure, the following boxes are checked:\n> "Shutdown source when not visible"\n> "Refresh browser when scene becomes active"'
            },
            {
                name: 'Commands',
                value: 'Commands to edit your overlay are executed in this private channel```sethtml [Your HTML body]\nsetstyle [Your CSS styles]\nsetimage [Full URL to your background image]\nkeepresults [{0|1}]```For more help regarding commands, just write "help" in this chat.'
            },
            {
                name: 'Important note',
                value: 'Always include your pasted HTML and CSS in these [] square brackets to make sure, parsing the data won´t fail and (obviously) don´t use square brackets in your code.'
            },
            {
                name: 'Full instructions and basic help',
                value: 'Take a look at the readme/wiki in [the github repository](https://github.com/darkstormgames/ToadOverlay) (coming soon™)' // at -- [this thread on MKCentral](https://www.mariokartcentral.com/forums/index.php?forums/game-discussion.6/) or .. the readme/wiki
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

    return {
        linkEmbed: linkEmbed,
        instructEmbed: instructEmbed
    };
}

function getHelpMessage(user) {
    var colorCode = getColor((user.id % 1024), {id: user.id}, {id: user.id});

    var help1 = {
        color: colorCode,
        title: 'Commands Help',
        description: 'Page 1 of 2 (General commands)',
        fields: [
            {
                name: 'Command scope',
                value: 'These commands are for each channel, where Toad is used, individually.'
            },
            {
                name: 'Setting up your overlay',
                value: 'You´ve already used this command at least once, so you know what it does.' + 
                       '```_setup```' +
                       'You can also use this command to resend the URL for the overlay for the channel, this command has been executed in.'
            },
            {
                name: 'Deleting your overlay',
                value: 'This command permanently deletes your overlay for the channel, this command has been executed in.' + 
                       '```_delete```'
            },
            {
                name: 'Setting teams to display',
                value: 'These commands set the clans to display from their respective registry page on mkc.' + 
                       '```_home {mkc team url/id}\n_guest {mkc team url/id}```' + 
                       '```Examples:\n_home 10\n_guest https://www.mariokartcentral.com/mkc/registry/teams/100```' + 
                       'Support for unregistered (sub)clans is coming soon™'
            },
            {
                name: 'Reset scores',
                value: 'This command sets the current scores for the channel, this command has been executed in, to zero.' + 
                       '```_reset```'
            }
        ],
        timestamp: new Date(),
        footer: {
            text: '© darkstormgames',
        },
    };

    var help2 = {
        color: colorCode,
        title: 'Commands Help',
        description: 'Page 2 of 2 (Editing commands)',
        fields: [
            {
                name: 'Command scope',
                value: 'These commands are executed in this private channel and edit all of your overlays for all channels.'
            },
            {
                name: 'Setting the overlay HTML',
                value: '' + 
                       '```sethtml [Your HTML body]```' + 
                       'Example and Default:' +
                       '```sethtml [<div id="container">\n  <img id="bg" src="" >\n  <div id="difference"></div>\n\n  <div id="home-current"></div>\n  <img id="home-logo" src="">\n  <div id="home-tag"></div>\n\n  <div id="guest-current"></div>\n  <img id="guest-logo" src="">\n  <div id="guest-tag"></div>\n</div>]```' + 
                       'IDs for data: \n' + 
                       '> difference\n> home-current\n> home-logo\n> home-tag\n> home-name\n> guest-current\n> guest-logo\n> guest-tag\n> guest-name' + 
                       ''
            },
            {
                name: 'Setting the overlay CSS styles',
                value: '' + 
                       '```setstyle [Your CSS styles]```' + 
                       'Example and Default:' + 
                       '```setstyle [body{background-color:rgba(0,255,0,0);}\n#container{position:relative;text-align:center;color:white;font-size:14px;}\n#bg{opacity:0.75;}\n#difference{position:absolute;top:70%;left:50.5%;transform:translate(-50%,-50%);font-size:28px;opacity:0.75;}\n\n#home-current{position:absolute;top:60px;left:25%;transform:translate(-50%,-50%);font-size:28px;opacity:0.9;}\n#home-tag{position:absolute;top:20px;left:25%;transform:translate(-50%,-50%);font-size:28px;opacity:0.9;}\n#home-logo{position:absolute;top:40px;left:37%;transform:translate(-50%,-50%);height:70px;opacity:0.85;}\n\n#guest-current{position:absolute;top:60px;left:75%;transform:translate(-50%,-50%);font-size:28px;opacity:0.9;}\n#guest-tag{position:absolute;top:20px;left:75%;transform:translate(-50%,-50%);font-size:28px;opacity:0.9;}\n#guest-logo{position:absolute;top:40px;left:65%;transform:translate(-50%,-50%);height:70px;opacity:0.85;}]```' + 
                       ''
            },
            {
                name: 'Setting the background image',
                value: '' + 
                       '```setimage [Full URL to your background image]```' + 
                       'Example and Default:' + 
                       '```setimage [http://toad.darkstormgames.de/images/default.png]```' + 
                       ''
            },
            {
                name: 'Keep/reset results after "_stopwar"',
                value: 'This setting determines, if scores should be kept after the "_stopwar" command was executed. A "1" keeps the result until the next "_startwar" and a "0" resets it to zero, when the war has been stopped.' + 
                       '```keepresults [{0|1}]```' + 
                       'Example and Default:' + 
                       '```keepresults [0]```' + 
                       ''
            }
        ],
        timestamp: new Date(),
        footer: {
            text: '© darkstormgames',
        },
    };

    return {
        page1: help1,
        page2: help2
    };
}

// --------------------------------------------------

module.exports = {
    get: getInstructionsMessage,
    gethelp: getHelpMessage
};