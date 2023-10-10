const db = require("../database/db");

const reminderMessages = [
    `Wake up, babes. It's time for <:MiddagsTFT:${process.env.MIDDAGSTFT_EMOJI_ID}>`,
    `<:MiddagsTFT:${process.env.MIDDAGSTFT_EMOJI_ID}>`.repeat(3),
    `<:MiddagsTFT:${process.env.MIDDAGSTFT_EMOJI_ID}>`.repeat(25),
    `det tid`
]

function getRandomReminder() {
    return reminderMessages[Math.floor(Math.random() * reminderMessages.length)];
}

function sendMiddagsTftReminder(client) {
    const channelId = db.getMessageChannel();
    if (!channelId) return;

    const message = getRandomReminder();

    client.channels.fetch(channelId)
        .then(channel => channel.send(message))
        .catch(console.error);
}

module.exports = {
    schedule: '25 11 * * * 1-5',
    execute: sendMiddagsTftReminder
};