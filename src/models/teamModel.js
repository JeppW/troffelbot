const mongoose = require('mongoose');
const { PlayerSchema } = require('./playerModel');

const TeamSchema = new mongoose.Schema({
    name: String,
    score: { type: Number, default: 0 },
    players: { type: [PlayerSchema], default: [] }
});

const TeamModel = mongoose.model('Team', TeamSchema);

module.exports = {
    TeamSchema,
    TeamModel
};