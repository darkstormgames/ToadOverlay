const fs = require('fs');
const { getRandomColor } = require('../Help/ColorHelper');
const { LogApplication, LogLevel, LogStatus } = require('../Log/Logger');
// ToDo: implement LogReactions for debugging and tracing...

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

function getData(message) {
  checkDir(message);

  if (!fs.existsSync(appSchedule + message.guild.id + dirSplit + message.channel.id + dirSplit + message.id + '.json')) {
    LogApplication('WarScheduling.GetData', `Running failsafe measures for ${message.embeds[0].title} (${message.id}) in ${message.channel.name} (${message.channel.id}) on ${message.guild.name} (${message.guild.id})`, LogStatus.Failed, LogLevel.Warn);
    let msgData = message.embeds[0].title.split(' ');
    LogApplication('WarScheduling.GetData', `${msgData}`, LogStatus.Executing, LogLevel.Trace);
    let time = msgData[1].replace('*', '').replace('*', '') + (msgData[2] && (msgData[2].startsWith('AM') || msgData[2].startsWith('PM')) ?  msgData[2].replace('*', '').replace('*', '') : '');
    let timeFormat = (msgData[2] && (msgData[2].startsWith('AM') || msgData[2].startsWith('PM')) ?  '12' : '24');
    let clockDiscriminator = (msgData[2] && (msgData[2].startsWith('AM') || msgData[2].startsWith('PM')) ?  msgData[2].replace('*', '').replace('*', '') : '');
    let rawTime = msgData[1].replace('*', '').replace('*', '');
    LogApplication('WarScheduling.GetData', `${time}\n${timeFormat}\n${clockDiscriminator}\n${rawTime}`, LogStatus.Executing, LogLevel.Trace);

    fs.writeFileSync(appSchedule + message.guild.id + dirSplit + message.channel.id + dirSplit + message.id + '.json', 
      '{ "time": "' + time + '", "rawTime": "' + rawTime + '", "clockDiscriminator": "' + clockDiscriminator + '", "format": "' + timeFormat + '", "CAN": [], "CANT": [], "SUB": [], "NOTSURE": [], "DROPPED": [] }')
  }

  let rawdata = fs.readFileSync(appSchedule + message.guild.id + dirSplit + message.channel.id + dirSplit + message.id + '.json');
  return JSON.parse(rawdata);
}

function writeData(message, data) {
  checkDir(message);
  let rawdata = JSON.stringify(data);
  fs.writeFileSync(appSchedule + message.guild.id + dirSplit + message.channel.id + dirSplit + message.id + '.json', rawdata);
}

function buildMessage(message, data, isOld = false) {
  let msgData = [];
  let canCount = 0;
  if (data.CAN.length > 0) {
    let canStr = '';
    data.CAN.forEach(item => {
      if (canStr != '') {
        canStr += ', ';
      }
      canStr += item.name;
      canCount++;
    });
    msgData.push({ name: "✅ Can (" + data.CAN.length + ")", value: canStr });
  }
  if (data.SUB.length > 0) {
    let subStr = '';
    data.SUB.forEach(item => {
      if (subStr != '') {
        subStr += ', ';
      }
      subStr += item.name;
      canCount++;
    });
    msgData.push({ name: "❕Can sub (" + data.SUB.length + ")", value: subStr });
  }
  if (data.NOTSURE.length > 0) {
    let notSureStr = '';
    data.NOTSURE.forEach(item => {
      if (notSureStr != '') {
        notSureStr += ', ';
      }
      notSureStr += item.name;
    });
    msgData.push({ name: "❔ Not sure (" + data.NOTSURE.length + ")", value: notSureStr });
  }
  if (data.CANT.length > 0) {
    let cantStr = '';
    data.CANT.forEach(item => {
      if (cantStr != '') {
        cantStr += ', ';
      }
      cantStr += item.name;
    });
    msgData.push({ name: "❌ Can't (" + data.CANT.length + ")", value: cantStr });
  }
  if (data.DROPPED.length > 0) {
    let droppedStr = '';
    data.DROPPED.forEach(item => {
      if (droppedStr != '') {
        droppedStr += ', ';
      }
      droppedStr += item.name;
    });
    msgData.push({ name: "❌ Dropped (" + data.DROPPED.length + ")", value: droppedStr });
  }

  let colorCode = getRandomColor(((data.format == 24 ? (data.rawTime.replace(/:/g, '.')) : (data.clockDiscriminator == 'PM' ? (data.rawTime.replace(/:/g, '.')) * 2 : (data.rawTime.replace(/:/g, '.')))) + new Date().getDate()), message.guild, message.channel);
  return {
    color: colorCode,
    title: '**War ' + (data.rawTime + ' ' + data.clockDiscriminator).trim() + '** ' + ((canCount >= 3 && canCount < 6) ? '(+' + (6 - canCount).toString() + ')' : '') + (isOld == true ? '- old' : ''),
    fields: msgData
  };
}

function getIndex(arr, id) {
  for (let i = (arr.length - 1); i >= 0; i--) {
    if (arr[i].id == id) {
      return i;
    }
  }
  return -1;
}

function removeFromData(data, user, para, message) {
  if (para.includes('CAN')) {
    let index = getIndex(data.CAN, user.id);
    if (index > -1) {
      data.CAN.splice(index, 1);
      LogApplication('WarScheduling.Remove',
        `[${message.channel.name} (${message.channel.id})] Removed ${user.displayName} (${user.id}) from CAN on ${message.embeds[0].title}`,
        LogStatus.Executing, LogLevel.Debug);
    }
  }
  if (para.includes('CANT')) {
    let index = getIndex(data.CANT, user.id);
    if (index > -1) {
      data.CANT.splice(index, 1);
      LogApplication('WarScheduling.Remove',
        `[${message.channel.name} (${message.channel.id})] Removed ${user.displayName} (${user.id}) from CANT on ${message.embeds[0].title}`,
        LogStatus.Executing, LogLevel.Debug);
    }
  }
  if (para.includes('SUB')) {
    let index = getIndex(data.SUB, user.id);
    if (index > -1) {
      data.SUB.splice(index, 1);
      LogApplication('WarScheduling.Remove',
        `[${message.channel.name} (${message.channel.id})] Removed ${user.displayName} (${user.id}) from SUB on ${message.embeds[0].title}`,
        LogStatus.Executing, LogLevel.Debug);
    }
  }
  if (para.includes('NOTSURE')) {
    let index = getIndex(data.NOTSURE, user.id);
    if (index > -1) {
      data.NOTSURE.splice(index, 1);
      LogApplication('WarScheduling.Remove',
        `[${message.channel.name} (${message.channel.id})] Removed ${user.displayName} (${user.id}) from NOTSURE on ${message.embeds[0].title}`,
        LogStatus.Executing, LogLevel.Debug);
    }
  }
  if (para.includes('DROPPED')) {
    let index = getIndex(data.DROPPED, user.id);
    if (index > -1) {
      data.DROPPED.splice(index, 1);
      LogApplication('WarScheduling.Remove',
        `[${message.channel.name} (${message.channel.id})] Removed ${user.displayName} (${user.id}) from DROPPED on ${message.embeds[0].title}`,
        LogStatus.Executing, LogLevel.Debug);
    }
  }

  return data;
}

function getIsNew(data, userId) {
  return (getIndex(data.CAN, userId) == -1 &&
    getIndex(data.SUB, userId) == -1 &&
    getIndex(data.NOTSURE, userId) == -1 &&
    getIndex(data.CANT, userId) == -1 &&
    getIndex(data.DROPPED, userId) == -1);
}

function getExistingEntry(data, userId) {
  let index = getIndex(data.CAN, userId);
    if (index > -1) {
        return data.CAN[index];
    }
    index = getIndex(data.CANT, userId);
    if (index > -1) {
        return data.CANT[index];
    }
    index = getIndex(data.SUB, userId);
    if (index > -1) {
        return data.SUB[index];
    }
    index = getIndex(data.NOTSURE, userId);
    if (index > -1) {
        return data.NOTSURE[index];
    }
    index = getIndex(data.DROPPED, userId);
    if (index > -1) {
        return data.DROPPED[index];
    }

    return null;
}

function getIsDropped(data, userId) {
  if (getIndex(data.CAN, userId) != -1) {
    return true;
  }
  else if (getIndex(data.SUB, userId) != -1) {
    return true;
  }
  else if (getIndex(data.DROPPED, userId) != -1) {
    return true;
  }
  else if (getIndex(data.NOTSURE, userId) != -1 && data.NOTSURE[getIndex(data.NOTSURE, userId)].dropped == true) {
    return true;
  }
  else {
    return false;
  }
}

module.exports = {
  getMessage: (message, isOld = false) => {
    return buildMessage(message, getData(message), isOld);
  },

  addCan: (message, user) => {
    let data = getData(message);

    if (getIndex(data.CAN, user.id) != -1) {
      return;
    }

    let newEntry = getIsNew(data, user.id);

    if (newEntry == true) {
      data.CAN.push({
        name: user.displayName,
        id: user.id,
        dropped: false,
        created: (new Date()).toString(),
        changed: (new Date()).toString()
      });
      LogApplication('WarScheduling.CAN',
        `[${message.channel.name} (${message.channel.id})] Added new ${user.displayName} (${user.id}) to CAN on ${message.embeds[0].title} (${message.id})`,
        LogStatus.Executing, LogLevel.Debug);
    }
    else {
      let oldEntry = getExistingEntry(data, user.id);
      data = removeFromData(data, user, ['CANT', 'SUB', 'NOTSURE', 'DROPPED'], message);

      data.CAN.push({
        name: user.displayName,
        id: user.id,
        dropped: false,
        created: oldEntry.created,
        changed: (new Date()).toString()
      });
      LogApplication('WarScheduling.CAN',
        `[${message.channel.name} (${message.channel.id})] Added ${user.displayName} (${user.id}) to CAN on ${message.embeds[0].title} (${message.id})`,
        LogStatus.Executing, LogLevel.Debug);
    }

    writeData(message, data);
    message.edit({ embeds: [buildMessage(message, data)] });
  },

  addSub: (message, user) => {
    let data = getData(message);

    if (getIndex(data.SUB, user.id) != -1) {
      return;
    }

    let newEntry = getIsNew(data, user.id);

    if (newEntry == true) {
      data.SUB.push({
        name: user.displayName,
        id: user.id,
        dropped: false,
        created: (new Date()).toString(),
        changed: (new Date()).toString()
      });
      LogApplication('WarScheduling.SUB',
        `[${message.channel.name} (${message.channel.id})] Added new ${user.displayName} (${user.id}) to SUB on ${message.embeds[0].title} (${message.id})`,
        LogStatus.Executing, LogLevel.Debug);
    }
    else {
      let oldEntry = getExistingEntry(data, user.id);
      data = removeFromData(data, user, ['CANT', 'CAN', 'NOTSURE', 'DROPPED'], message);

      data.SUB.push({
        name: user.displayName,
        id: user.id,
        dropped: false,
        created: oldEntry.created,
        changed: (new Date()).toString()
      });
      LogApplication('WarScheduling.SUB',
        `[${message.channel.name} (${message.channel.id})] Added ${user.displayName} (${user.id}) to SUB on ${message.embeds[0].title} (${message.id})`,
        LogStatus.Executing, LogLevel.Debug);
    }

    writeData(message, data);
    message.edit({ embeds: [buildMessage(message, data)] });
  },

  addNotSure: (message, user) => {
    let data = getData(message);

    if (getIndex(data.NOTSURE, user.id) != -1) {
      return;
    }

    let newEntry = getIsNew(data, user.id);
    let isDropped = getIsDropped(data, user.id);

    if (newEntry == true) {
      data.NOTSURE.push({
        name: user.displayName,
        id: user.id,
        dropped: false,
        created: (new Date()).toString(),
        changed: (new Date()).toString()
      });
      LogApplication('WarScheduling.NOTSURE',
        `[${message.channel.name} (${message.channel.id})] Added new ${user.displayName} (${user.id}) to NOTSURE on ${message.embeds[0].title} (${message.id})`,
        LogStatus.Executing, LogLevel.Debug);
    }
    else {
      let oldEntry = getExistingEntry(data, user.id);
      data = removeFromData(data, user, ['CAN', 'CANT', 'SUB', 'DROPPED'], message);

      if (((new Date().getTime() - new Date(oldEntry.created).getTime()) / (1000 * 60)) > 30) {
        data.NOTSURE.push({
          name: user.displayName,
          id: user.id,
          dropped: isDropped,
          created: oldEntry.created,
          changed: (new Date()).toString()
        });
        LogApplication('WarScheduling.NOTSURE',
          `[${message.channel.name} (${message.channel.id})] Added ${user.displayName} (${user.id}) to NOTSURE on ${message.embeds[0].title} (${message.id})`,
          LogStatus.Executing, LogLevel.Debug);
      }
      else {
        data.NOTSURE.push({
          name: user.displayName,
          id: user.id,
          dropped: false,
          created: oldEntry.created,
          changed: (new Date()).toString()
        });
        LogApplication('WarScheduling.NOTSURE',
          `[${message.channel.name} (${message.channel.id})] Added ${user.displayName} (${user.id}) to NOTSURE on ${message.embeds[0].title} (${message.id})`,
          LogStatus.Executing, LogLevel.Debug);
      }
    }

    writeData(message, data);
    message.edit({ embeds: [buildMessage(message, data)] });
  },

  addCant: (message, user) => {
    let data = getData(message);

    if (getIndex(data.CANT, user.id) != -1 || getIndex(data.DROPPED, user.id) != -1) {
      return;
    }

    let newEntry = getIsNew(data, user.id);
    let isDropped = getIsDropped(data, user.id);

    if (newEntry == true) {
      data.CANT.push({
        name: user.displayName,
        id: user.id,
        dropped: false,
        created: (new Date()).toString(),
        changed: (new Date()).toString()
      });
      LogApplication('WarScheduling.CANT',
        `[${message.channel.name} (${message.channel.id})] Added new ${user.displayName} (${user.id}) to CANT on ${message.embeds[0].title} (${message.id})`,
        LogStatus.Executing, LogLevel.Debug);
    }
    else {
      let oldEntry = getExistingEntry(data, user.id);
      data = removeFromData(data, user, ['CAN', 'SUB', 'NOTSURE'], message);

      if (((new Date().getTime() - new Date(oldEntry.created).getTime()) / (1000 * 60)) > 30) {
        if (isDropped == true) {
          data.DROPPED.push({
            name: user.displayName,
            id: user.id,
            dropped: true,
            created: oldEntry.created,
            changed: (new Date()).toString()
          });
          LogApplication('WarScheduling.CANT',
            `[${message.channel.name} (${message.channel.id})] Added ${user.displayName} (${user.id}) to DROPPED on ${message.embeds[0].title} (${message.id})`,
            LogStatus.Executing, LogLevel.Debug);
        }
        else {
          data.CANT.push({
            name: user.displayName,
            id: user.id,
            dropped: false,
            created: oldEntry.created,
            changed: (new Date()).toString()
          });
          LogApplication('WarScheduling.CANT',
            `[${message.channel.name} (${message.channel.id})] Added ${user.displayName} (${user.id}) to CANT on ${message.embeds[0].title} (${message.id})`,
            LogStatus.Executing, LogLevel.Debug);
        }
      }
      else {
        data.CANT.push({
          name: user.displayName,
          id: user.id,
          dropped: false,
          created: oldEntry.created,
          changed: (new Date()).toString()
        });
        LogApplication('WarScheduling.CANT',
          `[${message.channel.name} (${message.channel.id})] Added ${user.displayName} (${user.id}) to CANT on ${message.embeds[0].title} (${message.id})`,
          LogStatus.Executing, LogLevel.Debug);
      }
    }

    writeData(message, data);
    message.edit({ embeds: [buildMessage(message, data)] });
  },

  removeEntry: (message, user) => {
    let data = getData(message);
    data = removeFromData(data, user, ['CAN', 'CANT', 'SUB', 'NOTSURE', 'DROPPED'], message);
    writeData(message, data);
    message.edit({ embeds: [buildMessage(message, data)] });
    LogApplication('WarScheduling.RemoveEntry',
      `[${message.channel.name} (${message.channel.id})] Removed ${user.displayName} (${user.id}) from ${message.embeds[0].title} (${message.id})`,
      LogStatus.Executing, LogLevel.Debug);
  }
}