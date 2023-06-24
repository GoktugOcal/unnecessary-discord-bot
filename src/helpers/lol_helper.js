const request = require('sync-request');

module.exports = {

    get_cdn_version: function () {
        return JSON.parse(request('GET', "https://ddragon.leagueoflegends.com/api/versions.json").getBody('utf8'))[0]
    },

    get_summoner_info: function (summonerName, region, apikey) {

        req = 'https://' + region + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName + '?api_key=' + apikey
        console.log("Summoner info request: " + req)

        summonerInfo = request('GET', req)
        if (summonerInfo.statusCode === 200) { return JSON.parse(summonerInfo.getBody('utf8')) }
        else { throw Error ("Summoner info request responded with code " + summonerInfo.statusCode.toString()) }
    },

    get_league_info: function (summonerId, region, apikey) {

        req = 'https://' + region + '.api.riotgames.com/lol/league/v4/entries/by-summoner/' + summonerId + '?api_key=' + apikey
        console.log("League info request: " + req)

        leagueInfo = request('GET', req)
        if (leagueInfo.statusCode === 200) { return JSON.parse(leagueInfo.getBody('utf8')) }
        else { throw Error ("League Info request responded with code " + leagueInfo.statusCode.toString()) }
    },

    get_latest_matches: function (puuid, region, start, matchCount, apikey) {
        req = 'https://' + region + '.api.riotgames.com/lol/match/v5/matches/by-puuid/' + puuid + '/ids?api_key=' + apikey + "&start="+ start.toString() +"&count=" + matchCount
        console.log("Latest matches info request: " + req)

        latestMatches = request('GET', req)
        if (latestMatches.statusCode === 200) { return JSON.parse(latestMatches.getBody('utf8')) }
        else { throw Error ("Latest matches request responded with code " + latestMatches.statusCode.toString()) }
    },

    get_match_info: async function (gameId, region, apikey) {
        req = 'https://' + region + '.api.riotgames.com/lol/match/v5/matches/' + gameId + '?api_key=' + apikey
        console.log("Match info request: " + req)

        matchInfo = request('GET', req)
        if (matchInfo.statusCode === 200) { return JSON.parse(matchInfo.getBody('utf8')) }
        else { throw Error ("Match info request responded with code " + matchInfo.statusCode.toString()) }
    },

    get_hero_data: function (cdnVersion) {
        return request('GET', "http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/data/en_US/champion.json")
        /*
        heroes = {}
        heroData = JSON.parse(request('GET', "http://ddragon.leagueoflegends.com/cdn/" + cdnVersion + "/data/en_US/champion.json").getBody('utf8'))["data"]
        Object.keys(heroData).map(function(key, index) {
            heroes[heroData[key]["key"]] = key
        })
        */
    }
}