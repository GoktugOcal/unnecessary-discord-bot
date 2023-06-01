const Discord = require('discord.js');
const fs = require('fs');
const QuickChart = require('quickchart-js');
var lolHelper = require('../../helpers/lol_helper.js')


exports.create = () => {
    const command = new Discord.SlashCommandBuilder()
        .setName("trial")
        .setDescription("trial command")
        ;
    
    return command.toJSON()
}

exports.run = async (client, interaction) => {

    interaction.deferReply()

    lolHelper.lol_basic(client, interaction)

}