const Discord = require('discord.js');

module.exports = {
    name: 'tracktable',
    alt: ['track'],
    description: '',
     
    /**
    * @desc execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        // ToDo: Download images and move them to my own server.
        if (args.length == 1) {
            switch (args[0].toLowerCase())
            {
                // Mushroom Cup
                case 'mks':
                    message.channel.send('https://i.imgur.com/VEBONKG.jpg');
                    break;
                case 'wp':
                    message.channel.send('https://i.imgur.com/F53Gclg.jpg');
                    break;
                case 'ssc':
                    message.channel.send('https://i.imgur.com/POjFeqX.jpg');
                    break;
                case 'tr':
                    message.channel.send('https://i.imgur.com/NnEmX8H.jpg');
                    break;

                // Flower Cup
                case 'mc':
                    message.channel.send('https://i.imgur.com/nGmLPtI.jpg');
                    break;
                case 'th':
                    message.channel.send('https://i.imgur.com/PmyzOOC.jpg');
                    break;
                case 'tm':
                    message.channel.send('https://i.imgur.com/9mDJxdr.jpg');
                    break;
                case 'sgf':
                    message.channel.send('https://i.imgur.com/5BwVD16.jpg');
                    break;

                // Star Cup
                case 'sa':
                    message.channel.send('https://i.imgur.com/ANQX5L4.jpg');
                    break;
                case 'ds':
                    message.channel.send('https://i.imgur.com/65ySpBs.jpg');
                    break;
                case 'ed':
                    message.channel.send('https://i.imgur.com/QDUDXNy.jpg');
                    break;
                case 'mw':
                    message.channel.send('https://i.imgur.com/AG0HZ4V.jpg');
                    break;
    
                // Crown Cup
                case 'cc':
                    message.channel.send('https://i.imgur.com/cToHr4h.jpg');
                    break;
                case 'bdd':
                    message.channel.send('https://i.imgur.com/A696OK7.jpg');
                    break;
                case 'bc':
                    message.channel.send('https://i.imgur.com/WbI9mW3.jpg');
                    break;
                case 'rr':
                    message.channel.send('https://i.imgur.com/TCDJa0K.jpg');
                    break;

                // Shell Cup
                case 'rmmm':
                    message.channel.send('https://i.imgur.com/jb0SrMK.jpg');
                    break;
                case 'rccb':
                    message.channel.send('https://i.imgur.com/pxFgRhG.jpg');
                    break;
                case 'rmc':
                    message.channel.send('https://i.imgur.com/3VjSpUB.jpg');
                    break;
                case 'rtt':
                    message.channel.send('https://i.imgur.com/EYMrdTu.jpg');
                    break;

                // Banana Cup
                case 'rddd':
                    message.channel.send('https://i.imgur.com/yLaXjB0.jpg');
                    break;
                case 'rdp3':
                    message.channel.send('https://i.imgur.com/fLFIbbo.jpg');
                    break;
                case 'rrry':
                    message.channel.send('https://i.imgur.com/FmLf8Y7.jpg');
                    break;
                case 'rdkj':
                    message.channel.send('https://i.imgur.com/CG8dAad.jpg');
                    break;

                // Leaf Cup
                case 'rws':
                    message.channel.send('https://i.imgur.com/mAtfUIH.jpg');
                    break;
                case 'rsl':
                    message.channel.send('https://i.imgur.com/E2yY1EP.jpg');
                    break;
                case 'rmp':
                    message.channel.send('https://i.imgur.com/wRdR3Sw.jpg');
                    break;
                case 'ryv':
                    message.channel.send('https://i.imgur.com/u8JeRij.jpg');
                    break;
    
                // Shock Cup
                case 'rttc':
                    message.channel.send('https://i.imgur.com/bN4kPhl.jpg');
                    break;
                case 'rpps':
                    message.channel.send('https://i.imgur.com/CqwfEWo.jpg');
                    break;
                case 'rgv':
                    message.channel.send('https://i.imgur.com/o563lzW.jpg');
                    break;
                case 'rrrd':
                    message.channel.send('https://i.imgur.com/oohb1ma.jpg');
                    break;

                // Egg Cup
                case 'dyc':
                    message.channel.send('https://i.imgur.com/28CzaPW.jpg');
                    break;
                case 'dea':
                    message.channel.send('https://i.imgur.com/ko98pNL.jpg');
                    break;
                case 'ddd':
                    message.channel.send('https://i.imgur.com/kKjR74o.jpg');
                    break;
                case 'dmc':
                    message.channel.send('https://i.imgur.com/fCmVSk9.jpg');
                    break;

                // Crossing Cup
                // case 'dbp':
                //     message.channel.send('');
                //     break;
                case 'dcl':
                    message.channel.send('https://i.imgur.com/nShXQSp.jpg');
                    break;
                case 'dww':
                    message.channel.send('https://i.imgur.com/OM1ldyy.jpg');
                    break;
                case 'dac':
                    message.channel.send('https://i.imgur.com/4tdK23x.jpg');
                    break;

                // Triforce Cup
                case 'dwgm':
                    message.channel.send('https://i.imgur.com/pQIYovp.jpg');
                    break;
                case 'diio':
                    message.channel.send('https://i.imgur.com/emCKoDa.jpg');
                    break;
                case 'drr':
                    message.channel.send('https://i.imgur.com/byppy0F.jpg');
                    break;
                case 'dhc':
                    message.channel.send('https://i.imgur.com/OPW4Nkp.jpg');
                    break;
    
                // Bell Cup
                case 'dnbc':
                    message.channel.send('https://i.imgur.com/CtxKxEt.jpg');
                    break;
                case 'drir':
                    message.channel.send('https://i.imgur.com/knfQM1z.jpg');
                    break;
                case 'dsbs':
                    message.channel.send('https://i.imgur.com/n9xwWR7.jpg');
                    break;
                case 'dbb':
                    message.channel.send('https://i.imgur.com/S1TDy2w.jpg');
                    break;

                default:
                    message.channel.send('Invalid track name.')
            }
        }
     }
}
