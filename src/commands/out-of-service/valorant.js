const request = require('sync-request');
const Discord = require('discord.js');
const fs = require('fs')
const QuickChart = require('quickchart-js');
/*
var lolHelper = require('../../helpers/lol_helper.js')
var lolButtons = require('../../helpers/lol_buttons.js');
const lol_helper = require('../../helpers/lol_helper.js');*/

exports.create = () => {
    const command = new Discord.SlashCommandBuilder()
        .setName("valorant")
        .setDescription("Valorant commands")
        .addSubcommandGroup( (subcommandGroup) =>
            subcommandGroup
                .setName("summoner")
                .setDescription("Summoner information")
                .addSubcommand( (subcommand) =>
                    subcommand
                        .setName("rank")
                        .setDescription("Summoner's rank")
                        .addStringOption( (option) =>
                            option.setName("summoner-name")
                            .setDescription("Summoner's name whose information you want to get.")
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
                )
        )
        .addSubcommandGroup( (subcommandGroup) =>
            subcommandGroup
            .setName("matches")
            .setDescription("Valorant match information")
            .addSubcommand( subcommand =>
                subcommand
                    .setName("latest")
                    .setDescription("Summoner's Last Matches")
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
                            // { name: "JP1", value: "JP1" },
                            // { name: "KR", value: "KR" },
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
                    )/*
                    .addIntegerOption( (option) =>
                        option.setName("count")
                        .setDescription("Count of last matches.")
                        .setMinValue(0)
                        .setMaxValue(10)
                    )*/
                )
            
            .addSubcommand(subcommand =>
                subcommand
                    .setName('stats')
                    .setDescription('Stats about matches')
                    .addStringOption( (option) => 
                        option
                            .setName("match-id")
                            .setDescription("ID of match")
                            .setRequired(true)
                    )
                )                   
        )
        ;
    
    return command.toJSON()
}


exports.run = async (client, interaction) => {

    let message = await interaction.deferReply(
        {
            fetchReply: true
        }
    )

    try {    
        const subcommandGroup = interaction.options.getSubcommandGroup()
        const subcommand = interaction.options.getSubcommand()
    
        if (subcommandGroup == "summoner") {
            if (subcommand == "rank") {
                return rank_information(client, interaction, message)
            }
        } else if (subcommandGroup == "matches") {
            if (subcommand == "latest") {
                return latest_matches(client, interaction, message, 0)
            }
            else if (subcommand == "stats") {
                return match_stats(client, interaction, message)
            }
        }
    } catch {
        message.edit("Something is wrong 👨‍💻");
        return 0;
    }

    
}

async function rank_information (client, interaction, message, followUpReply = false) {
    
    apikey = process.env.RIOT_API;
    summonerName = interaction.options.getString('summoner-name')
    region = interaction.options.getString('summoner-region')

    var cdnVersion = lolHelper.get_cdn_version() // RIOT API
    var summonerInfo = lolHelper.get_summoner_info(summonerName, region, apikey) // RIOT API

    let summonerId = summonerInfo['id'];
    let summonerIconID = summonerInfo['profileIconId'];

    var rankInfo = lolHelper.get_league_info(summonerId, region, apikey) // RIOT API

    if (rankInfo.length === 0) {
        await interaction.editReply("You don't have a rank 😫 play some LOL")
        return 1
    } else {
        // Generate the embed message
        var exampleEmbed = new Discord.EmbedBuilder()
            .setColor('#FF5733')
            .setTitle(rankInfo[0]["summonerName"])
            .setThumbnail("http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/img/profileicon/" + summonerIconID + ".png")
            .setDescription("Level : " + summonerInfo["summonerLevel"])
            .setFooter(
                { text: "heil to the lord", iconURL: client.user.avatarURL()}
                )
        
        for (idx = 0; idx < rankInfo.length; idx++) {
            exampleEmbed
                .addFields(
                    { name: '`' + rankInfo[idx]["queueType"].replace(/_/g, ' ') + '` ' + rankInfo[idx]["tier"] + " " + rankInfo[idx]["rank"], value: "-----"}
                )
                .addFields(
                    { name: 'Wins', value: rankInfo[idx]["wins"].toString(), inline: true },
                    { name: 'Losses', value: rankInfo[idx]["losses"].toString(), inline: true },
                    { name: 'Hot Streak', value: rankInfo[idx]["hotStreak"].toString(), inline: true },
                    { name: 'League Points', value: rankInfo[idx]["leaguePoints"].toString(), inline: true }
                    )
        };
    }

    // Get the button for last matches
    const row = lolButtons.generateLastMatchButton()

    // reply the interaction            
    var message = await interaction.editReply(
        {
            embeds: [exampleEmbed],
            components: [row],
            fetchReply: true
        }
    );
    
    // set collector and run
    const collectorFilter = i => {
        i.deferUpdate();
        return i.user.id === interaction.user.id;
    };

    message.awaitMessageComponent(
        {
            componentType: Discord.ComponentType.Button,
            time: 60 * 1000,
            filter: collectorFilter
        }
    ).then( async i =>  {
            console.log(`${i.user.username} (${i.user.id}) clicked on the ${i.customId} button.`);
            // set button disabled
            row.components[0].setDisabled(true)
            await interaction.editReply({components: [row]})
            // follow-up message
            latest_matches(client, interaction, message, 0, followUpReply = true)                
        }
    ).catch( async collected => {
            console.log(collected)
            // set button disabled
            row.components[0].setDisabled(true)
            await interaction.editReply({components: [row]})
        }
    );

    return 1
}
