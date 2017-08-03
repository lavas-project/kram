/**
 * @file memory store
 * @author tanglei (tanglei02@baidu.com)
 */

import {get} from '../utils/basic';
import cluster from 'cluster';

export const SYNC_MEMORY_STORE = 'response_sync_memory_store';

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

    async destroy(key) {
        delete this.map[key];
    }
}

export const store = new MemoryStore();

if (cluster.isWorker) {
    cluster.worker.on('message', msg => {
        if (get(msg, 'cmd') !== SYNC_MEMORY_STORE) {
            return;
        }

        store.map = msg.data;
    });
}
else {
    cluster.on('fork', worker => {
        worker.send({
            cmd: SYNC_MEMORY_STORE,
            data: store.map
        });
    });

    let sync = function () {
        Object.keys(cluster.workers)
        .forEach(id => {
            cluster.workers[id].send({
                cmd: SYNC_MEMORY_STORE,
                data: store.map
            });
        });
    };

    store.set = async function (key, value) {
        this.map[key] = value;
        sync();
    };

    store.destroy = async function (key) {
        delete this.map[key];
        sync();
    };
}
