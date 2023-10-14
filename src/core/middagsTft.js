const db = require('../database/db');
const { getMatchHistory, getMatchInfo } = require('../integrations/riot');
const { getLocalHourFromTimestamp } = require('../util/time');

const isWithinMiddagsTftTimeRange = (timestamp) => {
    const hours = getLocalHourFromTimestamp(timestamp);
    return (hours >= 11 && hours < 14);
}

const isMiddagsTft = (matchDto) => {
    // check if game finished during lunch time
    // the unix timestamp in the DTO is in milliseconds, so convert to seconds
    if (!isWithinMiddagsTftTimeRange(matchDto.info.game_datetime / 1000)) {
        return false;
    }

    // check if game featured participants from all teams
    const teams = db.getTeams();
    const participants = matchDto.metadata.participants;

    for (const team of teams) {
        const playerPuuids = db.getPlayerPuuidsForTeam(team.name);
        if (!playerPuuids.some(player => participants.includes(player))) {
            return false;
        }
    }

    return true;
}

const getMiddagsTftWinner = (matchDto) => {
    const teams = db.getTeams();
    const participants = matchDto.info.participants;
    
    // sort by placement in ascending order
    participants.sort((a, b) => a.placement - b.placement);

    // find the best placement acheived by a member of either team
    // the team to which the best-placing member belongs is the winner
    for (const participant of participants) {
        for (const team of teams) {
            const playerPuuids = db.getPlayerPuuidsForTeam(team.name);
            if (playerPuuids.includes(participant.puuid)) {
                return team;
            }
        }
    }

    throw new Error("This game wasn't MiddagsTFT!");
}

// get all games that any player has played today
const getCombinedMatchHistory = async () => {
    // use a set to avoid duplicates
    const games = new Set();
    const allPlayers = db.getAllPlayerPuuids();
    
    for (const player of allPlayers) {
        const matchHistory = await getMatchHistory(player);
        if (!matchHistory) continue;
        for (const game of matchHistory) {
            games.add(game);
        }
    }

    return Array.from(games);
}

// returns the DTO of a valid MiddagsTFT game if one is found
// otherwise, returns null
const checkForNewMiddagsTft = async () => {
    const games = await getCombinedMatchHistory();

    if (!games) return;

    for (const game of games) {
        if (db.getRecordedGames().includes(game)) {
            // don't return games that have already been recorded
            continue;
        }

        gameDto = await getMatchInfo(game);
        if (!gameDto) continue;

        if (isMiddagsTft(gameDto)) {
            return gameDto;
        }
    }
}

module.exports = {
    isWithinMiddagsTftTimeRange,
    isMiddagsTft,
    getMiddagsTftWinner,
    checkForNewMiddagsTft,
    getCombinedMatchHistory
};