/// <reference types="node" />
import { EventEmitter } from "events";
import { JoinData, VoiceServerUpdate, VoiceStateUpdate, DiscordPacket, ManagerOptions, JoinOptions, LavalinkNodeOptions, WebsocketCloseEvent } from "./Types";
import { LavalinkNode } from "./LavalinkNode";
import { Player } from "./Player";
import WebSocket from "ws";
/**
 * The class that handles everything to do with Lavalink. it is the hub of the library basically
 */
export declare class Manager extends EventEmitter {
    /**
     * A [**Map**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of Lavalink Nodes
     */
    nodes: Map<string, LavalinkNode>;
    /**
     * A [**Map**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of all the players
     */
    players: Map<string, Player>;
    /**
     * A [**Map**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of all the VOICE_SERVER_UPDATE States
     */
    voiceServers: Map<string, VoiceServerUpdate>;
    /**
     * A [**Map**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of all the VOICE_STATE_UPDATE States
     */
    voiceStates: Map<string, VoiceStateUpdate>;
    /**
     * The user id of the bot this Manager is managing
     */
    user: string;
    /**
     * The amount of shards the bot has, by default its 1
     */
    shards: number;
    /**
     * The send function needs for the library to function
     */
    send?: (packet: DiscordPacket) => unknown;
    /**
     * The Player the manager will use when creating new Players
     */
    private Player;
    /**
     * An Set of all the expecting connections guild id's
     */
    private expecting;
    /**
     * The constructor of the Manager
     * @param nodes A Array of {@link LavalinkNodeOptions} that the Manager will connect to
     * @param options The options for the Manager {@link ManagerOptions}
     */
    constructor(nodes: LavalinkNodeOptions[], options: ManagerOptions);
    /**
     * Connects all the {@link LavalinkNode|LavalinkNodes} to the respective Lavalink instance
     */
    connect(): Promise<Array<WebSocket | boolean>>;
    /**
     * Disconnects everything, basically destorying the manager.
     * Stops all players, leaves all voice channels then disconnects all LavalinkNodes
     */
    disconnect(): Promise<boolean[]>;
    /**
     * Creating a {@link LavalinkNode} and adds it to the the nodes Map
     * @param options The node options of the node you're creating
     */
    createNode(options: LavalinkNodeOptions): LavalinkNode;
    /**
     * Disconnects and Deletes the specified node
     * @param id The id of the node you want to remove
     */
    removeNode(id: string): boolean;
    /**
     * Connects the bot to the selected voice channel
     * @param data The Join Data
     * @param param1 Selfmute and Selfdeaf options, if you want the bot to be deafen or muted upon joining
     */
    join(data: JoinData, joinOptions?: JoinOptions): Promise<Player>;
    /**
     * Leaves the specified voice channel
     * @param guild The guild you want the bot to leave the voice channel of
     */
    leave(guild: string): Promise<boolean>;
    /**
     * Switch a player from one node to another, this is to implement fallback
     * @param player The player you want to switch nodes with
     * @param node The node you want to switch to
     */
    switch(player: Player, node: LavalinkNode): Promise<Player>;
    /**
     * For handling voiceServerUpdate from the user's library of choice
     * @param data The data directly from discord
     */
    voiceServerUpdate(data: VoiceServerUpdate): Promise<boolean>;
    /**
     * For handling voiceStateUpdate from the user's library of choice
     * @param data The data directly from discord
     */
    voiceStateUpdate(data: VoiceStateUpdate): Promise<boolean>;
    /**
     * Just a utility method to easily send OPCode 4 websocket events to discord
     * @param guild The guild is
     * @param channel Voice channel id, or null to leave a voice channel
     * @param param2 Selfmute and Selfdeaf options, if you want the bot to be deafen or muted upon joining
     */
    sendWS(guild: string, channel: string | null, { selfmute, selfdeaf }?: JoinOptions): any;
    /**
     * Gets all connected nodes, sorts them by cou load of the node
     */
    get idealNodes(): LavalinkNode[];
    /**
     * Handles the data of voiceServerUpdate & voiceStateUpdate to see if a connection is possible with the data we have and if it is then make the connection to lavalink
     * @param guildId The guild id that we're trying to attempt to connect to
     */
    private _attemptConnection;
    /**
     * This creates the {@link Player}
     * @param data The Join Data, this is called by {@link Manager.join}
     */
    private spawnPlayer;
}
export interface Manager {
    on(event: "ready", listener: (node: LavalinkNode) => void): this;
    on(event: "raw", listener: (message: unknown, node: LavalinkNode) => void): this;
    on(event: "error", listener: (error: unknown, node: LavalinkNode) => void): this;
    on(event: "disconnect", listener: (eventData: WebsocketCloseEvent, node: LavalinkNode) => void): this;
    on(event: "reconnecting", listener: (node: LavalinkNode) => void): this;
    once(event: "ready", listener: (node: LavalinkNode) => void): this;
    once(event: "raw", listener: (message: unknown, node: LavalinkNode) => void): this;
    once(event: "error", listener: (error: unknown, node: LavalinkNode) => void): this;
    once(event: "disconnect", listener: (eventData: WebsocketCloseEvent, node: LavalinkNode) => void): this;
    once(event: "reconnecting", listener: (node: LavalinkNode) => void): this;
    off(event: "ready", listener: (node: LavalinkNode) => void): this;
    off(event: "raw", listener: (message: unknown, node: LavalinkNode) => void): this;
    off(event: "error", listener: (error: unknown, node: LavalinkNode) => void): this;
    off(event: "disconnect", listener: (eventData: WebsocketCloseEvent, node: LavalinkNode) => void): this;
    off(event: "reconnecting", listener: (node: LavalinkNode) => void): this;
    emit(event: "ready", node: LavalinkNode): boolean;
    emit(event: "raw", message: unknown, node: LavalinkNode): boolean;
    emit(event: "error", error: unknown, node: LavalinkNode): boolean;
    emit(event: "disconnect", eventData: WebsocketCloseEvent, node: LavalinkNode): boolean;
    emit(event: "reconnecting", node: LavalinkNode): boolean;
}
