// /lol/match / v4 / matches / { matchId }

const request = require('sync-request');
const Discord = require('discord.js');
const fs = require('fs');
const { count } = require('console');

exports.create = () => {
    const command = new Discord.SlashCommandBuilder()
        .setName("lolmatch")
        .setDescription("Summoner Last Matches")
        .addSubcommand( subcommand =>
            subcommand
                .setName("latest")
                .setDescription("Summoner's Last Matches")
                .addStringOption( (option) =>
                    option.setName("summoner-name")
                    .setDescription("Summoner's name whose matches you want to get.")
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
                        // { name: "JP1", value: "JP1" },
                        // { name: "KR", value: "KR" },
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
                .addIntegerOption( (option) =>
                    option.setName("count")
                    .setDescription("Count of last matches.")
                    .setMinValue(0)
                    .setMaxValue(10)
                )
            )
        
        .addSubcommand(subcommand =>
            subcommand
                .setName('stats')
                .setDescription('Stats about matches')
            );
        ;
    
    return command.toJSON()
}



exports.run = async (client, interaction) => {


    await interaction.deferReply()

    if (interaction.options.getSubcommand() == "latest") {
        return latest_matches(client, interaction)
    }

}

async function latest_matches (client, interaction) {

    var regions = require('../data/regions.json')

    cdnVersion = JSON.parse(request('GET', "https://ddragon.leagueoflegends.com/api/versions.json").getBody('utf8'))[0]
    apikey = process.env.RIOT_API;
    summonerName = interaction.options.getString('summoner-name')
    platform = interaction.options.getString('summoner-region')
    region = regions[platform]

    if (interaction.options.getInteger('count') == null) {
        matchCount = 5
    } else {
        matchCount = interaction.options.getInteger('count')
    }

    heroes = {}
    heroData = JSON.parse(request('GET', "http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/data/en_US/champion.json").getBody('utf8'))["data"]
    Object.keys(heroData).map(function(key, index) {
        heroes[heroData[key]["key"]] = key
    })

    var summonerInfo = request('GET', 'https://' + platform + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName + '?api_key=' + apikey)
    
    if (summonerInfo.statusCode === 200) {
        summonerInfo = JSON.parse(summonerInfo.getBody('utf8'))
        let summonerID = summonerInfo['id'];
        let summonerIconID = summonerInfo['profileIconId'];
        let accountID = summonerInfo['accountId']
        let puuid = summonerInfo['puuid']

        var matchList = request('GET', 'https://' + region + '.api.riotgames.com/lol/match/v5/matches/by-puuid/' + puuid + '/ids?api_key=' + apikey + "&start=0&count=" + matchCount)
        matchIdList = JSON.parse(matchList.getBody('utf8'))
        lastMatch = matchIdList[0]

        matches = []
        var noWins = 0
        var noLoses = 0

        for (i = 0; i < matchCount; i++) {
            gameId = matchIdList[i]
            var matchStats = request('GET', 'https://' + region + '.api.riotgames.com/lol/match/v5/matches/' + gameId + '?api_key=' + apikey)
            matchStats = JSON.parse(matchStats.getBody('utf8'))

            summonerStats = null
            participantIdentities = matchStats["info"]["participants"].map(item => {
                if (item["summonerId"] === summonerID) {
                    summonerStats = matchStats["info"]["participants"][item["participantId"] - 1]
                }
            })

            if (summonerStats["win"] === true) { 
                result = "Win :white_check_mark:"
                result = "win"
                noWins += 1
            }
            else {
                result = "Lose :red_circle:"
                result = "lose"
                noLoses += 1
            }

            const date= new Date(matchStats["info"]["gameStartTimestamp"]);
            dateFormat = date.getHours() + ":" + date.getMinutes() + ", "+ date.toDateString();

            matches[i] = {
                "gameMode": matchStats["info"]["gameMode"],
                "champion": heroes[summonerStats["championId"].toString()],
                "result": result,
                "kills": summonerStats["kills"],
                "assists": summonerStats["assists"],
                "deaths": summonerStats["deaths"],
                "gameStartTime" : dateFormat
            }
        }
        embeds = []
        /*
        const profile = new Discord.EmbedBuilder()
            .setColor('#964C96')
            .setTitle(summonerInfo["name"])
            .setThumbnail("http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/img/profileicon/" + summonerIconID + ".png")
            .setDescription("You can look at your KDAs for last matches \n\n")
            .addFields(
                { name: ":white_check_mark: Total Wins", value: "```" + noWins.toString() + "```", inline: true},
                { name: ":red_circle: Total Loses", value: "```" + noLoses.toString() + "```", inline: true}
            )
        embeds.push(profile)
        for (i = 0; i < matches.length; i++) {
            const matchEmbed = new Discord.EmbedBuilder()
                .setColor('#964C96')
                .setTitle("" + (i + 1))
                .setThumbnail("http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/img/profileicon/" + summonerIconID + ".png")
                .addFields(
                    { name: "Kill", value: "```" + matches[i]["kills"].toString() + "```", inline: true},
                    { name: "Death", value: "```" + matches[i]["deaths"].toString() + "```", inline: true},
                    { name: "Assists", value: "```" + matches[i]["assists"].toString() + "```", inline: true}

                )
            embeds.push(matchEmbed)
        }*/


        const exampleEmbed = new Discord.EmbedBuilder()
            .setColor('#964C96')
            .setTitle(summonerInfo["name"])
            .setThumbnail("http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/img/profileicon/" + summonerIconID + ".png")
            .setDescription("You can look at your KDAs for last matches \n\n")
            .addFields(
                { name: ":white_check_mark: Total Wins", value: "```" + noWins.toString() + "```", inline: true},
                { name: ":red_circle: Total Loses", value: "```" + noLoses.toString() + "```", inline: true}
            
            )

        for (i = 0; i < matches.length; i++) {
            if (matches[i]["result"] == "win") {
                var logo = ":white_check_mark:"
            } else {
                var logo = ":red_circle:"
            }
            exampleEmbed.addFields(
                {
                    name: "" + (i + 1) + " | " + logo +" | " + matches[i]["gameMode"] + " | \t" + matches[i]["champion"],
                    value: " `  K: "+ matches[i]["kills"].toString() +"  `" +
                    "  `  D: "+ matches[i]["deaths"].toString() +"  `" +
                    "  `  A: "+ matches[i]["assists"].toString() +"  `" +
                    "\n" +
                    "`Game start time: " + matches[i]["gameStartTime"] + "`",
                }
            )
        }
        exampleEmbed.setFooter(
            { text: "heil to the lord", iconURL: client.user.avatarURL()}
            );
        await interaction.editReply({ embeds: [exampleEmbed]})

        return 1
    } else {
        await interaction.editReply("Something is wrong 🙄")

        return 0
    }
}