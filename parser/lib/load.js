
import {locals} from './share/locals';
import {getPrototype} from './utils';
import {
    BEFORE_LOAD_REPOS,
    plugin
} from './module/plugin';
import {load as loadRepo} from './module/loader';

export async function load(list) {
    switch (getPrototype(list)) {
        case 'Object':
            return loadRepo(list);
        case 'Undefined':
            list = toList(locals.repos);
        default:
            list = await plugin(BEFORE_LOAD_REPOS, list, locals.repos);
            return list.map(async repo => await loadRepo(repo));

    }
}

// async function loadRepo(repo) {
//     await load(repo);
//     return repo;
// }

function toList(repos) {
    return Object.keys(repos).map(name => Object.assign({name}, repos[name]));
}
