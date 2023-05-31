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

    /*
    await client.guilds.cache.map(guild => {
        client.guilds.fetch(guild.id)
        guild.channels.cache.map( channel => {
            guild.channels.fetch(channel.id)
        })
    })*/

    /*
    await client.guilds.cache.map(guild => {
        client.guilds.get(guild.id).channels.cache.map( channel => {
            client.guilds.get(guild.id).channels.cache.get(channel.id).messages
        })
    })
        
    /*
    await client.channels.cache.get(data[guild.id]).messages.fetch()

    await client.channels.cache.map(channel => client.channels.fetch(channel.id))

    const Guilds = client.guilds.cache.map(guild => guild.id);
    */
    var message = await interaction.reply(
        {
            content: "Trial success!",
            fetchReply: true
        }
    )
    
    //await message.fetch()

    message.reply("and this is the reply")

}