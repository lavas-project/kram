/**
 * @file index.js
 * @author tanglei (tanglei02@baidu.com)
 */

// import defaultConf from './default';
// import {configure} from './lib/configure';
// import {locals} from './lib/share/locals';

// export {load} from './lib/load';
// export {build} from './lib/build';
// export {parse} from './lib/module/renderer/marked';

// export {configure as configure};
// export {locals as locals};

// export function init(options) {
//     let conf = Object.assign({}, locals.default, options);
//     configure(conf);
// }

export default class Parser {
    constructor() {

    }

    load() {

    }

    build(list) {
        list await list;
        switch (getPrototype(list)) {
            case 'Object':
                return buildRepo(list);
            case 'Undefined':
                list = toList(locals.repos);
            default:
                return list.map(async repo => await buildRepo(repo));
        }
    }

    parse() {

    }

    do() {

    }

    get() {

    }
}

function toList(repos) {
    return Object.keys(repos).map(name => Object.assign({name}, repos[name]));
}
