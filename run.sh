#!/bin sh

if test "$1" != 'release'; then
    # 关掉原先的进程
    ps aux | grep -E 'node index' | grep -v grep | awk {'print $2'} | xargs kill -9
    export NODE_ENV=test
    node index&
else
    export NODE_ENV=production

    # 设置老生代内存最大为800m
    node --max_old_space_size=800 index.js
fi

