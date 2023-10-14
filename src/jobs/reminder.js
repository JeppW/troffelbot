const { dbManager, guildContext } = require('../database/db');
const { sleep } = require('../util/time');

// keep track of the last reminder that was sent
let lastReminder = '';

const reminderMessages = [
    `wake up, babes. it's <:MiddagsTFT:${process.env.MIDDAGSTFT_EMOJI_ID}> time`,
    `<:MiddagsTFT:${process.env.MIDDAGSTFT_EMOJI_ID}>?`,
    `<:MiddagsTFT:${process.env.MIDDAGSTFT_EMOJI_ID}>`.repeat(3),
    `<:MiddagsTFT:${process.env.MIDDAGSTFT_EMOJI_ID}>`.repeat(24),
    `det tid`
];

const getRandomReminder = () => {
    // filter the last reminder from the list of reminders
    // this is to ensure the same reminder is not sent two consequentive times
    const availableReminders = reminderMessages.filter(reminder => reminder !== lastReminder);
    const reminder = availableReminders[Math.floor(Math.random() * availableReminders.length)];

    // update the lastReminder variable and return the chosen reminder
    lastReminder = reminder;
    return reminder;
}
  
const randomDelay = async (minMinutes, maxMinutes) => {
    // convert to milliseconds
    const minMillis = minMinutes * 60 * 1000;
    const maxMillis = maxMinutes * 60 * 1000;

    // sleep for a random number of milliseconds within the defined interval
    const delayMillis = Math.floor(Math.random() * (maxMillis - minMillis + 1)) + minMillis;
    await sleep(delayMillis);
}

// send a gentle reminder that it's time to play MiddagsTFT
const sendMiddagsTftReminder = async (client) => {
    // wait for 0-20 minutes just so the reminder isn't sent
    // the exact same time every day
    await randomDelay(0, 20);

    // send the reminder to all servers
    for (const guildId of dbManager.getAllGuilds()) {
        guildContext.set(guildId);
        const db = guildContext.getDatabase();
        const channelId = db.getMessageChannel();
        if (!channelId) continue;
    
        const message = getRandomReminder();
    
        client.channels.fetch(channelId)
            .then(channel => channel.send(message))
            .catch(console.error);
    }
}

module.exports = {
    schedule: '0 15 11 * * 1-5',
    execute: sendMiddagsTftReminder
};