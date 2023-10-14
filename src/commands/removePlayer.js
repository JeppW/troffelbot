const { ApplicationCommandOptionType } = require('discord.js');
const { guildContext } = require('../database/db');

const removePlayer = async (interaction) => {
    const db = guildContext.getDatabase();
    const playerName = interaction.options.getString('player');

    if (!db.getAllPlayerNames().includes(playerName)) {
        return await interaction.reply("That player doesn't exist.");
    }

    db.removePlayer(playerName);

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