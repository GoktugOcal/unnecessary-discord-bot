const request = require('sync-request');
const Discord = require('discord.js');

apikey = process.env.OMDB_API;

exports.create = () => {
    const command = new Discord.SlashCommandBuilder()
        .setName("imdb")
        .setDescription("Movie information")
        .addStringOption( (option) =>
            option.setName("name")
            .setDescription("A movie name")
            .setRequired(true)
        )
        ;
    return command.toJSON()
}

exports.run = async (client, interaction, args) => {

    await interaction.deferReply()

    try{
        movieName = interaction.options.getString('name')

        var respond = request('GET', "http://www.omdbapi.com/?t=" + movieName + "&apikey=" + apikey)
        respond = JSON.parse(respond.getBody('utf8'))

        if (respond["Response"] !== "False") {

            const exampleEmbed = new Discord.EmbedBuilder()
                .setColor('#FF5733')
                .setTitle(respond["Title"])
                .setThumbnail(respond["Poster"])
                .setDescription(respond["Plot"])
                .addFields({ name: 'Genre', value: respond["Genre"], inline: true }, { name: 'Runtime', value: respond["Runtime"], inline: true }, { name: 'Release Date', value: respond["Released"], inline: true }, )
                .addFields({ name: "Director", value: respond["Director"]})
                .addFields({ name: "Actors", value: respond["Actors"]})
                .addFields({ name: "Rating (IMDB)", value:  respond["imdbRating"]})
                // .addField("Director", respond["Director"], true)
                // .addField("Actors", respond["Actors"], true)
                // .addField("Rating (IMDB)", respond["imdbRating"])
                .setFooter(
                    { text: "Now the lord is in theaters", iconURL: client.user.avatarURL()})
                .setImage(respond["Poster"])
                .setURL("https://www.imdb.com/title/" + respond["imdbID"]);

            interaction.editReply({
                embeds: [exampleEmbed]
            })
        } else {
            interaction.editReply("The movie cannot be found 🧐")
        }
    } catch {
        message.edit("Something is wrong 👨‍💻");
        return 0;
    }
}