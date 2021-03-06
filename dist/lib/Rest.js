"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rest = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const url_1 = require("url");
const json = (res) => res.json();
/**
 * A Rest helper for Lavalink
 */
class Rest {
    /**
     * A helper for /loadtracks endpoint
     * @param node The LavalinkNode
     * @param identifer The thing you want to load
     */
    static load(node, identifer) {
        const params = new url_1.URLSearchParams();
        params.append("identifier", identifer);
        return node_fetch_1.default(`http://${node.host}:${node.port}/loadtracks?${params}`, { headers: { Authorization: node.password } }).then(json);
    }
    static decode(node, tracks) {
        if (Array.isArray(tracks)) {
            return node_fetch_1.default(`http://${node.host}:${node.port}/decodetracks`, { method: "POST", body: JSON.stringify(tracks), headers: { Authorization: node.password } }).then(json);
        }
        else {
            const params = new url_1.URLSearchParams();
            params.append("track", tracks);
            return node_fetch_1.default(`http://${node.host}:${node.port}/decodetrack?${params}`, { headers: { Authorization: node.password } }).then(json);
        }
    }
    /**
     * A helper for /routeplanner/status
     * @param node The LavalinkNode
     */
    static routePlannerStatus(node) {
        return node_fetch_1.default(`http://${node.host}:${node.port}/routeplanner/status`, { headers: { Authorization: node.password } }).then(json);
    }
    /**
     * A helper for /routeplanner/free
     * @param node The LavalinkNode
     * @param address the address you want to free, this is optional
     */
    static routePlannerUnmark(node, address) {
        if (address) {
            return node_fetch_1.default(`http://${node.host}:${node.port}/routeplanner/free/address`, { method: "POST", body: JSON.stringify({ address }), headers: { Authorization: node.password } }).then(json);
        }
        return node_fetch_1.default(`http://${node.host}:${node.port}/routeplanner/free/all`, { method: "POST", headers: { Authorization: node.password } }).then(json);
    }
}
exports.Rest = Rest;
//# sourceMappingURL=Rest.js.map