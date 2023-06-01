const request = require('sync-request');
const Discord = require('discord.js');
const fs = require('fs')
const bard = require('../../helpers/bard.js')

exports.create = () => {
    const command = new Discord.SlashCommandBuilder()
        .setName("ask")
        .setDescription("Ask a question to BARD chatbot")
        .addStringOption( (option) =>
            option.setName("prompt")
            .setDescription("Give your prompt.")
            .setRequired(true)
        )
        ;
    return command.toJSON()
}

exports.run = async (client, interaction) => {

    let message = await interaction.deferReply(
        {
            fetchReply: true
        }
    )

    const prompt = "Do not talk just give the answer in maximum 3 sentences. " + interaction.options.getString('prompt')

    interaction.editReply(await bard.ask())

}