const Discord = require('discord.js');
const fs = require('fs');

exports.run = async (client, interaction) => {
    await interaction.reply("pong!");
}