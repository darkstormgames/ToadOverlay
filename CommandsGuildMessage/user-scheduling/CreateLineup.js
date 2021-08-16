const Discord = require('discord.js');
const Data = require('../../Modules/Data/SQLWrapper');
const Log = require('../../Modules/Log/Logger');
const fs = require('fs');

module.exports = {
    name: 'lineup',
    alt: ['lu'],
    description: '',
    
    /**
    * @desc execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        if (!fs.existsSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + message.guild.id) &&
            !fs.existsSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + message.guild.id + process.env.DIR_SPLIT + message.channel.id)) {
                message.channel.send('```There are no scheduled matches in this channel.\nType _war first to set up scheduling.\n\nExamples:\n_war 8pm 9pm 10pm\n_war 20 21 22```');
                return;
        }

        let config = JSON.parse(fs.readFileSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + message.guild.id + process.env.DIR_SPLIT + 'guildConfig.json'));
        let currentChannelIndex = -1;
        for (let i = (config.channels.length - 1); i >= 0; i--) {
            if (config.channels[i].id == message.channel.id) {
                currentChannelIndex = i;
            }
        }

        let activeWars = [];
        if (currentChannelIndex == -1) {
            message.channel.send('```There are no scheduled matches in this channel.\nType _war first to set up scheduling.\n\nExamples:\n_war 8pm 9pm 10pm\n_war 20 21 22```');
            return;
        }
        activeWars = config.channels[currentChannelIndex].active;
        if (activeWars.length == 0) {
            message.channel.send('```There are no scheduled matches in this channel.\nType _war first to set up scheduling.\n\nExamples:\n_war 8pm 9pm 10pm\n_war 20 21 22```');
            return;
        }

        if (args.length == 0) {
            let retVal = '```Active lineups in ' + message.channel.name + '\n';
            for (let i = 0; i <= (config.channels[currentChannelIndex].active.length - 1); i++) {
                let data = JSON.parse(fs.readFileSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + message.guild.id + process.env.DIR_SPLIT + message.channel.id + process.env.DIR_SPLIT + activeWars[i].id + '.json'));
                retVal += (data.rawTime + '' + data.clockDiscriminator).trim() + ': ' + (data.CAN.length + data.SUB.length) + '/6 =>✅ ' + data.CAN.length + ' |❕ ' + data.SUB.length + ' |❔ ' + data.NOTSURE.length + ' |❌ ' + (data.CANT.length + data.DROPPED.length) + '\n';
            }
            retVal += '```';
            message.channel.send(retVal);
        }
        else if (args.length > 0) {
            // let times = [];
            // let isError = false;
            // args.forEach((item) => {
            //     let isTime = /^(?:(?:0?[0-9]|1[0-2])(:[0-5][0-9])?[aApP][mM]|(?:[01]?[0-9]|2[0-3])(:[0-5][0-9])?)$/.test(item);
            //     if (isTime == true) {
            //         times.push(item);
            //     }
            //     else {
            //         isError = true;
            //     }
            // });

            // if (isError) {
            //     message.channel.send('Please only provide valid time values without spaces as arguments.\nExample: _lineup 10am 11 10:15PM 23:30');
            //     return;
            // }

            // for (let time of times) {
            //     let retVal = '```Active lineups in ' + message.channel.name + '\n';
            //     for (let i = 0; i <= (config.channels[currentChannelIndex].active.length - 1); i++) {
            //         let data = JSON.parse(fs.readFileSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + message.guild.id + process.env.DIR_SPLIT + message.channel.id + process.env.DIR_SPLIT + activeWars[i].id + '.json'));
            //         retVal += '**War ' + (data.rawTime + ' ' + data.clockDiscriminator).trim() + ':**\n';
            //     }
            //     retVal += '```';
            //     message.channel.send(retVal);
            // }

            // too tired for now... I'm doing this later
        }
    }
}
