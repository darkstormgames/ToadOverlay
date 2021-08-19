const Discord = require('discord.js');
const MKC = require('../MKC/SearchEngine');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    getFilterRow: (commandName, activeFilter) => {
        let row = new Discord.MessageActionRow();
        row.addComponents(new Discord.MessageButton()
            .setCustomId(commandName + 'FilterAllActive')
            .setLabel('All Active Teams')
            .setStyle(activeFilter == 'active' ? 'SUCCESS' : 'PRIMARY')
            .setDisabled(activeFilter == 'active' ? true : false));
        
        row.addComponents(new Discord.MessageButton()
            .setCustomId(commandName + 'Filter150cc')
            .setLabel('MK8DX 150cc')
            .setStyle(activeFilter == '150cc' ? 'SUCCESS' : 'PRIMARY')
            .setDisabled(activeFilter == '150cc' ? true : false));
        
        row.addComponents(new Discord.MessageButton()
            .setCustomId(commandName + 'Filter200cc')
            .setLabel('MK8DX 200cc')
            .setStyle(activeFilter == '200cc' ? 'SUCCESS' : 'PRIMARY')
            .setDisabled(activeFilter == '200cc' ? true : false));
        
        row.addComponents(new Discord.MessageButton()
            .setCustomId(commandName + 'FilterTourVS')
            .setLabel('MKTour VS Race')
            .setStyle(activeFilter == 'mktour_vs' ? 'SUCCESS' : 'PRIMARY')
            .setDisabled(activeFilter == 'mktour_vs' ? true : false));
        
        row.addComponents(new Discord.MessageButton()
            .setCustomId(commandName + 'FilterHistorical')
            .setLabel('Historical Teams')
            .setStyle(activeFilter == 'historical' ? 'SUCCESS' : 'PRIMARY')
            .setDisabled(activeFilter == 'historical' ? true : false));

        return row;
    },

    getTeams: (activeFilter) => {
        return new Promise((resolve) => {
            switch (activeFilter) {
                case 'active': 
                    MKC.getActiveTeams().then((result) => {
                        resolve(result.data);
                    });
                    break;
                case '150cc':
                    MKC.get150ccTeams().then((result) => {
                        resolve(result.data);
                    });
                    break;
                case '200cc':
                    MKC.get200ccTeams().then((result) => {
                        resolve(result.data);
                    });
                    break;
                case 'mktour_vs':
                    MKC.getMKTourTeams().then((result) => {
                        resolve(result.data);
                    });
                    break;
                case 'historical':
                    MKC.getHistoricalTeams().then((result) => {
                        resolve(result.data);
                    });
                    break;
            }
        });
    },

    getSelectRow: (commandName, teamItems, page, selected = null) => {
        let items = [];
        for (let i = (page * 25); i < (page * 25 + 25); i++) {
            if (teamItems[i] != undefined && teamItems[i] != null) {
                items.push({
                    label: teamItems[i].team_name,
                    description: teamItems[i].team_tag,
                    value: teamItems[i].team_id.toString(),
                    default: selected != null ? (selected == teamItems[i].team_id.toString() ? true : false) : false,
                });
            }
        }
        let row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
                .setCustomId(commandName + 'TeamSelect')
                .setPlaceholder('Select a team... ("' + teamItems[page * 25].team_name + '" - "' + (teamItems.length > (page * 25 + 24) ? teamItems[page * 25 + 24].team_name : teamItems[teamItems.length - 1].team_name) + '")')
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(items)
        );

        return row;
    },

    getPaginationRow: (commandName, teamItems, page, isSelected) => {
        let pageRow = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId(commandName + 'Confirm')
                    .setLabel('Confirm')
                    .setStyle('SUCCESS')
                    .setDisabled(isSelected == true ? false : true),
                new Discord.MessageButton()
                    .setCustomId(commandName + 'PaginationLeft')
                    .setLabel('<<')
                    .setStyle('PRIMARY')
                    .setDisabled(page == 0 ? true : false),
                new Discord.MessageButton()
                .setCustomId(commandName + 'PaginationPage')
                    .setLabel((page + 1) + '/' + Math.ceil(teamItems.length / 25))
                    .setStyle('PRIMARY')
                    .setDisabled(true),
                new Discord.MessageButton()
                    .setCustomId(commandName + 'PaginationRight')
                    .setLabel('>>')
                    .setStyle('PRIMARY')
                    .setDisabled(page == (Math.ceil(teamItems.length / 25)) ? true : false)
            );
        return pageRow;
    }
}
