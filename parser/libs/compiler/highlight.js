/**
 * @file highlight.js 代码高亮相关
 * @author tanglei (tanglei02@baidu.com)
 */

import hljs from 'highlight.js';
import {encodeTag} from '../utils/html';

// 注册 npm yarn git 的高亮
hljs.registerLanguage('npm', hljs => {
    return {
        aliases: ['yarn', 'git'],
        /* eslint-disable */
        keywords: {
            keyword: ''
                // npm
                + 'access adduser bin bugs c cache completion config ddp dedupe deprecate dist-tag docs edit explore get help help-search i init install install-test it link list ln logout ls outdated owner pack ping prefix prune publish rb rebuild repo restart root run run-script s se search set shrinkwrap star stars start stop t tag team test tst un uninstall unpublish unstar up update v version view whoami'
                // yarn
                + ' add bin cache check clean config create generate-lock-entry global help import info init install licenses link login logout list outdated owner pack publish remove run self-update tag team test unlink upgrade upgrade-interactive version versions why'
                // git
                + ' clone init add mv reset rm bisect grep log show status branch checkout commit diff merge rebase tag fetch pull push',

            built_in: ''
                + 'npm yarn git '
                + // Shell built-ins
                // http://www.gnu.org/software/bash/manual/html_node/Shell-Builtin-Commands.html
                + 'break cd continue eval exec exit export getopts hash pwd readonly return shift test times '
                + 'trap umask unset '
                // Bash built-ins
                + 'alias bind builtin caller command declare echo enable help let local logout mapfile printf '
                + 'read readarray source type typeset ulimit unalias '
                // Shell modifiers
                + 'set shopt '
                // Zsh built-ins
                + 'autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles '
                + 'compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate '
                + 'fc fg float functions getcap getln history integer jobs kill limit log noglob popd print '
                + 'pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit '
                + 'unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof '
                + 'zpty zregexparse zsocket zstyle ztcp'
        },
        /* eslint-enable */
        contains: [
            {
                className: 'meta',
                begin: /^#![^\n]+sh\s*$/,
                relevance: 10
            },
            {
                className: 'meta',
                begin: '^\\s{0,3}[\\w\\d\\[\\]()@-]*[>%$#]'
            }
        ]
    };
});

// 注册 vue 的高亮
hljs.registerLanguage('vue', hljs => {
    return {
        /* eslint-disable */
        case_insensitive: true,
        /* eslint-enable */
        subLanguage: 'xml'
    };
});

// 默认将 tab 转为 4 空格
const defaultConf = {
    tabReplace: '    '
};

hljs.configure(defaultConf);

/**
 * 高亮代码块
 *
 * @param {string} code 代码
 * @param {string} language 代码语言
 * @param {Object=} options 选项
 * @param {Object} options.logger logger
 * @return {string} 高亮好的代码块
 */
export function highlight(code, language, {logger = console} = {}) {
    if (hljs.getLanguage(language)) {
        try {
            return hljs.highlight(language, code).value;
        }
        catch (e) {
            // auto 的染色都是有问题的 还不如不染了
            logger.error(`Error in highlight lang=${language}:`);
        }
    }

    return encodeTag(code);
}

/**
 * 注册新语言
 *
 * @param {Object} options options
 * @param {string} options.name 名称
 * @param {Function} options.fn 解析方法
 */
export function hljsRegister({name, fn}) {
    hljs.registerLanguage(name, fn);
}

/**
 * highlight.js 配置
 *
 * @param {Object} options 配置参数
 */
export function hljsConfigure(options) {
    hljs.configure(Object.assign({}, defaultConf, options));
}
