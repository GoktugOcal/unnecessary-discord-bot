const Discord = require('discord.js');

module.exports = {

    generateLastMatchButton: function () {
        return new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('lastMatchesButton')
                    .setLabel('Look at the last 5 matches')
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setEmoji("⚔")
            )
    },

    generatePaginationButton: function () {

        const previousPage = new Discord.ButtonBuilder()
            .setCustomId('previousPageButton')
            .setLabel('Newer')
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji("⏮");

        const nextPage = new Discord.ButtonBuilder()
            .setCustomId('nextPageButton')
            .setLabel('Older')
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji("⏭");

        const row = new Discord.ActionRowBuilder()
            .addComponents(
                previousPage,
                nextPage
            );

        return row
    },

    generateStatsButton: function () {
        const row = new Discord.ActionRowBuilder()
        this.stats_button_info.map( item => {
            row.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(item.label)
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setEmoji(item.emoji)
            )
        });
        return row
    },

    generateLoadingButton: function () {
        return new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("loading")
                    .setLabel('Loading')
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setEmoji('🚬')
                    .setDisabled(true)
            )
    },

    generateTimeoutButton: function () {
        return new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("timeOut")
                    .setLabel('Time Out')
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setEmoji('⌛')
                    .setDisabled(true)
            )
    },

    stats_button_info: [
        {
            id: 0,
            label: "buttonA",
            emoji: "🇦"
        },
        {
            id: 1,
            label: "buttonB",
            emoji: "🇧"
        },
        {
            id: 2,
            label: "buttonC",
            emoji: "🇨"
        },
        {
            id: 3,
            label: "buttonD",
            emoji: "🇩"
        },
        {
            id: 4,
            label: "buttonE",
            emoji: "🇪"
        }
    ],

    win_or_lose_logo: {
        "win" : ":white_check_mark:",
        "lose" : ":red_circle:"
    }
}