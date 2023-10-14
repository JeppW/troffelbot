// the bot's "database" is just the variables of this class
// this means that the database is emptied every time the bot is restarted
class Database {
    constructor() {
        this.teams = new Map();
        this.recordedGames = new Set();
        this.messageChannel = '';
    }

    /////
    // helper methods for interacting with the database
    /////

    getTeam(name) {
        return this.teams.get(name);
    }

    teamExists(name) {
        return !!this.getTeam(name);
    }

    addTeam(name) {
        this.teams.set(name, {name: name, players: [], score: 0});
    }
    
    removeTeam(name) {
        this.teams.delete(name);
    }
    
    getTeams() {
        return Array.from(this.teams.values());
    }

    addPlayerToTeam(teamName, playerName, playerPuuid) {
        const team = this.getTeam(teamName);
        team.players.push({name: playerName, puuid: playerPuuid});
    }

    removePlayer(name) {
        const team = this.getTeams().find(team => team.players.some(player => player.name === name));
        team.players = team.players.filter(player => player.name !== name);
    }
    
    getScore(name) {
        return this.getTeam(name).score;
    }
    
    setScore(name, score) {
        this.getTeam(name).score = score;
    }
    
    getMessageChannel() {
        return this.messageChannel;
    }
    
    setMessageChannel(newChannel) {
        this.messageChannel = newChannel;
    }

    getRecordedGames() {
        return Array.from(this.recordedGames);
    }
    
    addToRecordedGames(gameId) {
        this.recordedGames.add(gameId);
    }

    getAllPlayers() {
        const teams = this.getTeams();
        return teams.reduce((allPuuids, team) => {
            return allPuuids.concat(team.players);
        }, []);
    };
    
    getAllPlayerPuuids() {
        return this.getAllPlayers().map(player => player.puuid);
    };
    
    getPlayerPuuidsForTeam(name) {
        const team = this.getTeam(name);
        return team.players.map(player => player.puuid);
    };

    getAllPlayerNames() {
        return this.getAllPlayers().map(player => player.name);
    };
    
    getPlayerNamesForTeam(name) {
        const team = this.getTeam(name);
        return team.players.map(player => player.name);
    };
    
    registerWin(name, gameId) {
        this.getTeam(name).score += 1;
        this.addToRecordedGames(gameId);
    }
}

// this class allows multiple servers to use the bot at the same time
// it keeps track of which database belongs to which server
class DBManager {
    constructor() {
        this.dbs = new Map();
    }

    createDatabase(guildId) {
        this.dbs.set(guildId, new Database());
    }

    getDatabase(guildId) {
        return this.dbs.get(guildId);
    }

    databaseExists(guildId) {
        return !!this.getDatabase(guildId);
    }

    getAllGuilds() {
        return this.dbs.keys();
    }
}

// a context class for keeping track of the
// server the bot is interacting with
class GuildContext {
    constructor() {
        this.guildId;
    }

    set(guildId) {
        this.guildId = guildId;
    }

    get() {
        return this.guildId;
    }

    getDatabase() {
        return dbManager.getDatabase(this.guildId);
    }
}

// use a singleton structure; when the database is imported
// by other modules, they interact with the same database
// rather than initialize their own
const dbManager = new DBManager();
const guildContext = new GuildContext();

module.exports = {
    dbManager, 
    guildContext
};