const {REST, Routes} = require('discord.js');
const loadCommands = require('../src/util/loadCommands.js')

require('dotenv').config();

const commands = loadCommands().map(({ name, description, options }) => ({ name, description, options }));
const api = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async() => { 
    try {
        await api.put(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID), { body: commands });
        console.log('Successfully loaded slash commands.');
    } catch (error) {
        console.error(error);
    }
})();