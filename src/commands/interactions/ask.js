const request = require('sync-request');
const Discord = require('discord.js');
const fs = require('fs')
// const bard = require('../../helpers/bard.js')
const Chatbot = require("../../helpers/chatbot_bard.js")


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

    const chatbot = new Chatbot(process.env.Secure1PSID);

    
    //"Do not talk just give the answer in maximum 3 sentences. "
    // const prompt = interaction.options.getString('prompt') + " Make it short in 3 sentences."
    const prompt = interaction.options.getString('prompt') + " Make it short in one paragraph."


    // const res = await bard.ask(prompt)
    // interaction.editReply(res)


    const response = await chatbot.ask(prompt);
    interaction.editReply(response.content);
    
}