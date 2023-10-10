const fs = require('fs');

// register all the commands defined in /src/commands
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