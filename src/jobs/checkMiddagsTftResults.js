const db = require("../database/db");
const { getCurrentTime } = require("../util/time");
const { getScoreboard } = require("../util/scoreboard");
const { checkForNewMiddagsTft, isWithinMiddagsTftTimeRange, getMiddagsTftWinner } = require("../middagsTft");

// this function checks if any new middagsTFT matches have been played
// if so, it updates the score and posts an update on the Discord server
const checkNewMatchResults = async (client) => {
    // if it isn't middagsTFT time, there's no need to run this function
    if (!isWithinMiddagsTftTimeRange(getCurrentTime())) return;

    // the discord channel where the bot can posts it updates must be configured
    const channelId = db.getMessageChannel();
    if (!channelId) return;

    // check if any games have been played
    const newGame = await checkForNewMiddagsTft();
    if (!newGame) return;

    // if so, find the winner, update the scoreboard and post an update
    const winner = getMiddagsTftWinner(newGame);
    db.registerWin(winner.name, newGame.metadata.match_id);

    const scoreboard = getScoreboard();

    client.channels.fetch(channelId)
        .then(channel => channel.send(`\`${winner.name}\` won MiddagsTFT!`))
        .catch(console.error);

    client.channels.fetch(channelId)
        .then(channel => channel.send(scoreboard))
        .catch(console.error);
}

module.exports = {
    schedule: '*/1 * * * *',
    execute: checkNewMatchResults
};