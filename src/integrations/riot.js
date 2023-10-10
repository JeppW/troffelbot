const axios = require('axios');
const { getTodayTimestamp } = require('../util/time');

// internal helper function for making API requests to the Riot API
// should not be called directly
const _request = async (path, params = {}) => {
    const url = `https://${process.env.RIOT_REGION}.api.riotgames.com${path}`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                'X-Riot-Token': process.env.RIOT_TOKEN  // requests need to be authenticated
            },
            params: params
        });

        return response.data;

    } catch (error) {
        console.log(error);
        return false;
    }
}

// get the puuid by Riot username
// the puuid is a unique identifier for Riot Games accounts used in other API requests
const getPuuid = async (gameName, tagLine = 'EUW') => {
    let userData = await _request(`/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`);
    return userData.puuid;
}

// get the match history of a user
// by default only gets today's matches
const getMatchHistory = async (puuid, startTime = null) => {
    if (!startTime) startTime = getTodayTimestamp();
    let matchHistory = await _request(`/tft/match/v1/matches/by-puuid/${puuid}/ids`, {startTime: startTime});
    return matchHistory;
}

// get the match DTO for a match id
// the match DTO contains all the information about the match
// reference: https://developer.riotgames.com/apis#tft-match-v1/GET_getMatch
const getMatchInfo = async (matchId) => {
    let matchInfo = await _request(`/tft/match/v1/matches/${matchId}`);
    return matchInfo;
}

module.exports = {
    getPuuid,
    getMatchHistory,
    getMatchInfo
};