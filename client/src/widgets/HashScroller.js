
/**
 * @file HashScroller 根据当前 URL 的 hash 进行 smooth scroll 的组件
 * @author tanglei (tanglei02@baidu.com)
 */

import {getOne, get} from '../common/utils/basic';
import {
    rAF,
    scrollTop as getScrollTop
} from '../common/utils/dom';
import {scrollTop} from '../common/easeScroll';

export class HashScroller {
    constructor(params) {
        this.params(params);

        this.onResize = this.calc.bind(this);

        this.onScroll = rAF.bind(null, () => {
            let scrollHash = this.getScrollHash();
            if (scrollHash != null && scrollHash !== this.hash) {
                this.hash = scrollHash;
                this._listeners.forEach(callback => {
                    callback(scrollHash);
                });
            }
        });

        this.unmount();
    }

    mount() {
        if (this._mounted) {
            return this;
        }

        window.addEventListener('resize', this.onResize);
        window.addEventListener('scroll', this.onScroll);
        this._mounted = true;
        return this;
    }

    unmount() {
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('scroll', this.onScroll);
        this._listeners = [];
        this.heights = [];
        this._mounted = false;
        return this;
    }

    params({
        selector,
        root = document,
        offsetTop = 0,
        props = {id: ['dataset', 'id'], hash: ['dataset', 'hash']}
    } = {}) {
        this.selector = selector;
        this.root = root;
        this.offsetTop = offsetTop;
        this.props = props;
        return this;
    }

    listen(callback) {
        this._listeners = this._listeners;
        this._listeners.push(callback);
        return this;
    }

    scrollTo(hash) {
        let height = 0;

        if (hash) {
            let item = getOne(this.heights, item => hash === item.hash);
            height = (get(item, 'top') + 2) || height;
        }

        return new Promise(resolve => {
            setTimeout(async () => {
                await scrollTop(height);
                this.onScroll();
                resolve();
            });
        });
    }

    calc() {
        let doms = this.root.querySelectorAll(this.selector);

        if (!doms || !doms.length) {
            this.heights = [];
            return this;
        }

        this.heights = Array.from(doms)
            .map(dom => {
                let id = get(dom, ...this.props.id);
                let hash = get(dom, ...this.props.hash);
                let top = dom.offsetTop + this.offsetTop;
                return {id, hash, top};
            })
            .map((info, index, heights) => {
                let next = heights[index + 1];
                if (next) {
                    info.bottom = next.top;
                }

                return info;
            });

        return this;
    }

    getScrollHash() {
        let heights = this.heights;

        if (heights == null) {
            return null;
        }

        let scrollTop = getScrollTop();

        for (let i = 0, max = heights.length; i < max; i++) {
            if (heights[i].bottom == null) {
                if (scrollTop >= heights[i].top) {
                    return heights[i].hash;
                }
            }
            else {
                if (scrollTop < heights[i].bottom) {
                    return heights[i].hash;
                }
            }
        }

        return null;
    }
}

export default new HashScroller();
