const { ApplicationCommandOptionType } = require('discord.js');
const { guildContext } = require('../database/db');

const addTeam = async (interaction) => {
    const db = guildContext.getDatabase();
    const teamName = interaction.options.getString('team-name');

    if (db.teamExists(teamName)) {
        return await interaction.reply("That team already exists.");
    }

    db.addTeam(teamName);
    
    await interaction.reply(`Added team \`${teamName}\`!`);
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
};