
import {store} from '../components/store';

export const locals = {
    store: store,
    logger: console,
    repos: {},
    pullers: new Map(),
    plugins: new Map()
};
