const axios = require('axios');
const { getTodayTimestamp } = require('./util/time');

async function _request(path, params = {}) {
    const url = `https://${process.env.RIOT_REGION}.api.riotgames.com${path}`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                'X-Riot-Token': process.env.RIOT_TOKEN
            },
            params: params
        });

        return response.data;

    } catch (error) {
        console.log(error);
        return false;
    }
}

async function getPuuid(gameName, tagLine = "EUW") {
    let userData = await _request(`/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`);
    return userData.puuid;
}

async function getMatchHistory(puuid, startTime = null) {
    if (!startTime) startTime = getTodayTimestamp();
    let matchHistory = await _request(`/tft/match/v1/matches/by-puuid/${puuid}/ids`, {startTime: startTime});
    return matchHistory;
}

async function getMatchInfo(matchId) {
    let matchInfo = await _request(`/tft/match/v1/matches/${matchId}`);
    return matchInfo;
}

module.exports = {
    getPuuid,
    getMatchHistory,
    getMatchInfo
};