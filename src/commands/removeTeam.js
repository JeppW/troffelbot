const { ApplicationCommandOptionType } = require('discord.js');
const { guildContext } = require('../database/db');

const removeTeam = async (interaction) => {
    const db = guildContext.getDatabase();
    const teamName = interaction.options.getString('team-name');

    if (!db.teamExists(teamName)) {
        return await interaction.reply("That team doesn't exist.");
    }

    db.removeTeam(teamName);
    
    await interaction.reply(`Removed team \`${teamName}\`.`);
}

module.exports = {
    name: 'removeteam',
    description: 'Remove a team',
    options: [
        {
            name: 'team-name',
            type: ApplicationCommandOptionType.String,
            description: 'Name of the team',
            required: true
        }
    ],
    execute: removeTeam
};