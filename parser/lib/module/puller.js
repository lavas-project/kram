
import {locals} from '../share/locals';

export function configure(pullers) {
    Object.keys(pullers).forEach(key => locals.pullers.set(key, pullers[key]));
}

export function puller(name) {
    return locals.pullers.get(name);
}
