const request = require('sync-request');
const Discord = require('discord.js');
const fs = require('fs')

exports.create = () => {
    const command = new Discord.SlashCommandBuilder()
        .setName("lolrank")
        .setDescription("Summoner Information")
        .addStringOption( (option) =>
            option.setName("summoner-name")
            .setDescription("Summoner's name whose information you want to get.")
            .setRequired(true)
        )
        .addStringOption( (option) =>
            option.setName("summoner-region")
            .setDescription("Summoner's region.")
            .setRequired(true)
            .setChoices(
                { name: "BR1", value: "BR1" },
                { name: "EUN1", value: "EUN1" },
                { name: "EUW1", value: "EUW1" },
                { name: "JP1", value: "JP1" },
                { name: "KR", value: "KR" },
                { name: "LA1", value: "LA1" },
                { name: "LA2", value: "LA2" },
                { name: "NA1", value: "NA1" },   
                { name: "OC1", value: "OC1" },
                { name: "PH2", value: "PH2" },
                { name: "RU", value: "RU" },
                { name: "SG2", value: "SG2" },
                { name: "TH2", value: "TH2" },
                { name: "TR1", value: "TR1" },
                { name: "TW2", value: "TW2" },
                { name: "VN2", value: "VN2" }
            )
        )
        ;
    
    return command.toJSON()
}

exports.run = async (client, interaction) => {

    // const exampleEmbed = new Discord.EmbedBuilder()
    //     .setColor(0x0099FF)
    //     .setTitle('Some title')
    //     .setURL('https://discord.js.org/')
    //     .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
    //     .setDescription('Some description here')
    //     .setThumbnail('https://i.imgur.com/AfFp7pu.png')
    //     .addFields(
    //         { name: 'Regular field title', value: 'Some value here' },
    //         { name: '\u200B', value: '\u200B' },
    //         { name: 'Inline field title', value: 'Some value here', inline: true },
    //         { name: 'Inline field title', value: 'Some value here', inline: true },
    //     )
    //     .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
    //     .setImage('https://i.imgur.com/AfFp7pu.png')
    //     .setTimestamp()
    //     .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

    cdnVersion = JSON.parse(request('GET', "https://ddragon.leagueoflegends.com/api/versions.json").getBody('utf8'))[0]
    apikey = process.env.RIOT_API;
    summonerName = interaction.options.getString('summoner-name')
    region = interaction.options.getString('summoner-region')


    var summonerInfo = request('GET', 'https://' + region + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName + '?api_key=' + apikey)
    if (summonerInfo.statusCode === 200) {
        summonerInfo = JSON.parse(summonerInfo.getBody('utf8'))
        let summonerID = summonerInfo['id'];
        let summonerIconID = summonerInfo['profileIconId'];

        var rankInfo = request('GET', 'https://' + region + '.api.riotgames.com/lol/league/v4/entries/by-summoner/' + summonerID + '?api_key=' + apikey)

        if (rankInfo.getBody('utf8') === "[]") {
            await interaction.reply("Görünüşe göre henüz bir derecelendirmen yok 😫 Git biraz LOL oyna")
        } else {
            rankInfo = JSON.parse(rankInfo.getBody('utf8'))
            
            if(rankInfo.length > 1){
                console.log(rankInfo.length)
                var exampleEmbed = new Discord.EmbedBuilder()
                    .setColor('#FF5733')
                    .setTitle(rankInfo[0]["summonerName"])
                    .setThumbnail("http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/img/profileicon/" + summonerIconID + ".png")
                    .setDescription("Level : " + summonerInfo["summonerLevel"])
                    // .addField("```Ranked Solo```", rankInfo[0]["tier"] + "    " + rankInfo[0]["rank"], false)
                    .addFields(
                        { name: 'Regular field title', value: 'Some value here' },
                        { name: '\u200B', value: '\u200B' },
                        { name: 'Inline field title', value: 'Some value here', inline: true },
                        { name: 'Inline field title', value: 'Some value here', inline: true },
                    )
                    // .addFields(
                    //     { name: 'Wins', value: rankInfo[0]["wins"], inline: true },
                    //     { name: 'Losses', value: rankInfo[0]["losses"], inline: true },
                    //     { name: 'Hot Streak', value: rankInfo[0]["hotStreak"], inline: true },
                    //     { name: 'League Points', value: rankInfo[0]["leaguePoints"], inline: true }
                    // )
                    // // .addField("```Ranked Flex```", rankInfo[1]["tier"] + "    " + rankInfo[1]["rank"], false)
                    // .addFields({ name: 'Wins', value: rankInfo[1]["wins"], inline: true }, { name: 'Losses', value: rankInfo[1]["losses"], inline: true }, { name: 'Hot Streak', value: rankInfo[1]["hotStreak"], inline: true }, { name: 'League Points', value: rankInfo[1]["leaguePoints"], inline: true })
                    // .setFooter("Project A Bot'tan sevgilerle", client.user.avatarURL());
            }
            else{
                console.log("$")
                console.log(rankInfo.length)
                var exampleEmbed = new Discord.EmbedBuilder()
                    .setColor('#FF5733')
                    .setTitle(rankInfo[0]["summonerName"])
                    .setThumbnail("http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/img/profileicon/" + summonerIconID + ".png")
                    .setDescription("Level : " + summonerInfo["summonerLevel"])
                    // .addField("```Ranked Solo```", rankInfo[0]["tier"] + "    " + rankInfo[0]["rank"], false)
                    .addFields({ name: 'Wins', value: rankInfo[0]["wins"], inline: true }, { name: 'Losses', value: rankInfo[0]["losses"], inline: true }, { name: 'Hot Streak', value: rankInfo[0]["hotStreak"], inline: true }, { name: 'League Points', value: rankInfo[0]["leaguePoints"], inline: true })
                    .setFooter("Project A Bot'tan sevgilerle", client.user.avatarURL());
            }

            // await interaction.reply("HOP")
            // console.log(interaction.constructor)
            await interaction.reply({ embeds: [exampleEmbed]})
        }
    } else {
        await interaction.reply("Yanlış bir şeyler var 🙄")

    }
}