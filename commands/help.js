const Discord = require('discord.js');
const fs = require('fs')

exports.run = (client, message, args) => {
    var path = require('path');
    var filename = path.basename(__filename, ".js");

    let rawdata = fs.readFileSync('./data/' + filename + '.txt', 'utf8');
    console.log(rawdata)

    const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#FF5733')
        .setTitle('Komutlar')
        .setDescription(rawdata)
        .setTimestamp()
        .setFooter("Project A Bot'tan sevgilerle", client.user.avatarURL());

    message.channel.send("Yardım istediğini duydum")
    message.channel.send(exampleEmbed);
}