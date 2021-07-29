/**
 * @desc required modules
 */
 const base = require('../../functions/commandsBase');
 const dbhelper = require('../../functions/db-helper');
 const { getRandomColor } = require('../../functions/utility');
 const { getMessage } = require('../../functions/scheduling');
 const fs = require('fs');
 const { foldersplit, workingdirectory } = require('../../config.json');

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
    * @desc execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, args) => {
        base.log.logMessage('Executing command "schedulewar"', message.author, message.guild, message.channel);
        dbhelper.checkBaseData(message.guild, message.channel, message.author);
        
        if (!fs.existsSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + message.guild.id)) {
            fs.mkdirSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + message.guild.id);
        }
        if (!fs.existsSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + message.guild.id + process.env.DIR_SPLIT + message.channel.id)) {
            fs.mkdirSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + message.guild.id + process.env.DIR_SPLIT + message.channel.id);
        }
        if (!fs.existsSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + message.guild.id + process.env.DIR_SPLIT + 'guildConfig.json')) {
            fs.writeFileSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + message.guild.id + process.env.DIR_SPLIT + 'guildConfig.json', 
                '{ "channels": [ { "id": ' + message.channel.id + ', "defaults": ["19","20","21","22","23"], "active": [], "timeout": 24 } ] }');
        }

        let config = JSON.parse(fs.readFileSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + message.guild.id + process.env.DIR_SPLIT + 'guildConfig.json'));

        let currentChannelIndex = -1;
        while(currentChannelIndex == -1) {
            for (let i = (config.channels.length - 1); i >= 0; i--) {
                if (config.channels[i].id == message.channel.id) {
                    currentChannelIndex = i;
                }
            }
            if (currentChannelIndex == -1) {
                config.channels.push({
                    id: message.channel.id,
                    defaults: config.channels[0].defaults,
                    active: [],
                    timeout: config.channels[0].timeout
                });
            }
        }

        let times = [];
        if (args.length == 0) {
            times = config.channels[currentChannelIndex].defaults;
        }
        else if (args.length > 20) {
            message.channel.send('Too many arguments!\nPlease don\'t schedule more than 20 matches at once.');
            return;
        }
        else if (args[0] == 'help') {

            
            return;
        }
        else if (args[0] == 'setdefault' || args[0] == 'setdefaults') {
            if (args.length < 2) {
                times = [19,20,21,22,23];
            }

            let isError = false;
            args.forEach((item) => {
                if (item != 'setdefault' && item != 'setdefaults') {
                    let isTime = /^(?:(?:0?[0-9]|1[0-2])(:[0-5][0-9])?[aApP][mM]|(?:[01]?[0-9]|2[0-3])(:[0-5][0-9])?)$/.test(item);
                    if (isTime == true) {
                        times.push(item);
                    }
                    else {
                        isError = true;
                    }
                }
            });

            if (isError) {
                message.channel.send('Please only provide valid time values without spaces as arguments.\nExample: _war 10am 11 10:15PM 23:30\n\nFor more help on more options for this command type _war help');
            }
            else {
                config.channels[currentChannelIndex].defaults = times;
                let retVal = 'Default times set to ';
                times.forEach((time) => {
                    retVal += time + ' ';
                });
                message.channel.send(retVal + '\n\nJust type _war to schedule all default times at once.');
            }
            fs.writeFileSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + message.guild.id + process.env.DIR_SPLIT + 'guildConfig.json', JSON.stringify(config));
            return;
        }
        else if (args[0] == 'settimeout') {
            if (args[1] && /\d+/g.test(args[1]) && args[1] >= 1 && args[1] <= 168) {
                config.channels[currentChannelIndex].timeout = args[1];
                message.channel.send('Timeout set to ' + args[1] + ' hours.');
            }
            else {
                message.channel.send('Invalid timeout-value!\nValid values are between 1 and 168 (1 hour to 7 days)\nDefault timeout is 24 hours.');
            }
            fs.writeFileSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + message.guild.id + process.env.DIR_SPLIT + 'guildConfig.json', JSON.stringify(config));
            return;
        }
        else if (args[0] == 'deactivateall') {

            
            return;
        }
        else if (args[0] == 'deactivate') {

            
            return;
        }
        else {
            let isError = false;
            args.forEach((item) => {
                let isTime = /^(?:(?:0?[0-9]|1[0-2])(:[0-5][0-9])?[aApP][mM]|(?:[01]?[0-9]|2[0-3])(:[0-5][0-9])?)$/m.test(item);
                if (isTime == true) {
                    times.push(item);
                }
                else {
                    isError = true;
                }
            });

            if (isError) {
                message.channel.send('Please only provide valid time values without spaces as arguments.\nExample: _war 10am 11 10:15PM 23:30\n\nFor more help on more options for this command type _war help');
                fs.writeFileSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + message.guild.id + process.env.DIR_SPLIT + 'guildConfig.json', JSON.stringify(config));
                return;
            }
        }

        // times.forEach((time) => {
        for (let time of times) {
            let timeFormat = '24';
            let rawTime = time;
            let clockDiscriminator = '';
            if (/^(?:(?:0?[0-9]|1[0-2])(:[0-5][0-9])?[aApP][mM])$/.test(time)) {
                timeFormat = '12';
                rawTime = time.substring(0, time.length - 2);
                clockDiscriminator = time.replace(/\d+/g, '').replace(/:/g, '').toUpperCase();
            }

            let colorCode = getRandomColor(((timeFormat == 24 ? (rawTime.replace(/:/g, '.')) : (clockDiscriminator == 'PM' ? (rawTime.replace(/:/g, '.')) * 2 : (rawTime.replace(/:/g, '.')))) + new Date().getDate()), message.guild, message.channel);
            let scheduleEmbed = {
                color: colorCode,
                title: '**War ' + (rawTime + ' ' + clockDiscriminator).trim() + '**'
            };

            message.channel.send({ embed: scheduleEmbed })
            .then(newMessage => {
                fs.writeFile(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + message.guild.id + process.env.DIR_SPLIT + message.channel.id + process.env.DIR_SPLIT 
                    + newMessage.id + '.json', '{ "time": "' + time + '", "rawTime": "' + rawTime + '", "clockDiscriminator": "' + clockDiscriminator + '", "format": "' + timeFormat + '", "CAN": [], "CANT": [], "SUB": [], "NOTSURE": [], "DROPPED": [] }', (err) => { if (err) console.log(err); });
                for (let i = (config.channels[currentChannelIndex].active.length - 1); i >= 0; i--) {
                    if (config.channels[currentChannelIndex].active[i].time == time || 
                        ((new Date().getTime() - new Date(config.channels[currentChannelIndex].active[i].created).getTime()) / (1000 * 3600)) > config.channels[currentChannelIndex].timeout) {
                            config.channels[currentChannelIndex].active.splice(i, 1);
                            i = (config.channels[currentChannelIndex].active.length);
                    }
                }
                config.channels[currentChannelIndex].active.push({ 
                    id: newMessage.id, 
                    time: time, 
                    created: new Date() });
                
                newMessage.react('✅').then(() => newMessage.react('❕')).then(() => newMessage.react('❔')).then(() => newMessage.react('❌'));
            })
            .then(() => fs.writeFileSync(process.env.DIR_WORKING + process.env.DIR_SPLIT + 'scheduleTemp' + process.env.DIR_SPLIT + message.guild.id + process.env.DIR_SPLIT + 'guildConfig.json', JSON.stringify(config)))
            .catch((err) => base.log.logMessage('Failed to send embed...\n' + err));
                
            base.log.logWarData(message.guild, message.channel, message.author, 'Created schedule for ' + time);
        }
    }
};