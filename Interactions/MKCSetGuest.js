const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { v4: uuid } = require('uuid');
const MKC = require('../Modules/MKCData/SetMKCTeam');
const GlobalHelper = require('../ClientHandlers/InteractionCache')
const Helper = require('../Modules/MKCData/MessageRowHelper');
const color = require('../Modules/ColorHelper');

function buildMessage(interaction, filter, page, isSelected, teamItems, selectedItem = null) {
    let filterRow = Helper.getFilterRow('guest', filter);
    let selectRow = Helper.getSelectRow('guest', teamItems, page, selectedItem);
    let pageRow = Helper.getPaginationRow('guest', teamItems, page, isSelected);
    let msgEmbed = new Discord.MessageEmbed()
        .setColor(color.getRandomColor(interaction.guild.id, interaction.channel.id, interaction.user.id))
        .setTitle('Select the guest team:')
        .setDescription('You can filter teams by clicking the buttons. (default-filter: 150cc)\nAnd because Discords API sucks, there can only be 25 teams per page...');
    return { embeds: [msgEmbed], components: [filterRow, selectRow, pageRow], ephemeral: true };
}

function loadTeamItems(filter) {
    return new Promise((resolve) => {
        Helper.getTeams(filter)
        .then((result) => {
            resolve(result);
        });
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guest')
        .setDescription('Set the guest team for your overlay from MKC.'),
    IsDMCommand: false,

    /**
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(interaction) {
        if (interaction.guild == null) {
            interaction.reply({ content: 'This command can\'t be executed in direct messages!' });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        let filter = '150cc';
        let page = 0;
        let isSelected = false;
        let teamItems = null;
        
        loadTeamItems(filter)
        .then((result) => {
            teamItems = result;
            global.InteractionCache.push({
                id: uuid(),
                baseInteraction: interaction,
                commandName: 'guest',
                options: {
                    filter: filter,
                    page: page,
                    isSelected: isSelected,
                    teamItems: teamItems
                },
                isComplete: false
            });
            interaction.editReply(buildMessage(interaction, filter, page, isSelected, teamItems));
        });
    },

    async updateByBtn(btnInteraction, cachedInteraction, btnId) {
        let newFilter = cachedInteraction.options.filter;
        let newPage = cachedInteraction.options.page;
        let confirmed = false;
        let baseInteraction = cachedInteraction.baseInteraction;
        switch(btnId) {
            case 'guestFilterAllActive':
                newFilter = 'active';
                newPage = 0;
                break;
            case 'guestFilter150cc':
                newFilter = '150cc';
                newPage = 0;
                break;
            case 'guestFilter200cc':
                newFilter = '200cc';
                newPage = 0;
                break;
            case 'guestFilterTourVS':
                newFilter = 'mktour_vs';
                newPage = 0;
                break;
            case 'guestFilterHistorical':
                newFilter = 'historical';
                newPage = 0;
                break;
            case 'guestPaginationLeft':
                newPage = cachedInteraction.options.page - 1;
                break;
            case 'guestPaginationRight':
                newPage = cachedInteraction.options.page + 1;
                break;
            case 'guestConfirm':
                confirmed = true;
                break;
        }

        if (confirmed == false && newFilter == cachedInteraction.options.filter) {
            global.InteractionCache.push({
                id: uuid(),
                baseInteraction: baseInteraction,
                commandName: 'guest',
                options: {
                    filter: newFilter,
                    page: newPage,
                    isSelected: cachedInteraction.options.isSelected,
                    teamItems: cachedInteraction.options.teamItems
                },
                isComplete: false
            });
            btnInteraction.update(buildMessage(baseInteraction, newFilter, newPage, cachedInteraction.options.isSelected, cachedInteraction.options.teamItems));
            GlobalHelper.RemoveById(cachedInteraction.id);
        }
        else if (confirmed == false && newFilter != cachedInteraction.options.filter) {
            //await btnInteraction.deferReply();
            loadTeamItems(newFilter)
            .then(async (result) => {
                let teamItems = result;
                global.InteractionCache.push({
                    id: uuid(),
                    baseInteraction: baseInteraction,
                    commandName: 'guest',
                    options: {
                        filter: newFilter,
                        page: newPage,
                        isSelected: cachedInteraction.options.isSelected,
                        teamItems: teamItems
                    },
                    isComplete: false
                });
                btnInteraction.update(buildMessage(baseInteraction, newFilter, newPage, cachedInteraction.options.isSelected, teamItems));
                GlobalHelper.RemoveById(cachedInteraction.id);
            });
        }
        else if (confirmed == true) {
            MKC.SetGuestTeam(cachedInteraction.options.selectedItem, btnInteraction.guild, btnInteraction.channel, btnInteraction.user)
            .then(() => {
                btnInteraction.update({ content: 'All done 👍', embeds: [], components: [], ephemeral: true });
                GlobalHelper.RemoveById(cachedInteraction.id);
            })
        }
    },

    updateBySelect: (selectInteraction, cachedInteraction) => {
        let selection = selectInteraction.values[0];
        global.InteractionCache.push({
            id: uuid(),
            baseInteraction: cachedInteraction.baseInteraction,
            commandName: 'guest',
            options: {
                filter: cachedInteraction.options.filter,
                page: cachedInteraction.options.page,
                isSelected: true,
                teamItems: cachedInteraction.options.teamItems,
                selectedItem: selection
            },
            isComplete: false
        });
        selectInteraction.update(buildMessage(cachedInteraction.baseInteraction, cachedInteraction.options.filter, cachedInteraction.options.page, true, cachedInteraction.options.teamItems, selection));
        GlobalHelper.RemoveById(cachedInteraction.id);
    }
}
