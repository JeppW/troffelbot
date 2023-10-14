const ping = async (interaction) => {
    await interaction.reply("Yeah, yeah, I'm still here. What do you need?");
}

module.exports = {
    name: 'ping',
    description: 'Check if the bot is up',
    options: [],
    execute: ping
};