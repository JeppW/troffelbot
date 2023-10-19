const guildContext = require('../context/guildContext');
const { Guild } = require('../models/guild');
const { Player } = require('../models/player');
const { Team } = require('../models/team');

// an interface for interacting with the database
// implemented as an object literal to prevent polluting the global namespace
const GuildController = {
    // internal helper method to get the guild from the context
    async _getGuild() {
        const guildId = guildContext.get();
        const guild = await Guild.findOne( { id: guildId });

        if (!guild) {
            throw new ContextError("No guild matching the current context was found.");
        }

        return guild;
    },

    async getAllGuildIds() {
        const guilds = await Guild.find({}).select('id');
        return guilds.map(guild => guild.id);
    },

    async getTeam(teamName) {
        const guild = await this._getGuild();
        return guild.teams.find(team => team.name === teamName);
    },

    async teamExists(teamName) {
        const guild = await this._getGuild();
        return guild.teams.some(team => team.name === teamName);
    },

    async addTeam(teamName) {
        const guild = await this._getGuild();

        if (guild.teams.some(team => team.name === teamName)) {
            return;
        }

        const team = new Team({ name: teamName });

        guild.teams.push(team);
        await guild.save();
    },

    async removeTeam(teamName) {
        const guild = await this._getGuild();

        if (!guild.teams.some(team => team.name === teamName)) {
            return;
        }

        guild.teams = guild.teams.filter(team => team.name !== teamName);
        await guild.save();
    },

    async getAllTeams() {
        return (await this._getGuild()).teams;
    },

    async addPlayer(teamName, playerName, playerPuuid) {
        const guild = await this._getGuild();

        const team = guild.teams.find(team => team.name === teamName);
        const player = new Player({ name: playerName, puuid: playerPuuid });

        team.players.push(player);
        await guild.save();
    },

    async removePlayer(playerName) {
        const guild = await this._getGuild();

        const team = guild.teams.find(team => team.players.some(player => player.name === playerName));
        team.players = team.players.filter(player => player.name !== playerName);
        
        await guild.save();
    },

    async getScore(teamName) {
        return (await this.getTeam(teamName)).score;
    },

    async setScore(teamName, score) {
        const guild = await this._getGuild();

        const team = guild.teams.find(team => team.name === teamName);
        team.score = score;

        await guild.save();
    },

    async getChannel() {
        return (await this._getGuild()).channel;
    },

    async setChannel(channel) {
        const guild = await this._getGuild();

        guild.channel = channel;

        await guild.save();
    },

    async getRecordedGames() {
        return (await this._getGuild()).recordedGames;
    },

    async addToRecordedGames(gameId) {
        const guild = await this._getGuild();

        guild.recordedGames.push(gameId);

        await guild.save();
    },

    async getLastReminder() {
        return (await this._getGuild()).lastReminder;
    },

    async setLastReminder(reminder) {
        const guild = await this._getGuild();

        guild.lastReminder = reminder;

        await guild.save();
    },

    async getAllPlayers() {
        const teams = await this.getAllTeams();

        return teams.reduce((allPlayers, team) => {
            return allPlayers.concat(team.players);
        }, []);
    },

    async getAllPlayerNames() {
        const allPlayers = await this.getAllPlayers();
        return allPlayers.map(player => player.name);
    },

    async getAllPlayerPuuids() {
        const allPlayers = await this.getAllPlayers();
        return allPlayers.map(player => player.puuid);
    },

    async getPlayerNamesForTeam(teamName) {
        const team = await this.getTeam(teamName);
        return team.players.map(player => player.name);
    },

    async getPlayerPuuidsForTeam(teamName) {
        const team = await this.getTeam(teamName);
        return team.players.map(player => player.puuid);
    },

    async registerWin(teamName, gameId) {
        const guild = await this._getGuild();

        const team = guild.teams.find(team => team.name === teamName);
        
        await this.setScore(teamName, team.score + 1);
        await this.addToRecordedGames(gameId);
    },
}

module.exports = GuildController;