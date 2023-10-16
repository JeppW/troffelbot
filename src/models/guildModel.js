const mongoose = require('mongoose');
const { TeamSchema } = require('./teamModel');

const GuildSchema = new mongoose.Schema({
    id: String,
    channel: { type: String, default: '' },
    teams: { type: [TeamSchema], default: [] },
    recordedGames: { type: Array, default: [] }
});

const GuildModel = mongoose.model('Guild', GuildSchema);

module.exports = {
    GuildModel
};