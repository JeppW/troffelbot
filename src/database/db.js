class Database {
    constructor() {
        this.teams = new Map();
        this.recordedGames = [];
        this.messageChannel = '';
    }
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
        return this.recordedGames;
    }
    
    addToRecordedGames(gameId) {
        this.recordedGames.push(gameId);
    }
    
    getAllPlayerPuuids() {
        const teams = Array.from(this.teams.values());
        return teams.reduce((acc, team) => {
            const teamPuuids = team.players.map(player => player.puuid);
            return acc.concat(teamPuuids);
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

const db = new Database();

module.exports = db;