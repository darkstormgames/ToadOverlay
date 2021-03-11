/**
 * @desc required modules
 */
 const base = require('../functions/commandsBase');
 const validations = require('../functions/validations');
 const seedrandom = require('seedrandom');
 const fs = require('fs');
 const { foldersplit, workingdirectory } = require('../config.json');

 function getColor(internalId, guild, channel) {
    let rng_r = seedrandom(((internalId * 91) * (guild.id % 42)).toString());
    let rng_b = seedrandom(((guild.id % 87) * (channel.id % 42)).toString());
    let rng_g = seedrandom(((channel.id % 89) * (internalId * 42)).toString());

    let r = (((rng_r() * 100000000) % 1000) % 256),
        g = (((rng_b() * 1000000000) % 1000) % 256),
        b = (((rng_g() * 10000000) % 1000) % 256);

    return ((b & 0xFF) + ((g << 8) & 0xFF00) + ((r << 16) & 0xFF0000));
}

 module.exports = {
    /**
    * @desc The name and trigger of the command
    */
    name: 'schedulewar',
 
    /**
    * @desc Alternative trigger(s) for the command
    */
    alt: ['war'],
 
    /**
    * @desc Defines the type of the command
    * This field is used for validation
    */
    type: base.CommandTypeEnum.General,
 
    /**
    * @desc Short description of the command
    */
    description: '',
 
    /**
    * @description I have absolutely no idea anymore...
    */
    guildOnly: true,
     
    /**
    * @desc execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        if (!fs.existsSync(workingdirectory + foldersplit + 'scheduleTemp' + foldersplit + message.guild.id)) {
            fs.mkdirSync(workingdirectory + foldersplit + 'scheduleTemp' + foldersplit + message.guild.id);
        }
        if (!fs.existsSync(workingdirectory + foldersplit + 'scheduleTemp' + foldersplit + message.guild.id + foldersplit + message.channel.id)) {
            fs.mkdirSync(workingdirectory + foldersplit + 'scheduleTemp' + foldersplit + message.guild.id + foldersplit + message.channel.id);
        }

        let times = [];
        if (args.length == 0) {
            times = [ 19, 20, 21, 22, 23 ];
        }
        else {
            let isError = false;
            args.forEach(item => {
                if (isNaN(item)) {
                    isError = true;
                }
                else {
                    times.push(new Number(item));
                }
            });

            if (isError) {
                message.channel.send('Please only provide numeric values as arguments.');
                return;
            }
        }

        times.forEach(time => {
            let colorCode = getColor(time, message.guild.id, message.channel.id);

            let scheduleEmbed = {
                color: colorCode,
                title: 'War ' + time,
                // author: {
                //     name: 'ToadOverlay',
                //     icon_url: 'https://gamesites.nintendo.com.au/paper-mario-color-splash/assets/img/tip-toad1.png',
                //     url: 'https://github.com/darkstormgames/ToadOverlay',
                // },
                fields: [
                    // {
                    //     name: 'Can',
                    //     value: 'Test'
                    // },
                    // {
                    //     name: 'Can\'t',
                    //     value: 'Test'
                    // },
                    // {
                    //     name: 'Sub',
                    //     value: 'Test'
                    // }
                ]
            };

            message.channel.send({embed: scheduleEmbed})
                .then(newMessage => {
                    fs.writeFile(workingdirectory + foldersplit + 'scheduleTemp' + foldersplit + message.guild.id + foldersplit + message.channel.id + foldersplit 
                        + newMessage.id + '.json', '{\n\t"time": ' + time + ',\n\t"CAN": [],\n\t"CANT": [],\n\t"SUB": [],\n\t"NOTSURE": [],\n\t"DROPPED": []\n}', (err) => { if (err) console.log(err); });

                    newMessage.react('✅').then(() => newMessage.react('❕')).then(() => newMessage.react('❔')).then(() => newMessage.react('❌'));
                    // newMessage.react('❌');
                    // newMessage.react('❔');
                })
                .catch(console.error);
        });



    },
 };