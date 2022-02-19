"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const events_1 = require("events");
const LavalinkNode_1 = require("./LavalinkNode");
const Player_1 = require("./Player");
/**
 * The class that handles everything to do with Lavalink. it is the hub of the library basically
 */
class Manager extends events_1.EventEmitter {
    /**
     * The constructor of the Manager
     * @param nodes A Array of {@link LavalinkNodeOptions} that the Manager will connect to
     * @param options The options for the Manager {@link ManagerOptions}
     */
    constructor(nodes, options) {
        super();
        /**
         * A [**Map**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of Lavalink Nodes
         */
        this.nodes = new Map();
        /**
         * A [**Map**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of all the players
         */
        this.players = new Map();
        /**
         * A [**Map**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of all the VOICE_SERVER_UPDATE States
         */
        this.voiceServers = new Map();
        /**
         * A [**Map**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of all the VOICE_STATE_UPDATE States
         */
        this.voiceStates = new Map();
        /**
         * The amount of shards the bot has, by default its 1
         */
        this.shards = 1;
        /**
         * The Player the manager will use when creating new Players
         */
        this.Player = Player_1.Player;
        /**
         * An Set of all the expecting connections guild id's
         */
        this.expecting = new Set();
        if (options.user)
            this.user = options.user;
        if (options.shards)
            this.shards = options.shards;
        if (options.player)
            this.Player = options.player;
        if (options.send)
            this.send = options.send;
        for (const node of nodes)
            this.createNode(node);
    }
    /**
     * Connects all the {@link LavalinkNode|LavalinkNodes} to the respective Lavalink instance
     */
    connect() {
        return Promise.all([...this.nodes.values()].map(node => node.connect()));
    }
    /**
     * Disconnects everything, basically destorying the manager.
     * Stops all players, leaves all voice channels then disconnects all LavalinkNodes
     */
    disconnect() {
        const promises = [];
        for (const id of [...this.players.keys()])
            promises.push(this.leave(id));
        for (const node of [...this.nodes.values()])
            promises.push(node.destroy());
        return Promise.all(promises);
    }
    /**
     * Creating a {@link LavalinkNode} and adds it to the the nodes Map
     * @param options The node options of the node you're creating
     */
    createNode(options) {
        const node = new LavalinkNode_1.LavalinkNode(this, options);
        this.nodes.set(options.id, node);
        return node;
    }
    /**
     * Disconnects and Deletes the specified node
     * @param id The id of the node you want to remove
     */
    removeNode(id) {
        const node = this.nodes.get(id);
        if (!node)
            return false;
        return node.destroy() && this.nodes.delete(id);
    }
    /**
     * Connects the bot to the selected voice channel
     * @param data The Join Data
     * @param param1 Selfmute and Selfdeaf options, if you want the bot to be deafen or muted upon joining
     */
    async join(data, joinOptions = {}) {
        const player = this.players.get(data.guild);
        if (player)
            return player;
        await this.sendWS(data.guild, data.channel, joinOptions);
        return this.spawnPlayer(data);
    }
    /**
     * Leaves the specified voice channel
     * @param guild The guild you want the bot to leave the voice channel of
     */
    async leave(guild) {
        await this.sendWS(guild, null);
        const player = this.players.get(guild);
        if (!player)
            return false;
        if (player.listenerCount("end") && player.playing)
            player.emit("end", { type: "TrackEndEvent", reason: "CLEANUP" });
        player.removeAllListeners();
        await player.destroy();
        return this.players.delete(guild);
    }
    /**
     * Switch a player from one node to another, this is to implement fallback
     * @param player The player you want to switch nodes with
     * @param node The node you want to switch to
     */
    async switch(player, node) {
        const { track, state, voiceUpdateState } = { ...player };
        const position = state.position ? state.position + 2000 : 2000;
        await player.destroy();
        player.node = node;
        await player.connect(voiceUpdateState);
        await player.play(track, { startTime: position, volume: state.filters.volume || 1.0 });
        await player.filters(state.filters);
        return player;
    }
    /**
     * For handling voiceServerUpdate from the user's library of choice
     * @param data The data directly from discord
     */
    voiceServerUpdate(data) {
        this.voiceServers.set(data.guild_id, data);
        this.expecting.add(data.guild_id);
        return this._attemptConnection(data.guild_id);
    }
    /**
     * For handling voiceStateUpdate from the user's library of choice
     * @param data The data directly from discord
     */
    voiceStateUpdate(data) {
        if (data.user_id !== this.user)
            return Promise.resolve(false);
        if (data.channel_id) {
            this.voiceStates.set(data.guild_id, data);
            return this._attemptConnection(data.guild_id);
        }
        this.voiceServers.delete(data.guild_id);
        this.voiceStates.delete(data.guild_id);
        return Promise.resolve(false);
    }
    /**
     * Just a utility method to easily send OPCode 4 websocket events to discord
     * @param guild The guild is
     * @param channel Voice channel id, or null to leave a voice channel
     * @param param2 Selfmute and Selfdeaf options, if you want the bot to be deafen or muted upon joining
     */
    sendWS(guild, channel, { selfmute = false, selfdeaf = false } = {}) {
        return this.send({
            op: 4,
            d: {
                guild_id: guild,
                channel_id: channel,
                self_mute: selfmute,
                self_deaf: selfdeaf
            }
        });
    }
    /**
     * Gets all connected nodes, sorts them by cou load of the node
     */
    get idealNodes() {
        return [...this.nodes.values()]
            .filter(node => node.connected)
            .sort((a, b) => {
            const aload = a.stats.cpu ? a.stats.cpu.systemLoad / a.stats.cpu.cores * 100 : 0;
            const bload = b.stats.cpu ? b.stats.cpu.systemLoad / b.stats.cpu.cores * 100 : 0;
            return aload - bload;
        });
    }
    /**
     * Handles the data of voiceServerUpdate & voiceStateUpdate to see if a connection is possible with the data we have and if it is then make the connection to lavalink
     * @param guildId The guild id that we're trying to attempt to connect to
     */
    async _attemptConnection(guildID) {
        const server = this.voiceServers.get(guildID);
        const state = this.voiceStates.get(guildID);
        if (!server || !state || !this.expecting.has(guildID))
            return false;
        const player = this.players.get(guildID);
        if (!player)
            return false;
        await player.connect({ sessionId: state.session_id, event: server });
        this.expecting.delete(guildID);
        return true;
    }
    /**
     * This creates the {@link Player}
     * @param data The Join Data, this is called by {@link Manager.join}
     */
    spawnPlayer(data) {
        const exists = this.players.get(data.guild);
        if (exists)
            return exists;
        const node = this.nodes.get(data.node);
        if (!node)
            throw new Error(`INVALID_HOST: No available node with ${data.node}`);
        const player = new this.Player(node, data.guild);
        this.players.set(data.guild, player);
        return player;
    }
}
exports.Manager = Manager;
//# sourceMappingURL=Manager.js.map