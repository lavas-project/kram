import {merge, isValidArray} from './utils/basic';
import {locals} from './share/locals';
import {register} from './puller/register';

export function configure({
    store,
    pullers,
    logger,
    repos,
    plugins
}) {
    merge(locals, {store, logger, repos});

    if (isValidArray(pullers)) {
        pullers.forEach(puller => register(puller.name, puller));
    }

    if (isValidArray(plugins)) {

    }
}
