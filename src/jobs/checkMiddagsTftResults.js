const GuildController = require('../controllers/guildController');
const guildContext = require('../context/guildContext');
const { getCurrentTime } = require('../util/time');
const { getScoreboard } = require('../core/scoreboard');
const { 
    checkForNewMiddagsTft, 
    isWithinMiddagsTftTimeRange, 
    getMiddagsTftWinner 
} = require('../core/middagsTft');

// this function checks if any new middagsTFT matches have been played
// if so, it updates the score and posts an update on the Discord server
const checkNewMatchResults = async (client) => {
    // if it isn't middagsTFT time, there's no need to run this function
    if (!isWithinMiddagsTftTimeRange(getCurrentTime())) return;

    // check all available databases for new matches
    for (const guildId of await GuildController.getAllGuildIds()) {
        guildContext.set(guildId);

        // check if any games have been played
        const newGame = await checkForNewMiddagsTft();
        if (!newGame) return;

        // if so, find the winner, update the scoreboard and post an update
        const winner = await getMiddagsTftWinner(newGame);
        await GuildController.registerWin(winner.name, newGame.metadata.match_id);

        // however, we can only do this if the update channel is configured
        // if not, we still register the win, we just don't announce it
        const channelId = await GuildController.getChannel();
        if (!channelId) return;

        const scoreboard = await getScoreboard();

        client.channels.fetch(channelId)
            .then(channel => channel.send(`\`${winner.name}\` won MiddagsTFT!`))
            .catch(console.error);

        client.channels.fetch(channelId)
            .then(channel => channel.send(scoreboard))
            .catch(console.error);
    }
}

module.exports = {
    // check for new matches every twelve seconds
    schedule: '*/12 * * * * *',
    execute: checkNewMatchResults
};