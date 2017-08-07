
import {locals} from '../share/locals';

export function register(name, fn) {
    locals.pullers.set(name, fn);
}

export function unregister(name) {
    locals.pullers.delete(name);
}
