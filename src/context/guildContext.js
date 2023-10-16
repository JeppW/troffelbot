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
}

const guildContext = new GuildContext();

module.exports = guildContext;