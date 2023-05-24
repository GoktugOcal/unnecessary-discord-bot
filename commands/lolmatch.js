// /lol/match / v4 / matches / { matchId }


const request = require('sync-request');
const Discord = require('discord.js');
const fs = require('fs')

exports.run = (client, message, args) => {
    apikey = process.env.RIOT_API;
    summonerName = ""
    region = ""
    messContent = message.content.split(" ")

    cdnVersion = JSON.parse(request('GET', "https://ddragon.leagueoflegends.com/api/versions.json").getBody('utf8'))[0]
    console.log(cdnVersion)
    heroes = {}
    heroData = JSON.parse(request('GET', "http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/data/en_US/champion.json").getBody('utf8'))["data"]
    Object.keys(heroData).map(function(key, index) {
        heroes[heroData[key]["key"]] = key
    })

    if (messContent.length === 3) {
        summonerName = messContent[1]
        region = messContent[2]

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

            const exampleEmbed = new Discord.MessageEmbed()
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
            message.channel.send(exampleEmbed)

            console.log(matches)
        } else {
            message.channel.send("Yanlış bir şeyler var 🙄")
        }

    } else if (messContent.length === 4) {

        message.channel.send("Bunu daha geliştirmedik, beklemede kal 😎")

        // gameId = lastMatch["gameId"]
        // champion = lastMatch["champion"]
        // datetime = lastMatch["timestamp"]
        // console.log(lastMatch);

        // var matchStats = request('GET', 'https://' + region + '.api.riotgames.com/lol/match/v4/matches/' + gameId + '?api_key=' + apikey)
        // matchStats = JSON.parse(matchStats.getBody('utf8'))
        // gameMode = matchStats["gameMode"]
        // participantIdentities = matchStats["participantIdentities"].map(item => { return item["player"]["summonerName"] })
        // kills = matchStats["participants"].map(item => { return item["stats"]["kills"] })
        // deaths = matchStats["participants"].map(item => { return item["stats"]["deaths"] })
        // assists = matchStats["participants"].map(item => { return item["stats"]["assists"] })

    } else {
        message.channel.send("Sihirdar Adı? Bölge?")
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