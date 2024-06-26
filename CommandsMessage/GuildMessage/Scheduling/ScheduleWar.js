const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { MessageContext } = require('../../../ClientHandlers/MessageContext');
const { LogApplication, LogMessage, LogStatus, LogLevel } = require('../../../Log/Logger');
const { getRandomColor } = require('../../../Help/ColorHelper');
const fs = require('fs');

/**
 * @param {Message} message 
 */
function checkDir(message) {
  if (!fs.existsSync(appSchedule + message.guild.id)) {
    fs.mkdirSync(appSchedule + message.guild.id);
  }
  if (!fs.existsSync(appSchedule + message.guild.id + dirSplit + message.channel.id)) {
    fs.mkdirSync(appSchedule + message.guild.id + dirSplit + message.channel.id);
  }
  if (!fs.existsSync(appSchedule + message.guild.id + dirSplit + 'guildConfig.json')) {
    fs.writeFileSync(appSchedule + message.guild.id + dirSplit + 'guildConfig.json',
      '{ "channels": [ { "id": ' + message.channel.id + ', "defaults": ["19","20","21","22","23"], "active": [], "timeout": 24 } ] }');
  }
}

module.exports = {
  name: 'schedulewar',
  alt: ['war'],
  description: '',

  /**
   * @param {MessageContext} context 
   */
  execute: async (context) => {
    checkDir(context.message);

    let config = JSON.parse(fs.readFileSync(appSchedule + context.message.guild.id + dirSplit + 'guildConfig.json'));

    let currentChannelIndex = -1;
    while (currentChannelIndex == -1) {
      for (let i = (config.channels.length - 1); i >= 0; i--) {
        if (config.channels[i].id == context.message.channel.id) {
          currentChannelIndex = i;
        }
      }
      if (currentChannelIndex == -1) {
        config.channels.push({
          id: context.message.channel.id,
          defaults: config.channels[0].defaults,
          active: [],
          timeout: config.channels[0].timeout
        });
      }
    }

    let times = [];
    if (context.args.length == 0) {
      times = config.channels[currentChannelIndex].defaults;
    }
    else if (context.args.length > 20) {
      context.reply('Too many arguments!\nPlease don\'t schedule more than 20 matches at once.');
      return;
    }
    else {
      let isError = false;
      switch (context.args[0]) {
        case 'help':
          // ToDo: Handling help texts differently...
          // ToDo: Add help text here...
          return;
        case 'setdefault':
        case 'setdefaults':
          if (context.args.length < 2) {
            times = [19, 20, 21, 22, 23];
          }

          context.args.forEach((item) => {
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
            context.reply('Please only provide valid time values without spaces as arguments.\nExample: _war 10am 11 10:15PM 23:30\n\nFor more help on more options for this command type _war help');
          }
          else {
            config.channels[currentChannelIndex].defaults = times;
            let retVal = 'Default times set to ';
            times.forEach((time) => {
              retVal += time + ' ';
            });
            context.reply(retVal + '\n\nJust type _war to schedule all default times at once.');
          }
          checkDir(context.message);
          fs.writeFileSync(appSchedule + context.message.guild.id + dirSplit + 'guildConfig.json', JSON.stringify(config));
          return;
        case 'settimeout':
          if (context.args[1] && /\d+/g.test(context.args[1]) && context.args[1] >= 1 && context.args[1] <= 168) {
            config.channels[currentChannelIndex].timeout = context.args[1];
            context.reply('Timeout set to ' + context.args[1] + ' hours.');
          }
          else {
            context.reply('Invalid timeout-value!\nValid values are between 1 and 168 (1 hour to 7 days)\nDefault timeout is 24 hours.');
          }
          checkDir(context.message);
          fs.writeFileSync(appSchedule + context.message.guild.id + dirSplit + 'guildConfig.json', JSON.stringify(config));
          return;
        case 'deactivateall': return;
        case 'deactivate': return;
        default:
          context.args.forEach((item) => {
            let isTime = /^(?:(?:0?[0-9]|1[0-2])(:[0-5][0-9])?[aApP][mM]|(?:[01]?[0-9]|2[0-3])(:[0-5][0-9])?)$/m.test(item);
            if (isTime == true) {
              times.push(item);
            }
            else {
              isError = true;
            }
          });

          if (isError) {
            context.reply('Please only provide valid time values without spaces as arguments.\nExample: _war 10am 11 10:15PM 23:30\n\nFor more help on more options for this command type _war help');
            checkDir(context.message);
            fs.writeFileSync(appSchedule + context.message.guild.id + dirSplit + 'guildConfig.json', JSON.stringify(config));
            return;
          }
      }
    }

    if (!context.message.channel.permissionsFor(context.message.guild.members.me).has([
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.EmbedLinks,
      PermissionsBitField.Flags.AddReactions,
      PermissionsBitField.Flags.ReadMessageHistory
    ])) {
      if (!context.message.channel.permissionsFor(context.message.guild.members.me).has([PermissionsBitField.Flags.SendMessages])) {
        context.reply('The channel you tried to execute some command in does not allow me to send messages...\nPlease make sure to give me at least the following permissions for me to function properly:\n```Required permissions:\n  SEND MESSAGES\n  EMBED LINKS\n  ADD REACTIONS\n  READ MESSAGE HISTORY\n\nOptional, but useful for the full functionality of war scheduling:\n  MANAGE MESSAGES```')
          .catch((err) => LogApplication('ScheduleWar.Permissions.SendDM', `Can\'t send info-DM to ${context.message.author.displayName}...`, LogStatus.Failed, LogLevel.Warn, err.stack));
        LogMessage('ScheduleWar.Permissions.SendMessage', 'Can\'t send messages... Missing permissions...', context, LogStatus.Failed, LogLevel.Warn);
        return;
      }
      else {
        context.reply('I don\'t have the permissions needed for this command!\nPlease make sure to give me at least the following permissions:\n```Required permissions:\n  SEND MESSAGES\n  EMBED LINKS\n  ADD REACTIONS\n  READ MESSAGE HISTORY\n\nOptional, but useful for the full functionality:\n  MANAGE MESSAGES```');
        LogMessage('ScheduleWar.Permissions', 'Missing permissions...', context, LogStatus.Failed, LogLevel.Warn);
        return;
      }
    }

    for (let time of times) {
      let timeFormat = '24';
      let rawTime = time;
      let clockDiscriminator = '';
      if (/^(?:(?:0?[0-9]|1[0-2])(:[0-5][0-9])?[aApP][mM])$/.test(time)) {
        timeFormat = '12';
        rawTime = time.substring(0, time.length - 2);
        clockDiscriminator = time.replace(/\d+/g, '').replace(/:/g, '').toUpperCase();
      }

      let colorCode = getRandomColor(((timeFormat == 24 ? (rawTime.replace(/:/g, '.')) : (clockDiscriminator == 'PM' ? (rawTime.replace(/:/g, '.')) * 2 : (rawTime.replace(/:/g, '.')))) + new Date().getDate()), context.message.guild, context.message.channel);

      let scheduleEmbed = new EmbedBuilder()
        .setColor(colorCode)
        .setTitle('**War ' + (rawTime + ' ' + clockDiscriminator).trim() + '**');

        context.reply({ embeds: [scheduleEmbed] })
        .then(newMessage => {
          checkDir(newMessage);
          fs.writeFileSync(appSchedule + context.message.guild.id + dirSplit + context.message.channel.id + dirSplit
            + newMessage.id + '.json', '{ "time": "' + time + '", "rawTime": "' + rawTime + '", "clockDiscriminator": "' + clockDiscriminator + '", "format": "' + timeFormat + '", "CAN": [], "CANT": [], "SUB": [], "NOTSURE": [], "DROPPED": [] }');
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
            created: new Date()
          });

          // ToDo: Error handling in case newMessage does not exist...
          newMessage.react('✅').then(() => newMessage.react('❕')).then(() => newMessage.react('❔')).then(() => newMessage.react('❌'));
        })
        .catch((err) => LogApplication('ScheduleWar.Execute', 'Failed to send embed...', context, LogStatus.Executed, LogLevel.Error, err.stack))
        .then(() => fs.writeFileSync(appSchedule + context.message.guild.id + dirSplit + 'guildConfig.json', JSON.stringify(config)))
        .catch((err) => LogApplication('ScheduleWar.Execute', 'Failed to update guildConfig...', LogStatus.Executed, LogLevel.Error, err.stack));

      LogMessage('ScheduleWar.Execute', `Created schedule for ${time}`, context, LogStatus.Executed);
    }
  }
}