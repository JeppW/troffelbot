const fs = require('fs');

const loadCommands = () => {
    const commands = [];
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        commands.push(command);
    }

    return commands;
};

module.exports = loadCommands;