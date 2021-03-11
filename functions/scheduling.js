const fs = require('fs');
const seedrandom = require('seedrandom');
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

function buildMessage(message, data) {
    let msgData = [];
    if (data.CAN.length > 0) {
        let canStr = '';
        data.CAN.forEach(item => {
            if (canStr != '') {
                canStr += ', ';
            }
            canStr += item.name;
        });
        msgData.push({ name: "Can (" + data.CAN.length + ")", value: canStr });
    }
    if (data.SUB.length > 0) {
        let subStr = '';
        data.SUB.forEach(item => {
            if (subStr != '') {
                subStr += ', ';
            }
            subStr += item.name;
        });
        msgData.push({ name: "Can sub (" + data.SUB.length + ")", value: subStr });
    }
    if (data.NOTSURE.length > 0) {
        let notSureStr = '';
        data.NOTSURE.forEach(item => {
            if (notSureStr != '') {
                notSureStr += ', ';
            }
            notSureStr += item.name;
        });
        msgData.push({ name: "Not sure (" + data.NOTSURE.length + ")", value: notSureStr });
    }
    if (data.CANT.length > 0) {
        let cantStr = '';
        data.CANT.forEach(item => {
            if (cantStr != '') {
                cantStr += ', ';
            }
            cantStr += item.name;
        });
        msgData.push({ name: "Can't (" + data.CANT.length + ")", value: cantStr });
    }
    if (data.DROPPED.length > 0) {
        let droppedStr = '';
        data.DROPPED.forEach(item => {
            if (droppedStr != '') {
                droppedStr += ', ';
            }
            droppedStr += item.name;
        });
        msgData.push({ name: "Dropped (" + data.DROPPED.length + ")", value: droppedStr });
    }

    let colorCode = getColor(data.time, message.guild, message.channel);
    return {
        color: colorCode,
        title: 'War ' + data.time,
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

function removeFromData(data, user, para) {
    if (para.includes('CAN')) {
        let index = getIndex(data.CAN, user.id);
        if (index > -1) {
            data.CAN.splice(index, 1);
        }
    }
    if (para.includes('CANT')) {
        let index = getIndex(data.CANT, user.id);
        if (index > -1) {
            data.CANT.splice(index, 1);
        }
    }
    if (para.includes('SUB')) {
        let index = getIndex(data.SUB, user.id);
        if (index > -1) {
            data.SUB.splice(index, 1);
        }
    }
    if (para.includes('NOTSURE')) {
        let index = getIndex(data.NOTSURE, user.id);
        if (index > -1) {
            data.NOTSURE.splice(index, 1);
        }
    }
    if (para.includes('DROPPED')) {
        let index = getIndex(data.DROPPED, user.id);
        if (index > -1) {
            data.DROPPED.splice(index, 1);
        }
    }

    return data;
}

module.exports = {
    addCan: (message, user) => {
        let data = getData(message);
        data = removeFromData(data, user, ['CANT', 'SUB', 'NOTSURE', 'DROPPED']);

        if (getIndex(data.CAN, user.id) == -1) {
            data.CAN.push({ name: user.username, id: user.id });
        }
        else {
            return;
        }

        writeData(message, data);
        message.edit({embed: buildMessage(message, data)});
    },

    addSub: (message, user) => {
        let data = getData(message);
        data = removeFromData(data, user, ['CAN', 'CANT', 'NOTSURE', 'DROPPED']);

        if (getIndex(data.SUB, user.id) == -1) {
            data.SUB.push({ name: user.username, id: user.id });
        }
        else {
            return;
        }

        writeData(message, data);
        message.edit({embed: buildMessage(message, data)});
    },

    addNotSure: (message, user) => {
        let data = getData(message);
        let isDropped = false;
        if (getIndex(data.CAN, user.id) != -1) {
            isDropped = true;
        }
        if (getIndex(data.SUB, user.id) != -1) {
            isDropped = true;
        }
	if (getIndex(data.CANT, user.id) != -1 && data.CANT[getIndex(data.CANT, user.id)].dropped == true) {
            isDropped = true;
	}

        data = removeFromData(data, user, ['CAN', 'CANT', 'SUB', 'DROPPED']);

        if (getIndex(data.NOTSURE, user.id) == -1) {
            data.NOTSURE.push({ name: user.username, id: user.id, dropped: isDropped });
        }
        else {
            return;
        }

        writeData(message, data);
        message.edit({embed: buildMessage(message, data)});
    },

    addCant: (message, user) => {
        let data = getData(message);

        let isDropped = false;
        if (getIndex(data.CAN, user.id) != -1) {
            isDropped = true;
        }
        if (getIndex(data.SUB, user.id) != -1) {
            isDropped = true;
        }
        if (getIndex(data.NOTSURE, user.id) != -1 && data.NOTSURE[getIndex(data.NOTSURE, user.id)].dropped == true) {
            isDropped = true;
        }
        if (getIndex(data.DROPPED, user.id) != -1) {
            isDropped = true;
        }

        data = removeFromData(data, user, ['CAN', 'SUB', 'NOTSURE']);

        if (isDropped == true) {
            if (getIndex(data.DROPPED, user.id) == -1) {
                data.DROPPED.push({ name: user.username, id: user.id, dropped: true });
            }
            else {
                return;
            }
        }
        else {
            if (getIndex(data.CANT, user.id) == -1) {
                data.CANT.push({ name: user.username, id: user.id, dropped: false });
            }
            else {
                return;
            }
        }

        writeData(message, data);
        message.edit({embed: buildMessage(message, data)});
    },
}
