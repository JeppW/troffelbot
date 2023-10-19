const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    name: String,
    puuid: String
});

const Player = mongoose.model('Player', PlayerSchema);

module.exports = {
    PlayerSchema,
    Player
};