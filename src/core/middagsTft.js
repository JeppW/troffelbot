const GuildController = require('../controllers/guildController');
const { getMatchHistory, getMatchInfo } = require('../integrations/riot');
const { getLocalHourFromTimestamp } = require('../util/time');

const isWithinMiddagsTftTimeRange = (timestamp) => {
    const hours = getLocalHourFromTimestamp(timestamp);
    return (hours >= 11 && hours < 18);
}

const isMiddagsTft = async (matchDto) => {
    // check if game finished during lunch time
    // the unix timestamp in the DTO is in milliseconds, so convert to seconds
    if (!isWithinMiddagsTftTimeRange(matchDto.info.game_datetime / 1000)) {
        return false;
    }

    // check if game featured participants from all teams
    const teams = await GuildController.getAllTeams();
    const participants = matchDto.metadata.participants;

    for (const team of teams) {
        const playerPuuids = await GuildController.getPlayerPuuidsForTeam(team.name);
        if (!playerPuuids.some(player => participants.includes(player))) {
            return false;
        }
    }

    return true;
}

const getMiddagsTftWinner = async (matchDto) => {
    const teams = await GuildController.getAllTeams();
    const participants = matchDto.info.participants;
    
    // sort by placement in ascending order
    participants.sort((a, b) => a.placement - b.placement);

    // find the best placement acheived by a member of either team
    // the team to which the best-placing member belongs is the winner
    for (const participant of participants) {
        for (const team of teams) {
            const playerPuuids = await GuildController.getPlayerPuuidsForTeam(team.name);
            if (playerPuuids.includes(participant.puuid)) {
                return team;
            }
        }
    }

    throw new Error("This game wasn't MiddagsTFT!");
}

// get all games that any player has played today
// only choose games that at least one player from each team
// participated in - this saves us some API requests
const getCombinedMatchHistory = async () => {
    const teams = await GuildController.getAllTeams();
    const allGames = new Map();

    for (const team of teams) {
        const players = await GuildController.getPlayerPuuidsForTeam(team.name);
        const teamGames = new Set();

        for (const player of players) {
            const playerGames = await getMatchHistory(player);

            if (!playerGames) {
                // an error occurred during the API request
                return [];
            }

            for (const game of playerGames) {
                teamGames.add(game);
            }
        }

        if (teamGames.size === 0) {
            // if any team has zero games, there's no way
            // there has been a middagsTft, so we might
            // as well just return right away
            return [];
        }

        allGames.set(team.name, teamGames);
    }

    if (allGames.size === 0) {
        // if we have no teams, there are no games
        return [];
    }

    if (Array.from(allGames.values()).some(set => set.size === 0)) {
        // if any of the teams have zero games, there will be no intersection
        return [];
    }

    // one-liner to get the intersection of the sets
    // i.e. the games that at least member from each team participated in
    const candidateGames = Array.from(
        Array.from(allGames.values()).reduce((acc, set) => 
            new Set([...acc].filter(x => set.has(x)))
        )
    );

    return candidateGames;
}

// returns the DTO of a valid MiddagsTFT game if one is found
// otherwise, returns null
const checkForNewMiddagsTft = async () => {
    const games = await getCombinedMatchHistory();

    if (!games) return false;

    for (const game of games) {
        if ((await GuildController.getRecordedGames()).includes(game)) {
            // don't return games that have already been recorded
            continue;
        }

        gameDto = await getMatchInfo(game);
        if (!gameDto) return false;  // an error occurred during the API request

        if (await isMiddagsTft(gameDto)) {
            return gameDto;
        }
    }

    return false;
}

module.exports = {
    isWithinMiddagsTftTimeRange,
    isMiddagsTft,
    getMiddagsTftWinner,
    checkForNewMiddagsTft,
    getCombinedMatchHistory
};