/**
 * @file npm 高亮
 * @author tanglei (tanglei02@baidu.com)
 */

export default function npm(hljs) {
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
                // Shell built-ins
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
}
