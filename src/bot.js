const { Client, GatewayIntentBits } = require("discord.js");
const db = require("./database/db.js");

const loadCommands = require('./util/loadCommands.js');
const scheduleJobs = require('./util/scheduleJobs.js')

require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands = loadCommands();

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    let command = commands.find(cmd => cmd.name === interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        interaction.reply({ content: 'An error occurred while executing this command!', ephemeral: true });
    }
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

scheduleJobs(client);