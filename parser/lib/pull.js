
import {locals} from './share/locals';
import {getPrototype} from './utils/basic';
import {
    BEFORE_PULL,
    AFTER_PULL,
    plugin
} from './component/plugin';

export function pull(list) {
    switch (getPrototype(list)) {
        case 'Object':
            return pullRepo(list);
        case 'Undefined':
            list = toList(locals.repos);
        default:
            return list.map(async repo => await pullRepo(repo));

    }
}

async function pullRepo(repo) {
    locals.logger.info(`pull start: ${repo.name}`);

    await plugin(BEFORE_PULL, repo);

    let {from, use, dest, options} = repo.pull;
    await locals.pullers.get(use)(from, dest, options);

    await plugin(AFTER_PULL, repo);

    locals.logger.info(`pull finish: ${repo.name}`);
    return repo;
}

function toList(repos) {
    return Object.keys(repos).map(key => Object.assign({name: key}, repos[key]));
}
