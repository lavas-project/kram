
import {locals} from './share/locals';

export async function pull(repo) {
    let {from, use, dest, options} = repo;
    await locals.pullers.get(use)(from, dest, options);
    return repo;
}

export function pulls(list) {
    return (list || toList(locals.repos)).map(async repo => await pull(repo));
}

function toList(repos) {
    return Object.keys(repos).map(key => Object.assign({name: key}, repos[key]));
}
