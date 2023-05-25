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

    await interaction.deferReply()

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
            await interaction.editReply("You don't have a rank 😫 play some LOL")
        } else {
            rankInfo = JSON.parse(rankInfo.getBody('utf8'))
            if(rankInfo.length > 1){
                var exampleEmbed = new Discord.EmbedBuilder()
                    .setColor('#FF5733')
                    .setTitle(rankInfo[0]["summonerName"])
                    .setThumbnail("http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/img/profileicon/" + summonerIconID + ".png")
                    .setDescription("Level : " + summonerInfo["summonerLevel"])
                    .addFields(
                        { name: '`Ranked Solo` ' + rankInfo[0]["tier"] + " " + rankInfo[0]["rank"], value: "-----"}
                    )
                    .addFields(
                        { name: 'Wins', value: rankInfo[0]["wins"].toString(), inline: true },
                        { name: 'Losses', value: rankInfo[0]["losses"].toString(), inline: true },
                        { name: 'Hot Streak', value: rankInfo[0]["hotStreak"].toString(), inline: true },
                        { name: 'League Points', value: rankInfo[0]["leaguePoints"].toString(), inline: true }
                        )
                    .addFields(
                        { name: '`Ranked Flex` ' + rankInfo[1]["tier"] + " " + rankInfo[1]["rank"], value: "-----"}
                    )
                    .addFields(
                        { name: 'Wins', value: rankInfo[1]["wins"].toString(), inline: true },
                        { name: 'Losses', value: rankInfo[1]["losses"].toString(), inline: true },
                        { name: 'Hot Streak', value: rankInfo[1]["hotStreak"].toString(), inline: true },
                        { name: 'League Points', value: rankInfo[1]["leaguePoints"].toString(), inline: true }
                        )
                    .setFooter(
                        { text: "heil to the lord", iconURL: client.user.avatarURL()}
                        );
            }
            else{
                console.log("$")
                console.log(rankInfo.length)
                var exampleEmbed = new Discord.EmbedBuilder()
                    .setColor('#FF5733')
                    .setTitle(rankInfo[0]["summonerName"])
                    .setThumbnail("http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/img/profileicon/" + summonerIconID + ".png")
                    .setDescription("Level : " + summonerInfo["summonerLevel"])
                    .addFields(
                        { name: '`Ranked Solo` ' + rankInfo[0]["tier"] + " " + rankInfo[0]["rank"], value: rankInfo[0]["tier"].toLowerCase()}
                    )
                    .addFields(
                        { name: 'Wins', value: rankInfo[0]["wins"].toString(), inline: true },
                        { name: 'Losses', value: rankInfo[0]["losses"].toString(), inline: true },
                        { name: 'Hot Streak', value: rankInfo[0]["hotStreak"].toString(), inline: true },
                        { name: 'League Points', value: rankInfo[0]["leaguePoints"].toString(), inline: true }
                        )
                    .setFooter(
                        { text: "heil to the lord", iconURL: client.user.avatarURL()}
                        );    
            }

            await interaction.editReply({ embeds: [exampleEmbed]})

            return 1
        }
    } else {
        await interaction.editReply("Something is wrong 🙄")
        return 0
    }
}