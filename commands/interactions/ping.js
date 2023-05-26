const Discord = require('discord.js');
const fs = require('fs');

exports.create = () => {
    const command = new Discord.SlashCommandBuilder()
        .setName("ping")
        .setDescription("ping - pong test");
    
    return command.toJSON()
}

exports.run = async (client, interaction) => {
    await interaction.reply("pong!");
}