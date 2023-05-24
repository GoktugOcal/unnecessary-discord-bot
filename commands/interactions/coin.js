const rp = require('request-promise');
const Discord = require('discord.js');

exports.run = (client, message, args) => {
    promises = [];
    positive_color = "#03fc88";
    negative_color = "#fc0303";
    messContent = message.content.split(" ")
    if (messContent.length > 1) {
        for (var i = 1; i < messContent.length; i++) {
            coinSymbol = messContent[i];
        
            const requestOptions = {
                method: 'GET',
                uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
                qs: {
                    "symbol" : coinSymbol
                },
                headers: {
                    'X-CMC_PRO_API_KEY': 'e297f7af-462a-40a4-938f-404942ea3ad4'
                },
                json: true,
                gzip: true
            };

            promises.push(rp(requestOptions))

        }
    }
    Promise.all(promises).then(result => result.map(response => {
        coinSymbol = Object.keys(response["data"])[0]
        symbol = response["data"][coinSymbol.toUpperCase()]["symbol"];
        coinName = response["data"][coinSymbol.toUpperCase()]["name"];
        price = response["data"][coinSymbol.toUpperCase()]["quote"]["USD"]["price"];
        percent_change_24h = response["data"][coinSymbol.toUpperCase()]["quote"]["USD"]["percent_change_24h"];

        var color = "#fcd703";
        if(percent_change_24h > 0 ){ color = positive_color}
        else{color = negative_color};
        
        const exampleEmbed = new Discord.MessageEmbed()
            .setColor(color)
            .addFields(
                { name: 'Symbol', value: symbol, inline: true },
                { name: '24h Change', value: percent_change_24h.toFixed(2), inline: true },
                { name: 'Price', value: price.toFixed(5), inline: true }, )
            .setTimestamp()

        message.channel.send(exampleEmbed)
        }
    )).catch((err) => {
        console.log('API call error:', err.message);
    });

}