const { guildContext } = require('../database/db');

// get a pretty scoreboard for displaying in a discord channel
const getScoreboard = () => {
    const db = guildContext.getDatabase();
    const teams = db.getTeams();

    // team names are padded with whitespace so their scores line up nicely
    const longestTeamName = Math.max(...teams.map(team => team.name.length));

    // display teams in order of ranking
    const sortedTeams = teams.sort((a, b) => b.score - a.score);

    const lines = ['🏆 === Scoreboard === 🏆'];
  
    for (const team of sortedTeams) {
        const paddedTeamName = team.name.padEnd(longestTeamName, ' ');
        const line = `${paddedTeamName} | ${team.score}`;
        lines.push(line);
    }
  
    // the scoreboard is displayed as a code block because
    // it makes the font monospace and i think it looks better
    return '```' + lines.join('\n') + '```';
  }

module.exports = {
    getScoreboard
};