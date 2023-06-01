module.exports = {

    lol_basic: async function (client, interaction) {
        client.channels.cache.map( channel => console.log(channel.id))
    }
}