const request = require('sync-request');
const Discord = require('discord.js');
const fs = require('fs')
const QuickChart = require('quickchart-js');


exports.create = () => {
    const command = new Discord.SlashCommandBuilder()
        .setName("lol")
        .setDescription("LoL commands")
        .addSubcommandGroup( (subcommandGroup) =>
            subcommandGroup
                .setName("summoner")
                .setDescription("Summoner information")
                .addSubcommand( (subcommand) =>
                    subcommand
                        .setName("rank")
                        .setDescription("Summoner's rank")
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
                )
        )
        .addSubcommandGroup( (subcommandGroup) =>
            subcommandGroup
            .setName("matches")
            .setDescription("LoL match information")
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
                    )/*
                    .addIntegerOption( (option) =>
                        option.setName("count")
                        .setDescription("Count of last matches.")
                        .setMinValue(0)
                        .setMaxValue(10)
                    )*/
                )
            
            .addSubcommand(subcommand =>
                subcommand
                    .setName('stats')
                    .setDescription('Stats about matches')
                    .addStringOption( (option) => 
                        option
                            .setName("match-id")
                            .setDescription("ID of match")
                            .setRequired(true)
                    )
                )                   
        )
        ;
    
    return command.toJSON()
}

exports.run = async (client, interaction) => {

    await interaction.deferReply()

    const subcommandGroup = interaction.options.getSubcommandGroup()
    const subcommand = interaction.options.getSubcommand()

    if (subcommandGroup == "summoner") {
        if (subcommand == "rank") {
            return rank_information(client, interaction)
        }
    } else if (subcommandGroup == "matches") {
        if (subcommand == "latest") {
            return latest_matches(client, interaction, 0)
        }
        else if (subcommand == "stats") {
            return match_stats(client, interaction)
        }
    }
}

async function rank_information (client, interaction, followUpReply = false) {
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

            
            // add button
            const lastMatchesButton = new Discord.ButtonBuilder()
                .setCustomId('lastMatchesButton')
                .setLabel('Look at the last 5 matches')
                .setStyle(Discord.ButtonStyle.Secondary)
                .setEmoji("⚔");

            const row = new Discord.ActionRowBuilder()
                .addComponents(
                    lastMatchesButton
                );

            // reply the interaction            
            let message = await interaction.editReply(
                {
                    embeds: [exampleEmbed],
                    components: [row],
                    fetchReply: true
                }
            )
            
            // set collector and run
            const collectorFilter = i => {
                i.deferUpdate();
                return i.user.id === interaction.user.id;
            };

            message.awaitMessageComponent(
                {
                    componentType: Discord.ComponentType.Button,
                    time: 60 * 1000,
                    filter: collectorFilter
                }
            ).then( async i =>  {
                    console.log(`${i.user.id} clicked on the ${i.customId} button.`);
                    // set button disabled
                    row.components[0].setDisabled(true)
                    await interaction.editReply({components: [row]})
                    // follow-up message
                    latest_matches(client, interaction, 0, followUpReply = true)                
                }
            ).catch( async collected => {
                    console.log(collected)
                    // set button disabled
                    row.components[0].setDisabled(true)
                    await interaction.editReply({components: [row]})
                    // follow-up message
                    // await interaction.followUp('Looks like nobody got the answer this time.');
                }
            );

            return 1
        }
    } else {
        await interaction.editReply("Something is wrong 🙄")
        return 0
    }
}

async function latest_matches (client, interaction, start, followUpReply = false) {

    var regions = require('../../data/regions.json')

    cdnVersion = JSON.parse(request('GET', "https://ddragon.leagueoflegends.com/api/versions.json").getBody('utf8'))[0]
    apikey = process.env.RIOT_API;
    summonerName = interaction.options.getString('summoner-name')
    platform = interaction.options.getString('summoner-region')
    region = regions[platform]
    matchCount = 5

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

        var matchList = request('GET', 'https://' + region + '.api.riotgames.com/lol/match/v5/matches/by-puuid/' + puuid + '/ids?api_key=' + apikey + "&start="+ start.toString() +"&count=" + matchCount)
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
                "kda" : summonerStats["challenges"]["kda"],
                "totalDamageDealtToChampions" : summonerStats["totalDamageDealtToChampions"],
                "damageDealtToBuildings" : summonerStats["damageDealtToBuildings"],
                "gameStartTime" : dateFormat,
                "matchId" : matchStats["metadata"]["matchId"]
            }
        }

        embeds = []
        var idxCounter = start
        button_emojis = [
            {
                id: 0,
                label: "buttonA",
                emoji: "🇦"
            },
            {
                id: 1,
                label: "buttonB",
                emoji: "🇧"
            },
            {
                id: 2,
                label: "buttonC",
                emoji: "🇨"
            },
            {
                id: 3,
                label: "buttonD",
                emoji: "🇩"
            },
            {
                id: 4,
                label: "buttonE",
                emoji: "🇪"
            }
        ]
        
        const profile = new Discord.EmbedBuilder()
            .setColor('#964C96')
            .setTitle(summonerInfo["name"])
            .setThumbnail("http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/img/profileicon/" + summonerIconID + ".png")
            .setDescription(
                "These are the your games from " + (start + 1).toString() + "th to " + (start + matchCount).toString() + "th.\n" + 
                "You can look at your KDAs for last matches. \n" +
                "📊 If you want to look at the statistics of a game, select from the letter buttons below."
            )
            .addFields(
                { name: ":white_check_mark: Total Wins", value: "```" + noWins.toString() + "```", inline: true},
                { name: ":red_circle: Total Loses", value: "```" + noLoses.toString() + "```", inline: true}
            )
        embeds.push(profile)
        for (i = 0; i < matches.length; i++) {

            if (matches[i]["result"] == "win") {
                var logo = ":white_check_mark:"
            } else {
                var logo = ":red_circle:"
            }

            const matchEmbed = new Discord.EmbedBuilder()
                .setColor('#964C96')
                .setTitle("" + (idxCounter + 1) + " | " + matches[i]["gameMode"] + " | " + matches[i]["champion"])
                .setDescription("" + logo + " " + matches[i]["result"].toUpperCase() + " | `" +  matches[i]["gameStartTime"] + "`")
                .setThumbnail("http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/img/champion/" + matches[i]["champion"] + ".png")
                .addFields(
                    { name: "Kill", value: "```" + matches[i]["kills"].toString() + "```", inline: true},
                    { name: "Death", value: "```" + matches[i]["deaths"].toString() + "```", inline: true},
                    { name: "Assists", value: "```" + matches[i]["assists"].toString() + "```", inline: true}
                )
                .addFields(
                    {
                        name: button_emojis[i].emoji + " Stats",
                        value: "`" + " KDA : " +  Math.round(matches[i]["kda"] * 100) / 100 + "\n" +
                            " Damage to Champs : " + matches[i]["totalDamageDealtToChampions"] + "\n" +
                            " Damage to Buildings : " + matches[i]["damageDealtToBuildings"] + "`"

                    }
                )
                .setFooter(
                    { text: "Match ID : " + matches[i]["matchId"], iconURL: client.user.avatarURL()}
                    ) 
            embeds.push(matchEmbed)
            idxCounter++
        }

        /*
        const exampleEmbed = new Discord.EmbedBuilder()
            .setColor('#964C96')
            .setTitle(summonerInfo["name"] + " - Last Games ( page " + (start/5+1).toString() + " )")
            .setThumbnail("http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/img/profileicon/" + summonerIconID + ".png")
            .setDescription(
                "These are the your games from " + (start + 1).toString() + "th to " + (start + matchCount).toString() + "th.\n" + 
                "You can look at your KDAs for last matches. \n" +
                "📊 If you want to look at the statistics of a game, select from the letter buttons below.")
            .addFields(
                { name: ":white_check_mark: Total Wins", value: "```" + noWins.toString() + "```", inline: true},
                { name: ":red_circle: Total Loses", value: "```" + noLoses.toString() + "```", inline: true}
            
            ).setFooter(
                { text: "heil to the lord", iconURL: client.user.avatarURL()}
                );
        
        for (i = 0; i < matches.length; i++) {
            if (matches[i]["result"] == "win") {
                var logo = ":white_check_mark:"
            } else {
                var logo = ":red_circle:"
            }
            exampleEmbed.addFields(
                {
                    name: "" + (idxCounter + 1) + " | " + logo +" | " + matches[i]["gameMode"] + " | \t" + matches[i]["champion"],
                    value: " `  K: "+ matches[i]["kills"].toString() +"  `" +
                    "  `  D: "+ matches[i]["deaths"].toString() +"  `" +
                    "  `  A: "+ matches[i]["assists"].toString() +"  `" +
                    "\n" +
                    "`Match played at " + matches[i]["gameStartTime"] + "`" +
                    "\n" +
                    "`Match ID : " + matches[i]["matchId"] + "`",
                }
            )
            idxCounter++
        };*/


        /////// add buttons
        // row 1 - pagination buttons
        const previousPage = new Discord.ButtonBuilder()
            .setCustomId('previousPageButton')
            .setLabel('Newer')
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji("⏮");

        const nextPage = new Discord.ButtonBuilder()
            .setCustomId('nextPageButton')
            .setLabel('Older')
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji("⏭");

        const row = new Discord.ActionRowBuilder()
            .addComponents(
                previousPage,
                nextPage
            );
        
        // row 2 - match stats buttons

        const row2 = new Discord.ActionRowBuilder()
        button_emojis.map( item => {
            row2.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(item.label)
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setEmoji(item.emoji)
            )
        })
        
        replyMessage =  {
            embeds: embeds,
            components: [row, row2],
            fetchReply: true
        };

        if (followUpReply) { 
            var message = await interaction.followUp(
                replyMessage
                )
        } else {
            var message = await interaction.editReply(
                replyMessage
                )
        }

        // set collector and run
        const collectorFilter = i => {
            i.deferUpdate();
            return i.user.id === interaction.user.id;
        };

        message.awaitMessageComponent(
            {
                componentType: Discord.ComponentType.Button,
                time: 60 * 1000,
                filter: collectorFilter
            }
        ).then( async i =>  {
                console.log(`${i.user.id} clicked on the ${i.customId} button.`);

                if (i.customId == "previousPageButton") {
                    for (i = 0; i < row.components.length; i++) { row.components[i].setDisabled(true) }
                    for (i = 0; i < row2.components.length; i++) { row2.components[i].setDisabled(true) }
                    await interaction.editReply({ components: [row, row2] })
                    await latest_matches(client, interaction, start - matchCount)
                } else if (i.customId == "nextPageButton") {
                    for (i = 0; i < row.components.length; i++) { row.components[i].setDisabled(true) }
                    for (i = 0; i < row2.components.length; i++) { row2.components[i].setDisabled(true) }
                    await interaction.editReply({ components: [row, row2] })
                    await latest_matches(client, interaction, start + matchCount)
                } else {
                    button_emojis.map( item => {
                        if (i.customId == item.label)
                        {
                            var gameId = matches[item.id]["matchId"]
                            match_stats_helper(client, interaction, gameId, followUpReply = true, primer_embed = embeds[item.id + 1])
                        }
                    })
                    for (i = 0; i < row.components.length; i++) { row.components[i].setDisabled(true) }
                    for (i = 0; i < row2.components.length; i++) { row2.components[i].setDisabled(true) }
                    await interaction.editReply({ components: [row, row2] })
                }
            }
        ).catch( async collected => {
                console.log(collected)
                for (i = 0; i < row.components.length; i++) { row.components[i].setDisabled(true) }
                interaction.editReply({ components: [row] })
            }
        );

        return 1
    } else {
        console.log(summonerInfo.statusMessage)
        await interaction.editReply("Something is wrong 🙄")

        return 0
    }
}

async function match_stats (client, interaction) {

    gameId = interaction.options.getString('match-id')

    return match_stats_helper(client, interaction, gameId)
 
}

async function match_stats_helper(client, interaction, gameId, followUpReply = false, primer_embed = null) {

    var regions = require('../../data/regions.json')

    cdnVersion = JSON.parse(request('GET', "https://ddragon.leagueoflegends.com/api/versions.json").getBody('utf8'))[0]
    apikey = process.env.RIOT_API;

    region = regions[gameId.split("_")[0]]

    // get the match
    var matchStats = request('GET', 'https://' + region + '.api.riotgames.com/lol/match/v5/matches/' + gameId + '?api_key=' + apikey)
    matchStats = JSON.parse(matchStats.getBody('utf8'))

    var statNames = [
        "summonerId",
        "summonerName",
        "championName",
        "labelName",
        "teamId",
        "totalDamageDealt",
        "totalDamageDealtToChampions",
        "trueDamageDealtToChampions",
        "magicDamageDealtToChampions",
        "physicalDamageDealtToChampions",
        "gameLength",
        "totalTimeSpentDead",
        "totalTimeAlive"
    ]

    var stats = new Map()
    statNames.map( stat => stats[stat] = [])

    matchStats["info"]["participants"].map(participant => {
        stats["summonerId"].push(participant["summonerId"])
        stats["summonerName"].push(participant["summonerName"])
        stats["championName"].push(participant["championName"])
        //stats["labelName"].push("<b>" + participant["championName"] + "</b>\n" + participant["summonerName"])
        stats["labelName"].push([participant["championName"], participant["summonerName"]])
        stats["teamId"].push(participant["teamId"])
        stats["totalDamageDealt"].push(participant["totalDamageDealt"])
        stats["totalDamageDealtToChampions"].push(participant["totalDamageDealtToChampions"])
        stats["trueDamageDealtToChampions"].push(participant["trueDamageDealtToChampions"])
        stats["magicDamageDealtToChampions"].push(participant["magicDamageDealtToChampions"])
        stats["physicalDamageDealtToChampions"].push(participant["physicalDamageDealtToChampions"])
        stats["gameLength"].push(participant["challenges"]["gameLength"])
        stats["totalTimeSpentDead"].push(participant["totalTimeSpentDead"])
        stats["totalTimeAlive"].push(participant["challenges"]["gameLength"] - participant["totalTimeSpentDead"])
    })

    // total damage chart w breakdowns

    const totalDamageChartBreakdown = new QuickChart();
    totalDamageChartBreakdown.setConfig({
        type: 'horizontalBar',
        data: {
            labels: stats["labelName"],
            datasets: [
                {
                    label: 'Magic',
                    data: stats["magicDamageDealtToChampions"],
                    backgroundColor: 'royalblue'
                },
                {
                    label: 'Physical',
                    data: stats["physicalDamageDealtToChampions"],
                    backgroundColor: 'tomato'
                },
                {
                    label: 'True',
                    data: stats["trueDamageDealtToChampions"],
                    backgroundColor: 'khaki'
                    
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Total Damage Dealt to Champions'
            },
            responsive: true,
            scales: {
                xAxes: [{
                   stacked: true // this should be set to make the bars stacked
                }],
                yAxes: [{
                   stacked: true // this also..
                }]
            }
        },
        
    })
    .setWidth(800)
    .setHeight(800);
    const totalDamageChartBreakdownURL = await totalDamageChartBreakdown.getShortUrl();


    const deadTime = new QuickChart();
    deadTime.setConfig({
        type: 'bar',
        data: {
            labels: stats["labelName"],
            datasets: [
                {
                    label: 'Alive',
                    data: stats["totalTimeAlive"],
                    backgroundColor: 'lightskyblue'
                },
                {
                    label: 'Dead',
                    data: stats["totalTimeSpentDead"],
                    backgroundColor: 'darkorange'
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Total Time Spent Dead'
            },
            responsive: true,
            scales: {
                xAxes: [{
                   stacked: true // this should be set to make the bars stacked
                }],
                yAxes: [{
                   stacked: true // this also..
                }]
            }
        },
        
    })
    .setWidth(800)
    .setHeight(400);
    const deadTimeURL = await deadTime.getShortUrl();

    const totalDamageChartBreakdownEmbed = new Discord.EmbedBuilder()
        .setTitle('Total Damage Dealt to Champions')
        .setImage(totalDamageChartBreakdownURL)

    const deadTimeEmbed = new Discord.EmbedBuilder()
        .setTitle('Total Time Spent Dead')
        .setImage(deadTimeURL)


    /*
    await interaction.editReply(
        {
            embeds: [totalDamageChartBreakdownEmbed, deadTimeEmbed]
        }
    );
    */

    if (primer_embed == null) {
        replyMessage =  {
            embeds: [
                totalDamageChartBreakdownEmbed,
                deadTimeEmbed],
            fetchReply: true
        };    
    } else {
        replyMessage =  {
            embeds: [
                primer_embed,
                totalDamageChartBreakdownEmbed,
                deadTimeEmbed],
            fetchReply: true
        };
    }

    if (followUpReply) { 
        var message = await interaction.followUp(
            replyMessage
            )
    } else {
        var message = await interaction.editReply(
            replyMessage
            )
    }

}