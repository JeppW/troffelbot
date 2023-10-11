const db = require('../database/db');

const reminderMessages = [
    `Wake up, babes. It's time for <:MiddagsTFT:${process.env.MIDDAGSTFT_EMOJI_ID}>`,
    `<:MiddagsTFT:${process.env.MIDDAGSTFT_EMOJI_ID}>`.repeat(3),
    `<:MiddagsTFT:${process.env.MIDDAGSTFT_EMOJI_ID}>`.repeat(25),
    `det tid`
]

const getRandomReminder = () => {
    return reminderMessages[Math.floor(Math.random() * reminderMessages.length)];
}

// send a gentle reminder that it's time to play MiddagsTFT
const sendMiddagsTftReminder = (client) => {
    const channelId = db.getMessageChannel();
    if (!channelId) return;

    const message = getRandomReminder();

    client.channels.fetch(channelId)
        .then(channel => channel.send(message))
        .catch(console.error);
}

module.exports = {
    schedule: '0 25 11 * * 1-5',
    execute: sendMiddagsTftReminder
};