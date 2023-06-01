const request = require('sync-request');
const Discord = require('discord.js');
const fs = require('fs')
const QuickChart = require('quickchart-js');
var lolHelper = require('../../helpers/lol_helper.js')
var lolButtons = require('../../helpers/lol_buttons.js');
const lol_helper = require('../../helpers/lol_helper.js');

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

    let message = await interaction.deferReply(
        {
            fetchReply: true
        }
    )

    try {    
        const subcommandGroup = interaction.options.getSubcommandGroup()
        const subcommand = interaction.options.getSubcommand()
    
        if (subcommandGroup == "summoner") {
            if (subcommand == "rank") {
                return rank_information(client, interaction, message)
            }
        } else if (subcommandGroup == "matches") {
            if (subcommand == "latest") {
                return latest_matches(client, interaction, message, 0)
            }
            else if (subcommand == "stats") {
                return match_stats(client, interaction, message)
            }
        }
    } catch {
        message.edit("Something is wrong 👨‍💻");
        return 0;
    }

    
}

async function rank_information (client, interaction, message, followUpReply = false) {
    
    apikey = process.env.RIOT_API;
    summonerName = interaction.options.getString('summoner-name')
    region = interaction.options.getString('summoner-region')

    var cdnVersion = lolHelper.get_cdn_version() // RIOT API
    var summonerInfo = lolHelper.get_summoner_info(summonerName, region, apikey) // RIOT API

    let summonerId = summonerInfo['id'];
    let summonerIconID = summonerInfo['profileIconId'];

    var rankInfo = lolHelper.get_league_info(summonerId, region, apikey) // RIOT API

    if (rankInfo.length === 0) {
        await interaction.editReply("You don't have a rank 😫 play some LOL")
        return 1
    } else {
        // Generate the embed message
        var exampleEmbed = new Discord.EmbedBuilder()
            .setColor('#FF5733')
            .setTitle(rankInfo[0]["summonerName"])
            .setThumbnail("http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/img/profileicon/" + summonerIconID + ".png")
            .setDescription("Level : " + summonerInfo["summonerLevel"])
            .setFooter(
                { text: "heil to the lord", iconURL: client.user.avatarURL()}
                )
        
        for (idx = 0; idx < rankInfo.length; idx++) {
            exampleEmbed
                .addFields(
                    { name: '`' + rankInfo[idx]["queueType"].replace(/_/g, ' ') + '` ' + rankInfo[idx]["tier"] + " " + rankInfo[idx]["rank"], value: "-----"}
                )
                .addFields(
                    { name: 'Wins', value: rankInfo[idx]["wins"].toString(), inline: true },
                    { name: 'Losses', value: rankInfo[idx]["losses"].toString(), inline: true },
                    { name: 'Hot Streak', value: rankInfo[idx]["hotStreak"].toString(), inline: true },
                    { name: 'League Points', value: rankInfo[idx]["leaguePoints"].toString(), inline: true }
                    )
        };
    }

    // Get the button for last matches
    const row = lolButtons.generateLastMatchButton()

    // reply the interaction            
    var message = await interaction.editReply(
        {
            embeds: [exampleEmbed],
            components: [row],
            fetchReply: true
        }
    );
    
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
            console.log(`${i.user.username} (${i.user.id}) clicked on the ${i.customId} button.`);
            // set button disabled
            row.components[0].setDisabled(true)
            await interaction.editReply({components: [row]})
            // follow-up message
            latest_matches(client, interaction, message, 0, followUpReply = true)                
        }
    ).catch( async collected => {
            console.log(collected)
            // set button disabled
            row.components[0].setDisabled(true)
            await interaction.editReply({components: [row]})
        }
    );

    return 1
}

async function latest_matches (client, interaction, message, start, followUpReply = false) {

    apikey = process.env.RIOT_API;
    summonerName = interaction.options.getString('summoner-name')
    platform = interaction.options.getString('summoner-region')
    matchCount = 5

    var regions = require('../../data/regions.json')
    region = regions[platform]

    var cdnVersion = lolHelper.get_cdn_version() // RIOT API
    var summonerInfo = lolHelper.get_summoner_info(summonerName, platform, apikey) // RIOT API 
    
    let summonerID = summonerInfo['id'];
    let summonerIconID = summonerInfo['profileIconId'];
    let accountID = summonerInfo['accountId']
    let puuid = summonerInfo['puuid']

    var matchIdList = lol_helper.get_latest_matches(puuid, region, start, matchCount, apikey) // RIOT API
    lastMatch = matchIdList[0]

    var matches = []
    var noWins = 0
    var noLoses = 0
    var embeds = []
    var idxCounter = start
    var button_emojis = lolButtons.stats_button_info

    for (i = 0; i < matchCount; i++) {

        gameId = matchIdList[i]
        var matchStats = lolHelper.get_match_info(gameId, region, apikey) // RIOT API
        var summonerStats = null

        participantIdentities = matchStats["info"]["participants"].map(item => {
            if (item["summonerId"] === summonerID) {
                summonerStats = matchStats["info"]["participants"][item["participantId"] - 1]
            }
        })

        if (summonerStats["win"] === true) { result = "win"; noWins += 1 }
        else { result = "lose"; noLoses += 1 }

        const date= new Date(matchStats["info"]["gameStartTimestamp"]);
        dateFormat = date.getHours() + ":" + date.getMinutes() + ", "+ date.toDateString();
        
        matches[i] = {
            "gameMode": matchStats["info"]["gameMode"],
            "champion": summonerStats["championName"],
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
        const matchEmbed = new Discord.EmbedBuilder()
            .setColor('#964C96')
            .setTitle("" + (idxCounter + 1) + " | " + matches[i]["gameMode"] + " | " + matches[i]["champion"])
            .setDescription("" + lolButtons.win_or_lose_logo[matches[i]["result"]] + " " + matches[i]["result"].toUpperCase() + " | `" +  matches[i]["gameStartTime"] + "`")
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
    const paginationRow = lolButtons.generatePaginationButton() // row 1 - pagination buttons
    const statsRow = lolButtons.generateStatsButton() // row 2 - match stats buttons
    const loadingRow = lolButtons.generateLoadingButton() // loading button
    const timeoutRow = lolButtons.generateTimeoutButton() // time-out button
    
    replyMessage =  {
        embeds: embeds,
        components: [paginationRow, statsRow],
        fetchReply: true
    };

    if (followUpReply) { 
        var message = await message.reply(
            replyMessage
            )
    } else {
        var message = await message.edit(
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
            time: 30 * 1000,
            filter: collectorFilter
        }
    ).then( async i =>  {
            console.log(`${i.user.id} clicked on the ${i.customId} button.`);

            if (i.customId == "previousPageButton") {
                await message.edit({ components: [loadingRow] })
                await latest_matches(client, interaction, message, start - matchCount)
            } else if (i.customId == "nextPageButton") {
                await message.edit({ components: [loadingRow] })
                await latest_matches(client, interaction, message, start + matchCount)
            } else {
                button_emojis.map( item => {
                    if (i.customId == item.label)
                    {
                        var gameId = matches[item.id]["matchId"]
                        match_stats_helper(client, interaction, message, gameId, followUpReply = true, primer_embed = embeds[item.id + 1])
                    }
                })
                await message.edit({ components: [timeoutRow] })
            }
        }
    ).catch( async collected => {
            console.log(collected)
            for (i = 0; i < row.components.length; i++) { row.components[i].setDisabled(true) }
            message.edit({ components: [timeoutRow] })
        }
    );

    return 1
}

async function match_stats (client, interaction, message) {

    gameId = interaction.options.getString('match-id')

    return match_stats_helper(client, interaction, message, gameId)
 
}

async function match_stats_helper(client, interaction,message, gameId, followUpReply = false, primer_embed = null) {

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
        var message = await message.reply(
            replyMessage
            )
    } else {
        var message = await interaction.editReply(
            replyMessage
            )
    }

}