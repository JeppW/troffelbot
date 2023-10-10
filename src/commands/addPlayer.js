const { ApplicationCommandOptionType } = require('discord.js');
const { getPuuid } = require('../integrations/riot');
const db = require('../database/db');

const addPlayer = async (interaction) => {
    const teamName = interaction.options.getString('team-name');
    const playerName = interaction.options.getString('player');
    const tagLine = interaction.options.getString('tag-line') || null;

    if (!db.teamExists(teamName)) {
        return interaction.reply("That team doesn't exist.");
    }

    const puuid = tagLine ? await getPuuid(playerName, tagLine) : await getPuuid(playerName);
    if (!puuid) {
        return interaction.reply("Hmm, I couldn't find that account using the Riot API. Make sure the username and tag line is correct.");
    }

    if (db.getAllPlayerPuuids().includes(puuid)) {
        return interaction.reply("That player is already registered.");
    }

    db.addPlayerToTeam(teamName, playerName, puuid);

    interaction.reply(`Added player \`${playerName}\` to team \`${teamName}\`!`);
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
            description: 'Riot Games user name of the player',
            required: true
        },
        {
            name: 'tag-line',
            type: ApplicationCommandOptionType.String,
            description: 'Riot Games account tag line (defaults to "EUW")',
            required: false
        }
    ],
    execute: addPlayer
};