// /lol/match / v4 / matches / { matchId }

const request = require('sync-request');
const Discord = require('discord.js');
const fs = require('fs')

exports.create = () => {
    const command = new Discord.SlashCommandBuilder()
        .setName("lolmatch")
        .setDescription("Summoner Last Matches")
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

    heroes = {}
    heroData = JSON.parse(request('GET', "http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/data/en_US/champion.json").getBody('utf8'))["data"]
    Object.keys(heroData).map(function(key, index) {
        heroes[heroData[key]["key"]] = key
    })

    var summonerInfo = request('GET', 'https://' + region + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName + '?api_key=' + apikey)
    if (summonerInfo.statusCode === 200) {
        summonerInfo = JSON.parse(summonerInfo.getBody('utf8'))
        let summonerID = summonerInfo['id'];
        let summonerIconID = summonerInfo['profileIconId'];
        let accountID = summonerInfo['accountId']
        console.log(summonerInfo)

        var matchList = request('GET', 'https://' + region + '.api.riotgames.com/lol/match/v4/matchlists/by-account/' + accountID + '?api_key=' + apikey)
        matchList = JSON.parse(matchList.getBody('utf8'))
        lastMatch = matchList['matches'][0]
        matchIdList = matchList['matches'].map(item => { return item["gameId"] })

        matches = []

        for (i = 0; i < 5; i++) {
            gameId = matchIdList[i]
            var matchStats = request('GET', 'https://' + region + '.api.riotgames.com/lol/match/v4/matches/' + gameId + '?api_key=' + apikey)
            matchStats = JSON.parse(matchStats.getBody('utf8'))

            summonerStats = null
            participantIdentities = matchStats["participantIdentities"].map(item => {
                if (item["player"]["summonerId"] === summonerID) {
                    summonerStats = matchStats["participants"][item["participantId"] - 1]
                }
            })

            result = "Lose 🔴"
            if (summonerStats["stats"]["win"] === true) { result = "Win 🟢" }

            matches[i] = {
                "gameMode": matchStats["gameMode"],
                "champion": heroes[summonerStats["championId"].toString()],
                "result": result,
                "kills": summonerStats["stats"]["kills"],
                "assists": summonerStats["stats"]["assists"],
                "deaths": summonerStats["stats"]["deaths"]
            }
        }

        const exampleEmbed = new Discord.EmbedBuilder()
            .setColor('#964C96')
            .setTitle(summonerInfo["name"])
            .setThumbnail("http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/img/profileicon/" + summonerIconID + ".png")
            .setDescription("Son maçlarının KDA'larını ve sonuçlarını aşağıda görebilirsin \n\n_İleride birlikte komutun sonunda koyacağın sayı ile hangi maçını ayrıntılı olarak görmek istediğini seçebileceksin_ 😎")

        for (i = 0; i < matches.length; i++) {
            exampleEmbed.addFields({
                name: "" + (i + 1) + " - \t" + matches[i]["champion"] + "\t|\t" + matches[i]["kills"] + "/" + matches[i]["deaths"] + "/" + matches[i]["assists"],
                value: matches[i]["gameMode"] + "\t|\t" + matches[i]["result"] + "\n"
            })
        }
        exampleEmbed.setFooter("Project A Bot'tan sevgilerle", client.user.avatarURL());
        await interaction.editReply({ embeds: [exampleEmbed]})

        return 1
    } else {
        await interaction.editReply("Something is wrong 🙄")

        return 0
    }

}



function createTableImage() {
    const { createCanvas, loadImage } = require('canvas')
    const width = 1200
    const height = 600

    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')

    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)

    const text = 'Hello, World!'

    context.font = 'bold 70pt Menlo'
    context.textAlign = 'center'
    context.fillStyle = '#fff'
    context.fillText(text, 600, 170)

    return canvas.toBuffer()

}

function createString(matches) {
    str = "Son 10 maç\n\n"
    for (i = 0; i < matches.length; i++) {
        str = str + (i + 1) + " - " + matches[i]["gameMode"] + "\t|\t" + matches[i]["champion"] + "\t|\t" + matches[i]["kills"] + "/" + matches[i]["deaths"] + "/" + matches[i]["assists"] + "\t|\t" + matches[i]["result"] + "\n"
        str = str + "----------------------------\n"
    }

    return str
}