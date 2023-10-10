const db = require("../database/db");
const { getCurrentTime } = require("../util/time");
const { getScoreboard } = require("../util/scoreboard");
const { checkForNewMiddagsTft, isWithinMiddagsTftTimeRange, getMiddagsTftWinner } = require("../middagsTft");

async function checkNewMatchResults(client) {
    const channelId = db.getMessageChannel();
    if (!channelId) return;

    if (!isWithinMiddagsTftTimeRange(getCurrentTime())) return;

    const newGame = await checkForNewMiddagsTft();
    if (!newGame) return;

    const winner = getMiddagsTftWinner(newGame);
    db.registerWin(winner.name, newGame.info.match_id);

    const scoreboard = getScoreboard();

    client.channels.fetch(channelId)
        .then(channel => channel.send(`${winner.name} won MiddagsTFT!`))
        .catch(console.error);

    client.channels.fetch(channelId)
        .then(channel => channel.send(scoreboard))
        .catch(console.error);
}

module.exports = {
    schedule: '*/1 * * * *',
    execute: checkNewMatchResults
};