/// <reference types="node" />
import { EventEmitter } from "events";
import { LavalinkNode } from "./LavalinkNode";
import { Manager } from "./Manager";
import { LavalinkEvent, LavalinkPlayerState, PlayerEqualizerBand, PlayerPlayOptions, PlayerState, PlayerUpdateVoiceState, JoinOptions, PlayerFilterOptions } from "./Types";
/**
 * The Player class, this handles everything to do with the guild sides of things, like playing, stoping, pausing, resuming etc
 */
export declare class Player extends EventEmitter {
    node: LavalinkNode;
    id: string;
    /**
     * The PlayerState of this Player
     */
    state: PlayerState;
    /**
     * Whether or not the player is actually playing anything
     */
    playing: boolean;
    /**
     * When the track started playing
     */
    timestamp: number | null;
    /**
     * Whether or not the song that is playing is paused or not
     */
    paused: boolean;
    /**
     * The current track in Lavalink's base64 string form
     */
    track: string | null;
    /**
     * The voiceUpdateState of the player, used for swtiching nodes
     */
    voiceUpdateState: PlayerUpdateVoiceState | null;
    /**
     * The constructor of the player
     * @param node The Lavalink of the player
     * @param id the id of the player, aka the guild id
     */
    constructor(node: LavalinkNode, id: string);
    /**
     * Plays the specified song using the base64 string from lavalink
     * @param track The base64 string of the song that you want to play
     * @param options Play options
     */
    play(track: string, options?: PlayerPlayOptions): Promise<boolean>;
    /**
     * Stops the music, depending on how the end event is handled this will either stop
     */
    stop(): Promise<boolean>;
    /**
     * Pauses/Resumes the song depending on what is specified
     * @param pause Whether or not to pause whats currently playing
     */
    pause(pause: boolean): Promise<boolean>;
    /**
     * Resumes the current song
     */
    resume(): Promise<boolean>;
    /**
     * Changes the volume, only for the current song
     * @param volume The volume as a float from 0.0 to 10.0. 1.0 is default.
     */
    volume(volume: number): Promise<boolean>;
    /**
     * Seeks the current song to a certain position
     * @param position Seeks the song to the position specified in milliseconds, use the duration of the song from lavalink to get the duration
     */
    seek(position: number): Promise<boolean>;
    filters(options: PlayerFilterOptions): Promise<boolean>;
    /**
     * Sets the equalizer of the current song, if you wanted to do something like bassboost
     * @param bands The bands that you want lavalink to modify read [IMPLEMENTATION.md](https://github.com/freyacodes/Lavalink/blob/master/IMPLEMENTATION.md#outgoing-messages) for more information
     */
    equalizer(bands: PlayerEqualizerBand[]): Promise<boolean>;
    /**
     * Sends a destroy signal to lavalink, basically just a cleanup op for lavalink to clean its shit up
     */
    destroy(): Promise<boolean>;
    /**
     * Sends voiceUpdate information to lavalink so it can connect to discords voice servers properly
     * @param data The data lavalink needs to connect and recieve data from discord
     */
    connect(data: PlayerUpdateVoiceState): Promise<boolean>;
    /**
     * Use this to switch channels
     * @param channel The channel id of the channel you want to switch to
     * @param options selfMute and selfDeaf options
     */
    switchChannel(channel: string, options?: JoinOptions): any;
    /**
     * Used internally to make sure the Player's node is connected and to easily send data to lavalink
     * @param op the op code
     * @param data the data to send
     */
    private send;
    /**
     * The manager that created the player
     */
    get manager(): Manager;
}
export interface Player {
    on(event: "event", listener: (data: LavalinkEvent) => void): this;
    on(event: "start", listener: (data: LavalinkEvent) => void): this;
    on(event: "end", listener: (data: LavalinkEvent) => void): this;
    on(event: "pause", listener: (pause: boolean) => void): this;
    on(event: "seek", listener: (position: number) => void): this;
    on(event: "error", listener: (error: LavalinkEvent) => void): this;
    on(event: "warn", listener: (warning: string) => void): this;
    on(event: "volume", listener: (volume: number) => void): this;
    on(event: "playerUpdate", listener: (data: {
        state: LavalinkPlayerState;
    }) => void): this;
    on(event: "filters", listener: (data: PlayerFilterOptions) => void): this;
    once(event: "event", listener: (data: LavalinkEvent) => void): this;
    once(event: "start", listener: (data: LavalinkEvent) => void): this;
    once(event: "end", listener: (data: LavalinkEvent) => void): this;
    once(event: "pause", listener: (pause: boolean) => void): this;
    once(event: "seek", listener: (position: number) => void): this;
    once(event: "error", listener: (error: LavalinkEvent) => void): this;
    once(event: "warn", listener: (warning: string) => void): this;
    once(event: "volume", listener: (volume: number) => void): this;
    once(event: "playerUpdate", listener: (data: {
        state: LavalinkPlayerState;
    }) => void): this;
    once(event: "filters", listener: (data: PlayerFilterOptions) => void): this;
    off(event: "event", listener: (data: LavalinkEvent) => void): this;
    off(event: "start", listener: (data: LavalinkEvent) => void): this;
    off(event: "end", listener: (data: LavalinkEvent) => void): this;
    off(event: "pause", listener: (pause: boolean) => void): this;
    off(event: "seek", listener: (position: number) => void): this;
    off(event: "error", listener: (error: LavalinkEvent) => void): this;
    off(event: "warn", listener: (warning: string) => void): this;
    off(event: "volume", listener: (volume: number) => void): this;
    off(event: "playerUpdate", listener: (data: {
        state: LavalinkPlayerState;
    }) => void): this;
    off(event: "filters", listener: (data: PlayerFilterOptions) => void): this;
    emit(event: "event", data: LavalinkEvent): boolean;
    emit(event: "start", data: LavalinkEvent): boolean;
    emit(event: "end", data: LavalinkEvent): boolean;
    emit(event: "pause", pause: boolean): boolean;
    emit(event: "seek", position: number): boolean;
    emit(event: "error", error: LavalinkEvent): boolean;
    emit(event: "warn", warning: string): boolean;
    emit(event: "volume", volume: number): boolean;
    emit(event: "playerUpdate", data: {
        state: LavalinkPlayerState;
    }): boolean;
    emit(event: "filters", data: PlayerFilterOptions): boolean;
}
