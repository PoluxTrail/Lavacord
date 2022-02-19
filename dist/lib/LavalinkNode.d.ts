import WebSocket from "ws";
import { Manager } from "./Manager";
import { LavalinkNodeOptions, LavalinkStats } from "./Types";
/**
 * The class for handling everything to do with connecting to Lavalink
 */
export declare class LavalinkNode {
    manager: Manager;
    /**
     * The id of the LavalinkNode so Nodes are better organized
     */
    id: string;
    /**
     * The host of the LavalinkNode, this could be a ip or domain.
     */
    host: string;
    /**
     * The port of the LavalinkNode
     */
    port: number | string;
    /**
     * The interval that the node will try to reconnect to lavalink at in milliseconds
     */
    reconnectInterval: number;
    /**
     * The password of the lavalink node
     */
    password: string;
    /**
     * The WebSocket instance for this LavalinkNode
     */
    ws: WebSocket | null;
    /**
     * The statistics of the LavalinkNode
     */
    stats: LavalinkStats;
    /**
     * The resume key to send to the LavalinkNode so you can resume properly
     */
    resumeKey?: string;
    /**
     * The resume timeout
     */
    resumeTimeout: number;
    /**
     * Extra info attached to your node, not required and is not sent to lavalink, purely for you.
     */
    state?: any;
    /**
     * The reconnect timeout
     * @private
     */
    private _reconnect?;
    /**
     * The queue for send
     * @private
     */
    private _queue;
    /**
     * The base of the connection to lavalink
     * @param manager The manager that created the LavalinkNode
     * @param options The options of the LavalinkNode {@link LavalinkNodeOptions}
     */
    constructor(manager: Manager, options: LavalinkNodeOptions);
    /**
     * Connects the node to Lavalink
     */
    connect(): Promise<WebSocket | boolean>;
    /**
     * Sends data to lavalink or puts it in a queue if not connected yet
     * @param msg Data you want to send to lavalink
     */
    send(msg: object): Promise<boolean>;
    /**
     * Configures the resuming key for the LavalinkNode
     * @param key the actual key to send to lavalink to resume with
     * @param timeout how long before the key invalidates and lavalinknode will stop expecting you to resume
     */
    configureResuming(key: string, timeout?: number): Promise<boolean>;
    /**
     * Destroys the connection to the Lavalink Websocket
     */
    destroy(): boolean;
    /**
     * Whether or not the node is connected
     */
    get connected(): boolean;
    /**
     * A private function for handling the open event from WebSocket
     */
    private onOpen;
    /**
     * Private function for handling the message event from WebSocket
     * @param data The data that came from lavalink
     */
    private onMessage;
    /**
     * Private function for handling the error event from WebSocket
     * @param event WebSocket event data
     */
    private onError;
    /**
     * Private function for handling the close event from WebSocket
     * @param event WebSocket event data
     */
    private onClose;
    /**
     * Handles reconnecting if something happens and the node discounnects
     */
    private reconnect;
    /**
     * Sends data to the Lavalink Websocket
     * @param param0 data to send
     */
    private _send;
    /**
     * Flushs the send queue
     */
    private _queueFlush;
}
