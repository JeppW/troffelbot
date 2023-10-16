const { Client, GatewayIntentBits } = require("discord.js");
const mongoose = require('mongoose');

const loadCommands = require('./util/loadCommands');
const scheduleJobs = require('./util/scheduleJobs');
const guildContext = require("./context/guildContext");
const { GuildModel } = require("./models/guildModel");

require('dotenv').config();

// connect to mongo server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB.');
    })       
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

const commands = loadCommands();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const guildId = interaction.guildId;

    // this should never happen, but just in case
    if (!(await GuildModel.findOne({ id: guildId }))) {
        const guild = new GuildModel({ id: guildId });
        await guild.save();
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

client.on('guildCreate', async (guild) => {
    // create a database when added to a Discord server
    const newGuild = new GuildModel({ id: guild.id });
    await newGuild.save();
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

scheduleJobs(client);