const { ApplicationCommandOptionType } = require('discord.js');
const GuildController = require('../controllers/guildController');

const setChannel = async (interaction) => {
    const channel = interaction.options.getChannel('channel');
    
    await GuildController.setChannel(channel.id);

    await interaction.reply(`Coolio, I'll post my updates in <#${channel.id}> from now on.`);
}

module.exports = {
    name: 'setchannel',
    description: 'Set the channel trøffelbot should use for posting updates',
    options: [
        {
            name: 'channel',
            type: ApplicationCommandOptionType.Channel,
            description: 'The channel to use',
            required: true
        }
    ],
    execute: setChannel
};