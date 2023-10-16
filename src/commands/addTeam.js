const { ApplicationCommandOptionType } = require('discord.js');
const GuildController = require('../controllers/guildController');

const addTeam = async (interaction) => {
    const teamName = interaction.options.getString('team-name');

    if (await GuildController.teamExists(teamName)) {
        return await interaction.reply("That team already exists.");
    }

    await GuildController.addTeam(teamName);
    
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