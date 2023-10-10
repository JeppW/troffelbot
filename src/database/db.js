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

    addTeam(name) {
        this.teams.set(name, {name: name, players: [], score: 0});
    }
    
    getTeam(name) {
        return this.teams.get(name);
    }
    
    teamExists(name) {
        return !!this.getTeam(name);
    }
    
    getTeams() {
        return Array.from(this.teams.values());
    }

    addPlayerToTeam(teamName, playerName, playerPuuid) {
        const team = this.getTeam(teamName);
        team.players.push({name: playerName, puuid: playerPuuid});
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
    
    getAllPlayerPuuids() {
        const teams = this.getTeams();
        return teams.reduce((allPuuids, team) => {
            const teamPuuids = team.players.map(player => player.puuid);
            return allPuuids.concat(teamPuuids);
        }, []);
    };
    
    getPlayerPuuidsForTeam(name) {
        const team = this.getTeam(name);
        return team.players.map(player => player.puuid);
    };
    
    registerWin(name, gameId) {
        this.getTeam(name).score += 1;
        this.addToRecordedGames(gameId);
    }
}

// use a singleton structure; when the database is imported
// by other modules, they interact with the same database
// rather than initialize their own
const db = new Database();

module.exports = db;