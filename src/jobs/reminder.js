const guildContext = require('../context/guildContext');
const GuildController = require('../controllers/guildController');
const { randomDelay } = require('../util/time');

const reminderMessages = [
    `wake up, babes. it's <:MiddagsTFT:${process.env.MIDDAGSTFT_EMOJI_ID}> time`,
    `<:MiddagsTFT:${process.env.MIDDAGSTFT_EMOJI_ID}>?`,
    `<:MiddagsTFT:${process.env.MIDDAGSTFT_EMOJI_ID}>`.repeat(3),
    `<:MiddagsTFT:${process.env.MIDDAGSTFT_EMOJI_ID}>`.repeat(24),
    `det tid`
];

const getRandomReminder = async () => {
    // filter the last reminder from the list of reminders
    // this is to ensure the same reminder is not sent two consequentive times
    const lastReminder = await GuildController.getLastReminder();

    const availableReminders = reminderMessages.filter(reminder => reminder !== lastReminder);
    const reminder = availableReminders[Math.floor(Math.random() * availableReminders.length)];

    // update the lastReminder variable and return the chosen reminder
    await GuildController.setLastReminder(reminder);
    return reminder;
}
  
// send a gentle reminder that it's time to play MiddagsTFT
const sendMiddagsTftReminder = async (client) => {
    // wait for 0-20 minutes just so the reminder isn't sent
    // the exact same time every day
    await randomDelay(0, 20);

    // send the reminder to all servers
    for (const guildId of await GuildController.getAllGuildIds()) {
        guildContext.set(guildId);
        
        const channelId = await GuildController.getChannel();
        if (!channelId) continue;

        const message = await getRandomReminder();
    
        client.channels.fetch(channelId)
            .then(channel => channel.send(message))
            .catch(console.error);
    }
}

module.exports = {
    schedule: '0 15 11 * * 1-5',
    execute: sendMiddagsTftReminder
};