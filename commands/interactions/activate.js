const fs = require('fs');
const { Console } = require('console');

exports.run = (client, message, args) => {

    // message.guild.channels.cache.map(item => {
    //     if (item.type === "text") {
    //         console.log(item.name)
    //     }
    // });

    console.log(client.guilds.cache)

    message.channel.messages.fetch();
    console.log("Fetched.")


}