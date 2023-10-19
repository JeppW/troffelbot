const mongoose = require('mongoose');
const { PlayerSchema } = require('./player');

const TeamSchema = new mongoose.Schema({
    name: String,
    score: { type: Number, default: 0 },
    players: { type: [PlayerSchema], default: [] }
});

const Team = mongoose.model('Team', TeamSchema);

module.exports = {
    TeamSchema,
    Team
};