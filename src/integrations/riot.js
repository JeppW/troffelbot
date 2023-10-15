const axios = require('axios');
const { getTodayTimestamp, sleep } = require('../util/time');

// internal helper function for making API requests to the Riot API
// should not be called directly
const _request = async (path, options = {}) => {
    // parse optional parameters
    const { 
        region = process.env.RIOT_CLUSTER, // default to the environment variable
        params = {} 
    } = options;
    
    const url = `https://${region}.api.riotgames.com${path}`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                'X-Riot-Token': process.env.RIOT_TOKEN  // requests need to be authenticated
            },
            params: params
        });

        // throttle requests a little to help prevent 
        // exceeding the api request limit
        await sleep(250);
        return response.data;

    } catch (error) {
        // this will sometimes happen because we exceed the Riot API rate limit
        // however, the limit will reset, so it is no disaster; we just need
        // to handle this case everytime we call the API
        console.error(error);
        return false;
    }
}

// get the puuid by Riot username
// the puuid is a unique identifier for Riot Games accounts used in other API requests
const getPuuid = async (summonerName) => {
    // this endpoint for some reason uses the player region rather than the cluster region
    const userData = await _request(`/tft/summoner/v1/summoners/by-name/${summonerName}/`, {region: process.env.RIOT_REGION});
    return userData.puuid;
}

// get the match history of a user
// by default only gets today's matches
const getMatchHistory = async (puuid, startTime = null) => {
    if (!startTime) startTime = getTodayTimestamp();
    const matchHistory = await _request(`/tft/match/v1/matches/by-puuid/${puuid}/ids`, {params: {startTime: startTime}});
    return matchHistory;
}

// get the match DTO for a match id
// the match DTO contains all the information about the match
// reference: https://developer.riotgames.com/apis#tft-match-v1/GET_getMatch
const getMatchInfo = async (matchId) => {
    const matchInfo = await _request(`/tft/match/v1/matches/${matchId}`);
    return matchInfo;
}

module.exports = {
    getPuuid,
    getMatchHistory,
    getMatchInfo
};