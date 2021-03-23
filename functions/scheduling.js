const fs = require('fs');
const { getRandomColor } = require('../functions/utility');
const log = require('./logger');
const { foldersplit, workingdirectory } = require('../config.json');

function getData(message) {
    let rawdata = fs.readFileSync(workingdirectory + foldersplit + 'scheduleTemp' + foldersplit + message.guild.id + foldersplit + message.channel.id + foldersplit 
        + message.id + '.json');
    return JSON.parse(rawdata);
}

function writeData(message, data) {
    let rawdata = JSON.stringify(data);
    fs.writeFileSync(workingdirectory + foldersplit + 'scheduleTemp' + foldersplit + message.guild.id + foldersplit + message.channel.id + foldersplit 
    + message.id + '.json', rawdata);
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
        title: '**War ' + (data.rawTime + ' ' + data.clockDiscriminator).trim() + '** ' + ((canCount >= 3 && canCount < 6) ? '(+' + (6 - canCount).toString() + ')' : '') + (isOld == true ? ' - old' : ''),
        fields: msgData
    };
}

function getIndex (arr, id) {
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
            log.logWarData(message.guild, message.channel, user, 'Removed from CAN');
        }
    }
    if (para.includes('CANT')) {
        let index = getIndex(data.CANT, user.id);
        if (index > -1) {
            data.CANT.splice(index, 1);
            log.logWarData(message.guild, message.channel, user, 'Removed from CANT');
        }
    }
    if (para.includes('SUB')) {
        let index = getIndex(data.SUB, user.id);
        if (index > -1) {
            data.SUB.splice(index, 1);
            log.logWarData(message.guild, message.channel, user, 'Removed from SUB');
        }
    }
    if (para.includes('NOTSURE')) {
        let index = getIndex(data.NOTSURE, user.id);
        if (index > -1) {
            data.NOTSURE.splice(index, 1);
            log.logWarData(message.guild, message.channel, user, 'Removed from NOTSURE');
        }
    }
    if (para.includes('DROPPED')) {
        let index = getIndex(data.DROPPED, user.id);
        if (index > -1) {
            data.DROPPED.splice(index, 1);
            log.logWarData(message.guild, message.channel, user, 'Removed from DROPPED');
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
                name: user.username, 
                id: user.id, 
                dropped: false, 
                created: (new Date()).toString(), 
                changed: (new Date()).toString() 
            });
            log.logWarData(message.guild, message.channel, user, 'Added to CAN');
        }
        else {
            let oldEntry = getExistingEntry(data, user.id);
            data = removeFromData(data, user, ['CANT', 'SUB', 'NOTSURE', 'DROPPED'], message);

            data.CAN.push({ 
                name: user.username, 
                id: user.id, 
                dropped: false, 
                created: oldEntry.created, 
                changed: (new Date()).toString() 
            });
            log.logWarData(message.guild, message.channel, user, 'Added to CAN');
        }

        writeData(message, data);
        message.edit({embed: buildMessage(message, data)});
    },

    addSub: (message, user) => {
        let data = getData(message);

        if (getIndex(data.SUB, user.id) != -1) {
            return;
        }

        let newEntry = getIsNew(data, user.id);

        if (newEntry == true) {
            data.SUB.push({ 
                name: user.username, 
                id: user.id, 
                dropped: false, 
                created: (new Date()).toString(), 
                changed: (new Date()).toString() 
            });
            log.logWarData(message.guild, message.channel, user, 'Added to SUB');
        }
        else {
            let oldEntry = getExistingEntry(data, user.id);
            data = removeFromData(data, user, ['CANT', 'CAN', 'NOTSURE', 'DROPPED'], message);

            data.SUB.push({ 
                name: user.username, 
                id: user.id, 
                dropped: false, 
                created: oldEntry.created, 
                changed: (new Date()).toString() 
            });
            log.logWarData(message.guild, message.channel, user, 'Added to SUB');
        }

        writeData(message, data);
        message.edit({embed: buildMessage(message, data)});
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
                name: user.username, 
                id: user.id, 
                dropped: false, 
                created: (new Date()).toString(), 
                changed: (new Date()).toString() 
            });
            log.logWarData(message.guild, message.channel, user, 'Added to NOTSURE');
        }
        else {
            let oldEntry = getExistingEntry(data, user.id);
            data = removeFromData(data, user, ['CAN', 'CANT', 'SUB', 'DROPPED'], message);

            if (((new Date().getTime() - new Date(oldEntry.created).getTime()) / (1000 * 60)) > 30) {
                data.NOTSURE.push({ 
                    name: user.username, 
                    id: user.id, 
                    dropped: isDropped, 
                    created: oldEntry.created, 
                    changed: (new Date()).toString() 
                });
                log.logWarData(message.guild, message.channel, user, 'Added to NOTSURE');
            } 
            else {
                data.NOTSURE.push({ 
                    name: user.username, 
                    id: user.id, 
                    dropped: false, 
                    created: oldEntry.created, 
                    changed: (new Date()).toString() 
                });
                log.logWarData(message.guild, message.channel, user, 'Added to NOTSURE');
            }
        }

        writeData(message, data);
        message.edit({embed: buildMessage(message, data)});
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
                name: user.username, 
                id: user.id, 
                dropped: false, 
                created: (new Date()).toString(), 
                changed: (new Date()).toString() 
            });
            log.logWarData(message.guild, message.channel, user, 'Added to CANT');
        }
        else {
            let oldEntry = getExistingEntry(data, user.id);
            data = removeFromData(data, user, ['CAN', 'SUB', 'NOTSURE'], message);

            if (((new Date().getTime() - new Date(oldEntry.created).getTime()) / (1000 * 60)) > 30) {
                if (isDropped == true) {
                    data.DROPPED.push({ 
                        name: user.username, 
                        id: user.id, 
                        dropped: true, 
                        created: oldEntry.created, 
                        changed: (new Date()).toString()  
                    });
                    log.logWarData(message.guild, message.channel, user, 'Added to DROPPED');
                }
                else {
                    data.CANT.push({ 
                        name: user.username, 
                        id: user.id, 
                        dropped: false, 
                        created: oldEntry.created, 
                        changed: (new Date()).toString()  
                    });
                    log.logWarData(message.guild, message.channel, user, 'Added to CANT');
                }
            } 
            else {
                data.CANT.push({ 
                    name: user.username, 
                    id: user.id, 
                    dropped: false,
                    created: oldEntry.created, 
                    changed: (new Date()).toString()  
                });
                log.logWarData(message.guild, message.channel, user, 'Added to CANT');
            }
        }

        writeData(message, data);
        message.edit({embed: buildMessage(message, data)});
    },

    removeEntry: (message, user) => {
        let data = getData(message);
        data = removeFromData(data, user, ['CAN', 'CANT', 'SUB', 'NOTSURE', 'DROPPED'], message);
        writeData(message, data);
        message.edit({embed: buildMessage(message, data)});
    }
}
