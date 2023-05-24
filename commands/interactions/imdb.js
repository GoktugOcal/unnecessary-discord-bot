const request = require('sync-request');
const Discord = require('discord.js');

apikey = "8b528233";

exports.run = (client, message, args) => {

    movieName = ""
    messContent = message.content.split(" ")
    if (messContent.length > 1) {
        movieName = messContent[1]
        for (var i = 2; i < messContent.length; i++) {
            movieName = movieName + "+" + messContent[i]
        }
    }

    var respond = request('GET', "http://www.omdbapi.com/?t=" + movieName + "&apikey=" + apikey)
    respond = JSON.parse(respond.getBody('utf8'))
    console.log(respond)

    if (respond["Response"] !== "False") {

        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#FF5733')
            .setTitle(respond["Title"])
            .setDescription(respond["Plot"])
            .addFields({ name: 'Genre', value: respond["Genre"], inline: true }, { name: 'Runtime', value: respond["Runtime"], inline: true }, { name: 'Release Date', value: respond["Released"], inline: true }, )
            .addField("Director", respond["Director"], true)
            .addField("Actors", respond["Actors"], true)
            .addField("Rating (IMDB)", respond["imdbRating"])
            .setThumbnail(respond["Poster"])
            .setTimestamp()
            .setFooter("Project A Bot pek yakında sinemalarda", client.user.avatarURL())
            .setURL("https://www.imdb.com/title/" + respond["imdbID"]);

        message.channel.send(exampleEmbed)
    } else {
        message.channel.send("Böyle bir film bulunamadı 🧐")
    }
}