const mongoose = require('mongoose');
const { TeamSchema } = require('./team');

const GuildSchema = new mongoose.Schema({
    id: String,
    channel: { type: String, default: '' },
    teams: { type: [TeamSchema], default: [] },
    recordedGames: { type: Array, default: [] },
    lastReminder: { type: String, default: ''}
});

const Guild = mongoose.model('Guild', GuildSchema);

module.exports = {
    Guild
};