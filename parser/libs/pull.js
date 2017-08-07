
import {locals} from './share/locals';
import {register} from './puller/register';
import pullers from './puller';

pullers.forEach(puller => register(puller.name, puller));

export function pull({from, use, dest, options}) {
    return locals.pullers.get(use)(from, dest, options);
}

export function pulls() {
    return Object.keys(locals.repos)
        .map(key => Object.assign({name: key}, locals.repos[key]))
        .map(repo => pull(repo));
}
