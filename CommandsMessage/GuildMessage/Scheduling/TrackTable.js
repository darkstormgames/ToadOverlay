const { MessageContext } = require('../../../ClientHandlers/MessageContext');

module.exports = {
    name: 'tracktable',
    alt: ['track'],
    description: '',
    
    /**
    * @desc execution of the command
    * @param {MessageContext} context
    */
    execute: async (context) => {
        // ToDo: Download images and move them to my own server.
        if (args.length == 1) {
            switch (args[0].toLowerCase())
            {
                // Mushroom Cup
                case 'mks':
                    context.reply('https://i.imgur.com/VEBONKG.jpg');
                    break;
                case 'wp':
                    context.reply('https://i.imgur.com/F53Gclg.jpg');
                    break;
                case 'ssc':
                    context.reply('https://i.imgur.com/POjFeqX.jpg');
                    break;
                case 'tr':
                    context.reply('https://i.imgur.com/NnEmX8H.jpg');
                    break;

                // Flower Cup
                case 'mc':
                    context.reply('https://i.imgur.com/nGmLPtI.jpg');
                    break;
                case 'th':
                    context.reply('https://i.imgur.com/PmyzOOC.jpg');
                    break;
                case 'tm':
                    context.reply('https://i.imgur.com/9mDJxdr.jpg');
                    break;
                case 'sgf':
                    context.reply('https://i.imgur.com/5BwVD16.jpg');
                    break;

                // Star Cup
                case 'sa':
                    context.reply('https://i.imgur.com/ANQX5L4.jpg');
                    break;
                case 'ds':
                    context.reply('https://i.imgur.com/65ySpBs.jpg');
                    break;
                case 'ed':
                    context.reply('https://i.imgur.com/QDUDXNy.jpg');
                    break;
                case 'mw':
                    context.reply('https://i.imgur.com/AG0HZ4V.jpg');
                    break;
    
                // Crown Cup
                case 'cc':
                    context.reply('https://i.imgur.com/cToHr4h.jpg');
                    break;
                case 'bdd':
                    context.reply('https://i.imgur.com/A696OK7.jpg');
                    break;
                case 'bc':
                    context.reply('https://i.imgur.com/WbI9mW3.jpg');
                    break;
                case 'rr':
                    context.reply('https://i.imgur.com/TCDJa0K.jpg');
                    break;

                // Shell Cup
                case 'rmmm':
                    context.reply('https://i.imgur.com/jb0SrMK.jpg');
                    break;
                case 'rccb':
                    context.reply('https://i.imgur.com/pxFgRhG.jpg');
                    break;
                case 'rmc':
                    context.reply('https://i.imgur.com/3VjSpUB.jpg');
                    break;
                case 'rtt':
                    context.reply('https://i.imgur.com/EYMrdTu.jpg');
                    break;

                // Banana Cup
                case 'rddd':
                    context.reply('https://i.imgur.com/yLaXjB0.jpg');
                    break;
                case 'rdp3':
                    context.reply('https://i.imgur.com/fLFIbbo.jpg');
                    break;
                case 'rrry':
                    context.reply('https://i.imgur.com/FmLf8Y7.jpg');
                    break;
                case 'rdkj':
                    context.reply('https://i.imgur.com/CG8dAad.jpg');
                    break;

                // Leaf Cup
                case 'rws':
                    context.reply('https://i.imgur.com/mAtfUIH.jpg');
                    break;
                case 'rsl':
                    context.reply('https://i.imgur.com/E2yY1EP.jpg');
                    break;
                case 'rmp':
                    context.reply('https://i.imgur.com/wRdR3Sw.jpg');
                    break;
                case 'ryv':
                    context.reply('https://i.imgur.com/u8JeRij.jpg');
                    break;
    
                // Shock Cup
                case 'rttc':
                    context.reply('https://i.imgur.com/bN4kPhl.jpg');
                    break;
                case 'rpps':
                    context.reply('https://i.imgur.com/CqwfEWo.jpg');
                    break;
                case 'rgv':
                    context.reply('https://i.imgur.com/o563lzW.jpg');
                    break;
                case 'rrrd':
                    context.reply('https://i.imgur.com/oohb1ma.jpg');
                    break;

                // Egg Cup
                case 'dyc':
                    context.reply('https://i.imgur.com/28CzaPW.jpg');
                    break;
                case 'dea':
                    context.reply('https://i.imgur.com/ko98pNL.jpg');
                    break;
                case 'ddd':
                    context.reply('https://i.imgur.com/kKjR74o.jpg');
                    break;
                case 'dmc':
                    context.reply('https://i.imgur.com/fCmVSk9.jpg');
                    break;

                // Crossing Cup
                // case 'dbp':
                //     context.reply('');
                //     break;
                case 'dcl':
                    context.reply('https://i.imgur.com/nShXQSp.jpg');
                    break;
                case 'dww':
                    context.reply('https://i.imgur.com/OM1ldyy.jpg');
                    break;
                case 'dac':
                    context.reply('https://i.imgur.com/4tdK23x.jpg');
                    break;

                // Triforce Cup
                case 'dwgm':
                    context.reply('https://i.imgur.com/pQIYovp.jpg');
                    break;
                case 'diio':
                    context.reply('https://i.imgur.com/emCKoDa.jpg');
                    break;
                case 'drr':
                    context.reply('https://i.imgur.com/byppy0F.jpg');
                    break;
                case 'dhc':
                    context.reply('https://i.imgur.com/OPW4Nkp.jpg');
                    break;
    
                // Bell Cup
                case 'dnbc':
                    context.reply('https://i.imgur.com/CtxKxEt.jpg');
                    break;
                case 'drir':
                    context.reply('https://i.imgur.com/knfQM1z.jpg');
                    break;
                case 'dsbs':
                    context.reply('https://i.imgur.com/n9xwWR7.jpg');
                    break;
                case 'dbb':
                    context.reply('https://i.imgur.com/S1TDy2w.jpg');
                    break;
                
                // Golden Turbo Cup
                case 'bpp':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/49.jpg');
                    break;
                case 'btc':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/50.jpg');
                    break;
                case 'bcm64':
                case 'bcmo':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/51.jpg');
                    break;
                case 'bcmw':
                case 'bcma':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/52.jpg');
                    break;

                // Glückskatzen-Cup
                case 'btb':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/53.jpg');
                    break;
                case 'bsr':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/54.jpg');
                    break;
                case 'bsg':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/55.jpg');
                    break;
                case 'bnh':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/56.jpg');
                    break;
                    
                // 
                case 'bnym':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/57.jpg');
                    break;
                case 'bmc3':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/58.jpg');
                    break;
                case 'bkd':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/59.jpg');
                    break;
                case 'bwp':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/60.jpg');
                    break;
                    
                case 'bss':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/61.jpg');
                    break;
                case 'bsl':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/62.jpg');
                    break;
                case 'bmg':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/63.jpg');
                    break;
                case 'bshs':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/64.jpg');
                    break;
                    
                case 'bll':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/65.jpg');
                    break;
                case 'bbl':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/66.jpg');
                    break;
                case 'brrm':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/67.jpg');
                    break;
                case 'bmt':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/68.jpg');
                    break;

                case 'bll':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/69.jpg');
                    break;
                case 'bbb':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/70.jpg');
                    break;
                case 'bmm':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/71.jpg');
                    break;
                case 'brr7':
                    message.channel.send('http://toad.darkstormgames.de/images/tracktable/72.jpg');
                    break;

                default:
                    context.reply('Invalid track name.')
            }
        }
     }
}
