const Discord = require('discord.js');
const fs = require('fs');

exports.create = () => {
    const command = new Discord.SlashCommandBuilder()
        .setName("trial")
        .setDescription("trial command")
        .addUserOption((option) =>
                option.setName("option1")
                .setDescription("empty option no 1")
        )
        .addMentionableOption( (option) =>
            option.setName("mentionable-option")
            .setDescription("mention trial")
        );
    
    return command.toJSON()
}

exports.run = async (client, interaction) => {
    await interaction.reply("at least I tried!");
}