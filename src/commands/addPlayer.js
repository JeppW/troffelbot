const { ApplicationCommandOptionType } = require('discord.js');
const { getPuuid } = require('../integrations/riot');
const GuildController = require('../controllers/guildController');

const addPlayer = async (interaction) => {
    const teamName = interaction.options.getString('team-name');
    const playerName = interaction.options.getString('player');

    if (!(await GuildController.teamExists(teamName))) {
        return await interaction.reply("That team doesn't exist.");
    }

    const puuid = await getPuuid(playerName);
    if (!puuid) {
        return await interaction.reply("Hmm, I couldn't find that account using the Riot API. Make sure the username is correct.");
    }

    const allPlayerNames = await GuildController.getAllPlayerNames();
    if (allPlayerNames.includes(playerName)) {
        return await interaction.reply("That player is already registered.");
    }

    await GuildController.addPlayer(teamName, playerName, puuid);

    await interaction.reply(`Added player \`${playerName}\` to team \`${teamName}\`!`);
}

module.exports = {
    name: 'addplayer',
    description: 'Add a player',
    options: [
        {
            name: 'team-name',
            type: ApplicationCommandOptionType.String,
            description: 'Name of the team',
            required: true
        },
        {
            name: 'player',
            type: ApplicationCommandOptionType.String,
            description: 'Riot Games summoner name of the player',
            required: true
        }
    ],
    execute: addPlayer
};