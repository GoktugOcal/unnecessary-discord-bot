const Discord = require('discord.js');

exports.create = () => {
    const command = new Discord.SlashCommandBuilder()
        .setName("findplayer")
        .setDescription("Find players")
        .addStringOption( (option) =>
            option.setName("game")
            .setDescription("Game name")
        )
        ;
    return command.toJSON()
}

exports.run = async (client, interaction, args) => {

    var message = await interaction.deferReply({
        fetchReply: true,

    })

    typeDict = {
        0 : "playing",
        1 : "streaming",
        2 : "listening",
        3 : "watching",
        // 4 : "custom"
        4 : "in",
        5 : "looking for"
    }


    const userId = interaction.member.user.id
    var gameName = null
    var activityType = null
    if (interaction.options.getString("game") != null) {
        gameName = interaction.options.getString("game").toUpperCase()
        activityType = 5
    }
    else {
        message.guild.presences.cache.map(presence => {
            if (presence.user.id == userId) {
                if (presence.activities.length > 0){
                    gameName = presence.activities[0].name.toUpperCase()
                    activityType = presence.activities[0].type
                }
            }
        })
        if (gameName == null){
            interaction.editReply({
                content: "You are doing nothing, search guys with `/findplayer` command and `game` option or try while in a game.",
                ephemeral: true
            })
            return 1
        }
    }

    const teammates = []
    message.guild.presences.cache.map(presence => {
        if (presence.user.id != userId) {
            presence.activities.map( activity => {
                if (activity.name.toUpperCase() == gameName) {
                    fetchAndPushMember(message.guild, presence.user.id, teammates)
                }
            })
        }
    })

    var msg = `You are ${typeDict[activityType]} **${gameName}**.\n`;
    if ((await teammates).length > 0){
        msg = msg + `\nOther guys in ${gameName} are:\n`
        for(i=0; i<teammates.length; i++) {
            msg = msg + `- <@${teammates[i].user.id}>\n`
        }
    } else{
        msg = msg + `❓No other guys were found.`
    }

    interaction.editReply(
        {
            content: msg,
        }
    )

    return 1



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
            // console.log(item.user.username)
            // console.log(item.activities)
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

async function fetchAndPushMember(guild, memberId, memberList) {
    try {
      const member = await guild.members.fetch(memberId);
      memberList.push(member);
      console.log('Member fetched and pushed to the list:', member.user.tag);
    } catch (error) {
      console.error('Error fetching member:', error);
    }
  }