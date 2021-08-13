/**
 * required modules
 */
const { getRandomColor } = require('./ColorHelper');

module.exports = {
    get: (internalId, user, guild, channel) => {
        let colorCode = getRandomColor(internalId, guild, channel);
    
        let linkEmbed = {
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
                    value: '```http://toad.darkstormgames.de/index.php?c=' + channel.id + '&u=' + user.id + '&auth=' + internalId + '```'
                }
            ],
            timestamp: new Date(),
            footer: {
                text: '© darkstormgames'
            }
        };
        let instructEmbed = {
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
                    value: 'Commands to edit your overlay are executed in this private channel```sethtml [Your HTML body]\nsetstyle [Your CSS styles]\nsetimage [Full URL to your background image]```For more help regarding commands, just write "help" in this chat.'
                },
                {
                    name: 'Important note',
                    value: 'Always include your pasted HTML and CSS in these [] square brackets to make sure, parsing the data won´t fail and (obviously) don´t use square brackets in your code.'
                },
                {
                    name: 'Full instructions and basic help',
                    value: 'Just message this bot "help" to receive some basic guidance or take a look at the readme/wiki in [the github repository](https://github.com/darkstormgames/ToadOverlay) (coming soon™) or at [this thread on MKCentral](https://www.mariokartcentral.com/forums/index.php?threads/toadoverlay-an-extension-bot-to-toad-for-streamers-and-more.10749/)' // or .. the readme/wiki
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
    },

    gethelp: (user) => {
        let colorCode = getRandomColor((user.id % 1024), {id: user.id}, {id: user.id});
    
        let help1 = {
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
    
        let help2 = {
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
};
