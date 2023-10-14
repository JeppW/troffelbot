const { Client, GatewayIntentBits } = require("discord.js");

const loadCommands = require('./util/loadCommands');
const scheduleJobs = require('./util/scheduleJobs');
const { dbManager, guildContext } = require("./database/db");

require('dotenv').config();

const commands = loadCommands();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const guildId = interaction.guildId;

    // this should never happen, but just in case
    if (!dbManager.databaseExists(guildId)) {
        dbManager.createDatabase(guildId);
    }

    guildContext.set(guildId);

    let command = commands.find(cmd => cmd.name === interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'An error occurred while executing this command!', ephemeral: true });
    }
});

client.on('guildCreate', (guild) => {
    // create a database when added to a Discord server
    dbManager.createDatabase(guild.id);
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

scheduleJobs(client);