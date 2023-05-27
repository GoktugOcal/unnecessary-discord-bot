const Discord = require('discord.js');
const fs = require('fs');
const QuickChart = require('quickchart-js');


exports.create = () => {
    const command = new Discord.SlashCommandBuilder()
        .setName("trial")
        .setDescription("trial command")
        ;
    
    return command.toJSON()
}

exports.run = async (client, interaction) => {

    await interaction.deferReply()

    const chart = new QuickChart();
    chart.setConfig({
        type: 'bar',
        data: { labels: ['Hello world', 'Foo bar'], datasets: [{ label: 'Foo', data: [1, 2] }] },
    });

    const url = await chart.getShortUrl();

    await interaction.editReply(
        { files: [
            {attachment: url, name: "image.jpg"},
            ]
        }
    );

}