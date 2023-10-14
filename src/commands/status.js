const db = require('../database/db');
const { getScoreboard } = require('../core/scoreboard');

const displayStatus = async (interaction) => {
    const scoreboard = getScoreboard();
    await interaction.reply(scoreboard);
}

module.exports = {
    name: 'status',
    description: 'Display the current MiddagsTFT status',
    options: [],
    execute: displayStatus
};