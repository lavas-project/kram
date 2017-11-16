/**
 * @file memory store
 * @author tanglei (tanglei02@baidu.com)
 */

export class MemoryStore {
    constructor() {
        this.map = {};
    }

    async get(key) {
        return this.map[key];
    }

    async set(key, value) {
        this.map[key] = value;
    }

    async remove(key) {
        delete this.map[key];
    }
}
