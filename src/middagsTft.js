const db = require("./database/db.js");
const { getMatchHistory, getMatchInfo } = require("./riot.js");
const { getLocalHourFromTimestamp } = require("./util/time.js");

function isWithinMiddagsTftTimeRange(timestamp) {
    const hours = getLocalHourFromTimestamp(timestamp);
    return (hours >= 11 && hours < 14);
}

function isMiddagsTft(matchDto) {
    // game finished between 11 and 14    
    if (!isWithinMiddagsTftTimeRange(matchDto.info.game_datetime)) {
        return false;
    }

    // game featured participants from all teams
    const teams = db.getTeams();
    const participants = matchDto.metadata.participants;

    for (team of teams) {
        const playerPuuids = db.getPlayerPuuidsForTeam(team.name);
        if (!(playerPuuids.some(player => participants.includes(player)))) {
            return false;
        }
    }

    return true;
}

function getMiddagsTftWinner(matchDto) {
    const teams = db.getTeams();
    const participants = matchDto.info.participants;
    
    // sort by placement in ascending order
    participants.sort((a, b) => a.placement - b.placement);

    // find the best placement acheived by a member of either team
    // the team to which the best-placing member belongs is the winner
    for (participant of participants) {
        for (team of teams) {
            const playerPuuids = db.getPlayerPuuidsForTeam(team.name);
            if (playerPuuids.includes(participant.puuid)) {
                return team;
            }
        }
    }

    throw new Error("This game wasn't MiddagsTFT!");
}

async function getCombinedMatchHistory() {
    const games = [];
    const allPlayers = db.getAllPlayerPuuids();
    
    for (player of allPlayers) {
        const matchHistory = await getMatchHistory(player);
        if (!matchHistory) continue;
        games.push(...matchHistory);
    }

    return games;
}

// returns the DTO of a valid MiddagsTFT game if one is found
// otherwise, returns null
async function checkForNewMiddagsTft() {
    const games = await getCombinedMatchHistory();

    if (!games) return;

    for (game of games) {
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