exports.run = (client, message, args) => {

    typeDict = {
        "PLAYING": "oynuyor",
        "STREAMING": "yayın yapıyor",
        "LISTENING": "dinliyor",
        "WATCHING": "izliyor"
    }

    var guildUsers = {};
    message.guild.members.cache.map(item => {
        guildUsers[item.user.id] = item.user.username
    })
    userId = message.member.user.id
    userInfo = undefined

    messContent = message.content.split(" ")
    if (messContent.length > 1) {
        gameName = messContent[1]
        for (var i = 2; i < messContent.length; i++) {
            gameName = gameName + " " + messContent[i]
        }
        userActivity = gameName
        userInfo = null
    } else {
        console.log("$$")
        message.guild.presences.cache.map(item => {
            console.log(item.activities)
            if (item.userID === userId) {
                for (act in item.activities) {
                    if (item.activities[act].name === "Custom Status") {
                        userInfo = undefined
                    } else {
                        userInfo = item.activities[act]
                        userActivity = userInfo.name
                    }
                }
            }
        })
    }


    guildAct = {}
    if ((userInfo !== undefined)) {

        message.guild.presences.cache.map(item => {
            for (ind in item.activities) {
                if (item.activities[ind] !== undefined) {
                    if (item.activities[ind].name.toUpperCase() === userActivity.toUpperCase()) {
                        guildAct[item.userID] = { "username": guildUsers[item.userID], "name": item.activities[ind].name, "type": item.activities[ind].type }
                    }
                }
            }
        })

        str = ""
        len = Object.keys(guildAct).length
        isThatYou = false
        for (i in guildAct) {
            if (i === userId) {
                isThatYou = true;
            }
            str = str + guildAct[i].username + "\n"
        }
        console.log(str)
            // message.channel.send("Selam " + guildUsers[userId] + ". Şu anda " + userActivity + " " + typeDict[userInfo.type] + "sun.")
        message.channel.send("Selam " + guildUsers[userId] + ". **" + userActivity.toUpperCase() + "** için arama yapmışsın.")
        if (isThatYou) {
            if (len > 1) {
                message.channel.send(">>> " + len + " kişi " + userActivity.toUpperCase() + " " + typeDict[Object.values(guildAct)[0]["type"]] + " :\n" + str)
            } else {
                message.channel.send("Üzgünüm adamım kimse yok :(")
            }
        } else {
            if (len > 0) {
                message.channel.send(">>> " + len + " kişi " + userActivity.toUpperCase() + " " + typeDict[Object.values(guildAct)[0]["type"]] + " :\n" + str)
            } else {
                message.channel.send("Üzgünüm adamım kimse yok :(")
            }
        }

    } else {
        message.channel.send("Şu anda hiçbir şey yapmıyorsun adamım! Meşgul etmeee")
    }
}