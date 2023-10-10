const db = require("../database/db");

function getScoreboard(teamsScores) {
    const teams = db.getTeams();

    if (!teams) {
        return '```No scoreboard available.```';
    }

    const longestTeamName = Math.max(...teams.map(team => team.name.length))

    const sortedTeams = teams.sort((a, b) => b.score - a.score);

    const lines = ['🏆 === Scoreboard === 🏆'];
  
    for (team of sortedTeams) {
      const paddedTeamName = team.name.padEnd(longestTeamName, ' ');
      const line = `${paddedTeamName} | ${team.score}`;
      lines.push(line);
    }
  
    return '```' + lines.join('\n') + '```';
  }

module.exports = {
    getScoreboard
};