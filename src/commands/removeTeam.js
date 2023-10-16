const { ApplicationCommandOptionType } = require('discord.js');
const GuildController = require('../controllers/guildController');

const removeTeam = async (interaction) => {
    const teamName = interaction.options.getString('team-name');

    if (!(await GuildController.teamExists(teamName))) {
        return await interaction.reply("That team doesn't exist.");
    }

    await GuildController.removeTeam(teamName);
    
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