import { LavalinkNode } from "./LavalinkNode";
import { TrackResponse, TrackData, RoutePlannerStatus } from "./Types";
/**
 * A Rest helper for Lavalink
 */
export declare class Rest {
    /**
     * A helper for /loadtracks endpoint
     * @param node The LavalinkNode
     * @param identifer The thing you want to load
     */
    static load(node: LavalinkNode, identifer: string): Promise<TrackResponse>;
    /**
     * A helper for /decodetrack & /decodetracks
     * @param node The lavalink node
     * @param track the track(s) you want to decode
     */
    static decode(node: LavalinkNode, track: string): Promise<TrackData>;
    static decode(node: LavalinkNode, tracks: string[]): Promise<TrackData[]>;
    static decode(node: LavalinkNode, tracks: string | string[]): Promise<TrackData | TrackData[]>;
    /**
     * A helper for /routeplanner/status
     * @param node The LavalinkNode
     */
    static routePlannerStatus(node: LavalinkNode): Promise<RoutePlannerStatus>;
    /**
     * A helper for /routeplanner/free
     * @param node The LavalinkNode
     * @param address the address you want to free, this is optional
     */
    static routePlannerUnmark(node: LavalinkNode, address?: string): Promise<any>;
}
