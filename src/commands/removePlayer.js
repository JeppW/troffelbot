const { ApplicationCommandOptionType } = require('discord.js');
const GuildController = require('../controllers/guildController');

const removePlayer = async (interaction) => {
    const playerName = interaction.options.getString('player');

    const allPlayerNames = await GuildController.getAllPlayerNames();
    if (!allPlayerNames.includes(playerName)) {
        return await interaction.reply("That player doesn't exist.");
    }

    await GuildController.removePlayer(playerName);

    await interaction.reply(`Removed player \`${playerName}\`.`);
}

module.exports = {
    name: 'removeplayer',
    description: 'Remove a player',
    options: [
        {
            name: 'player',
            type: ApplicationCommandOptionType.String,
            description: 'Riot Games username of the player',
            required: true
        }
    ],
    execute: removePlayer
};