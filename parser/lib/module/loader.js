
import {locals} from '../share/locals';

import {
    BEFORE_LOAD,
    AFTER_LOAD,
    plugin
} from './module/plugin';

export function configure(loaders) {
    Object.keys(loaders).forEach(key => locals.loaders.set(key, loaders[key]));
}

export async function load(repo) {
    locals.logger.info(`load start: ${repo.name}`);

    await plugin(BEFORE_LOAD, repo);

    let {from, use, dest, options} = repo.loader;
    await locals.loaders.get(use)(from, dest, options);

    await plugin(AFTER_LOAD, repo);

    locals.logger.info(`load finish: ${repo.name}`);
}
