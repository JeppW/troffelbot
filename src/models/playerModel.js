const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    name: String,
    puuid: String
});

const PlayerModel = mongoose.model('Player', PlayerSchema);

module.exports = {
    PlayerSchema,
    PlayerModel
};