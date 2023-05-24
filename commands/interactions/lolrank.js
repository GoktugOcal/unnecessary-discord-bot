const request = require('sync-request');
const Discord = require('discord.js');
const fs = require('fs')

exports.run = (client, message, args) => {

    cdnVersion = JSON.parse(request('GET', "https://ddragon.leagueoflegends.com/api/versions.json").getBody('utf8'))[0]
    apikey = "RGAPI-59ffceb5-cdef-488b-8e9d-70fbdc1e6749";
    summonerName = ""
    region = ""
    messContent = message.content.split(" ")
    if (messContent.length > 1) {
        summonerName = messContent[1]
        region = messContent[2]

        var summonerInfo = request('GET', 'https://' + region + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName + '?api_key=' + apikey)
        if (summonerInfo.statusCode === 200) {
            summonerInfo = JSON.parse(summonerInfo.getBody('utf8'))
            let summonerID = summonerInfo['id'];
            let summonerIconID = summonerInfo['profileIconId'];

            var rankInfo = request('GET', 'https://' + region + '.api.riotgames.com/lol/league/v4/entries/by-summoner/' + summonerID + '?api_key=' + apikey)

            if (rankInfo.getBody('utf8') === "[]") {
                message.channel.send("Görünüşe göre henüz bir derecelendirmen yok 😫 Git biraz LOL oyna")
            } else {
                rankInfo = JSON.parse(rankInfo.getBody('utf8'))
                
                if(rankInfo.length > 1){
                    console.log(rankInfo.length)
                    var exampleEmbed = new Discord.MessageEmbed()
                        .setColor('#FF5733')
                        .setTitle(rankInfo[0]["summonerName"])
                        .setThumbnail("http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/img/profileicon/" + summonerIconID + ".png")
                        .setDescription("Level : " + summonerInfo["summonerLevel"])
                        .addField("```Ranked Solo```", rankInfo[0]["tier"] + "    " + rankInfo[0]["rank"], false)
                        .addFields({ name: 'Wins', value: rankInfo[0]["wins"], inline: true }, { name: 'Losses', value: rankInfo[0]["losses"], inline: true }, { name: 'Hot Streak', value: rankInfo[0]["hotStreak"], inline: true }, { name: 'League Points', value: rankInfo[0]["leaguePoints"], inline: true })
                        .addField("```Ranked Flex```", rankInfo[1]["tier"] + "    " + rankInfo[1]["rank"], false)
                        .addFields({ name: 'Wins', value: rankInfo[1]["wins"], inline: true }, { name: 'Losses', value: rankInfo[1]["losses"], inline: true }, { name: 'Hot Streak', value: rankInfo[1]["hotStreak"], inline: true }, { name: 'League Points', value: rankInfo[1]["leaguePoints"], inline: true })
                        .setFooter("Project A Bot'tan sevgilerle", client.user.avatarURL());
                }
                else{
                    console.log("$")
                    console.log(rankInfo.length)
                    var exampleEmbed = new Discord.MessageEmbed()
                        .setColor('#FF5733')
                        .setTitle(rankInfo[0]["summonerName"])
                        .setThumbnail("http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/img/profileicon/" + summonerIconID + ".png")
                        .setDescription("Level : " + summonerInfo["summonerLevel"])
                        .addField("```Ranked Solo```", rankInfo[0]["tier"] + "    " + rankInfo[0]["rank"], false)
                        .addFields({ name: 'Wins', value: rankInfo[0]["wins"], inline: true }, { name: 'Losses', value: rankInfo[0]["losses"], inline: true }, { name: 'Hot Streak', value: rankInfo[0]["hotStreak"], inline: true }, { name: 'League Points', value: rankInfo[0]["leaguePoints"], inline: true })
                        .setFooter("Project A Bot'tan sevgilerle", client.user.avatarURL());
                }
                
                message.channel.send(exampleEmbed)
            }
        } else {
            message.channel.send("Yanlış bir şeyler var 🙄")

        }


    } else {
        message.channel.send("Sihirdar Adı? Bölge?")
    }
}



// 

// http://ddragon.leagueoflegends.com/cdn/10.14.1/img/profileicon/4568.png // Profile Icon

// var respond = request('GET', 'https://' + region + '.api.riotgames.com/val/content/v1/contents' + '?api_key=' + apikey)
// console.log(JSON.parse(respond.getBody('utf8')))

// LOL RANK
// var respond = request('GET', 'https://' + region + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName + '?api_key=' + apikey)
// let summonerID = JSON.parse(respond.getBody('utf8'))['id'];
// console.log(JSON.parse(respond.getBody('utf8')))

// var respond = request('GET', 'https://' + region + '.api.riotgames.com/lol/league/v4/entries/by-summoner/' + summonerID + '?api_key=' + apikey)

// console.log(JSON.parse(respond.getBody('utf8')))
// if (respond.getBody('utf8') === "[]") {
//     console.log("Görünüşe göre henüz bir derecelendirmen yok 😫 Git biraz LOL oyna")
// } else {
//     rankInfo = JSON.parse(respond.getBody('utf8'))

//     var summonerTIER = rankInfo[0]["tier"];
//     var summonerRANK = rankInfo[0]["rank"];

//     console.log(summonerTIER + " " + summonerRANK)
// }





// request('https://tr1.api.riotgames.com/lol/league/v4/entries/by-summoner/qlqkfF0oYqwX12lh3h0OuS8kq2_TErWZgZntsmAYgJCF-0w?api_key=RGAPI-184f1ce6-ce86-473b-bfc0-c141cc25b15f', function(error, response, body) {
//     console.error('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     console.log('body:', body); // Print the HTML for the Google homepage.
// });