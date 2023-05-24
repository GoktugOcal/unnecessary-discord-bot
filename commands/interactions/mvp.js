const fs = require('fs')

exports.run = (client, message, args) => {

    var path = require('path');
    var filename = path.basename(__filename, ".js");

    let rawdata = fs.readFileSync('./data/' + filename + '.json');
    let data = JSON.parse(rawdata);

    const splittedData = data[getRandomInt(data.length)].split(" ");
    for (i = 0; i < splittedData.length; i++) {
        var emojiName = splittedData[i].match(new RegExp(":" + "(.*)" + ":"));

        if (emojiName !== null) {
            emojiName = emojiName[1];
            emojiID = client.emojis.cache.find(emoji => emoji.name === emojiName).id;
            splittedData[i] = "<:" + emojiName + ":" + emojiID + ">";
        }

    }
    message.channel.send(splittedData.join(" "));
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}