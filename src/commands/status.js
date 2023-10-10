const db = require("../database/db");
const { getScoreboard } = require("../util/scoreboard");

const displayStatus = (interaction) => {
    const scoreboard = getScoreboard();
    interaction.reply(scoreboard);
}

module.exports = {
    name: 'status',
    description: 'Display the current MiddagsTFT status',
    options: [],
    execute: displayStatus
}