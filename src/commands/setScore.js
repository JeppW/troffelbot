const { ApplicationCommandOptionType } = require('discord.js');
const db = require("../database/db")

function setScore(interaction) {
    const teamName = interaction.options.getString('team-name');
    const score = interaction.options.getInteger('score');
    
    if (!db.teamExists(teamName)) {
        return interaction.reply("That team doesn't exist.");
    }

    db.setScore(teamName, score);

    interaction.reply(`Updated score for team \`${teamName}\` to ${score}!`);
}

module.exports = {
    name: 'setscore',
    description: 'Manually set a team\'s score',
    options: [
        {
            name: 'team-name',
            type: ApplicationCommandOptionType.String,
            description: 'Name of the team',
            required: true
        },
        {
            name: 'score',
            type: ApplicationCommandOptionType.Integer,
            description: 'Score',
            required: true
        }
    ],
    execute: setScore
}