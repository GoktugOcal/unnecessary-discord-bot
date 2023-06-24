const Discord = require('discord.js');
const fs = require('fs');
const QuickChart = require('quickchart-js');
var lolHelper = require('../../helpers/lol_helper.js')
var lolButtons = require('../../helpers/lol_buttons.js');
const lol_helper = require('../../helpers/lol_helper.js');

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  } 

function parseDetails (matchStats) {

}


exports.create = () => {
    const command = new Discord.SlashCommandBuilder()
        .setName("trial")
        .setDescription("trial command")
        ;
    
    return command.toJSON()
}

exports.run = async (client, interaction) => {

    interaction.deferReply()

    apikey = process.env.RIOT_API;
    // summonerName = interaction.options.getString('summoner-name')
    // platform = interaction.options.getString('summoner-region')
    start = 0
    matchCount = 5
    summonerName = "Martin Scorsese"
    platform = "TR1"

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

    console.log(matchIdList)

    var matches = []
    var noWins = 0
    var noLoses = 0
    var embeds = []
    var idxCounter = start
    var button_emojis = lolButtons.stats_button_info

    await matchIdList.map(async (gameId, idx) => {
        console.log(gameId)
        lolHelper.get_match_info(gameId, region, apikey).then(async (matchStats) => {
            
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
            
            matches[idx] = {
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
        )
    })

    // for (i = 0; i < matchCount; i++) {

    //     gameId = matchIdList[i]
    //     const idx = i
    //     lolHelper.get_match_info(gameId, region, apikey).then(async (matchStats) => {
            
    //         var summonerStats = null

    //         participantIdentities = matchStats["info"]["participants"].map(item => {
    //             if (item["summonerId"] === summonerID) {
    //                 summonerStats = matchStats["info"]["participants"][item["participantId"] - 1]
    //             }
    //         })

    //         if (summonerStats["win"] === true) { result = "win"; noWins += 1 }
    //         else { result = "lose"; noLoses += 1 }

    //         const date= new Date(matchStats["info"]["gameStartTimestamp"]);
    //         dateFormat = date.getHours() + ":" + date.getMinutes() + ", "+ date.toDateString();
            
    //         matches[idx] = {
    //             "gameMode": matchStats["info"]["gameMode"],
    //             "champion": summonerStats["championName"],
    //             "result": result,
    //             "kills": summonerStats["kills"],
    //             "assists": summonerStats["assists"],
    //             "deaths": summonerStats["deaths"],
    //             "kda" : summonerStats["challenges"]["kda"],
    //             "totalDamageDealtToChampions" : summonerStats["totalDamageDealtToChampions"],
    //             "damageDealtToBuildings" : summonerStats["damageDealtToBuildings"],
    //             "gameStartTime" : dateFormat,
    //             "matchId" : matchStats["metadata"]["matchId"]
    //         }
    //     }
    //     )
    // }
    // await delay(1000);
    console.log(matches.length)
    matches.map(item => console.log(item["matchId"]))


    await matchIdList.map(async(gameId, idx) => {
        console.log(gameId)
        await delay(500);
        console.log(idx)
    })

}