const { ApplicationCommandOptionType } = require('discord.js');
const db = require("../database/db")

function addTeam(interaction) {
    const teamName = interaction.options.getString('team-name');

    if (db.teamExists(teamName)) {
        return interaction.reply("That team already exists.");
    }

    db.addTeam(teamName);
    
    interaction.reply(`Added team \`${teamName}\`!`);
}

module.exports = {
    name: 'addteam',
    description: 'Add a team',
    options: [
        {
            name: 'team-name',
            type: ApplicationCommandOptionType.String,
            description: 'Name of the team',
            required: true
        }
    ],
    execute: addTeam
}