const request = require('sync-request');
var xpath = require('xpath')
, dom = require('xmldom').DOMParser
const Discord = require('discord.js');

exports.run = (client, message, args) => {

    netherlandsURL = "https://en.wikipedia.org/wiki/List_of_European_countries_by_minimum_wage";
    var respond = request("GET",netherlandsURL);
    respond = respond.getBody('utf8');
    var doc = new dom().parseFromString(respond)
    t = xpath.select('/html/body/div[3]/div[3]/div[5]/div[1]/table[4]/tbody/tr[23]/td[2]', doc)
    netherlandsWage = t[0].firstChild.data;


    turkeyURL = "https://tr.wikipedia.org/wiki/T%C3%BCrkiye%27de_asgari_%C3%BCcret";
    var respond = request("GET",turkeyURL);
    respond = respond.getBody('utf8');
    var doc = new dom().parseFromString(respond)
    t = xpath.select('/html/body/div/div/div[1]/div[2]/main/div[3]/div[4]/div[1]/table[1]/tbody/tr[2]/td[3]', doc)
    turkeyWage = t[0].firstChild.data;

    message.channel.send("Asgari ücret karşılaştırması. Birim fiyat üzerinden oranlama yapabilirsin." + "\n🏳‍🌈Netherlands : " + netherlandsWage + " EUR\n🏳‍🌈Turkey : " + turkeyWage.split(",")[0] + " TRY");
}