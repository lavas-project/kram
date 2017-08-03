/**
 * @file Ripple.js
 * @author samthor
 * @description copy from https://github.com/samthor/rippleJS
 */

/**
 * Ripple
 *
 * @param {HTMLElement} root root html element
 */
export default function (root) {
    const CLASS_NAME = 'md-ripple';

    function startRipple(type, at) {
        // let target = at.target;
        let {target: holder, offsetX: x} = at;

        let cl = holder.classList;
        if (!cl.contains(CLASS_NAME)) {
            return false; // ignore
        }

        // Store the event use to generate this ripple on the holder: don't allow
        // further events of different types until we're done. Prevents double-
        // ripples from mousedown/touchstart.
        let prev = holder.getAttribute('data-event');
        if (prev && prev !== type) {
            return false;
        }
        holder.setAttribute('data-event', type);

        // Create and position the ripple.
        let rect = holder.getBoundingClientRect();
        // let x = at.offsetX;
        let y;
        if (x !== undefined) {
            y = at.offsetY;
        }
        else {
            x = at.clientX - rect.left;
            y = at.clientY - rect.top;
        }
        let ripple = document.createElement('div');
        let max;
        if (rect.width === rect.height) {
            max = rect.width * 1.412;
        }
        else {
            max = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
        }
        let dim = max * 2 + 'px';
        ripple.style.width = dim;
        ripple.style.height = dim;
        ripple.style.marginLeft = -max + x + 'px';
        ripple.style.marginTop = -max + y + 'px';

        // Activate/add the element.
        ripple.className = 'ripple';
        holder.appendChild(ripple);
        window.setTimeout(function () {
            ripple.classList.add('held');
        }, 0);

        let releaseEvent = (type === 'mousedown' ? 'mouseup' : 'touchend');
        let release = function (ev) {
            // TODO: We don't check for _our_ touch here. Releasing one finger
            // releases all ripples.
            root.removeEventListener(releaseEvent, release);
            ripple.classList.add('done');

            // larger than animation: duration in css
            window.setTimeout(function () {
                holder.removeChild(ripple);
                if (!holder.children.length) {
                    cl.remove('active');
                    holder.removeAttribute('data-event');
                }
            }, 650);
        };
        root.addEventListener(releaseEvent, release);
    }

    root.addEventListener('mousedown', function (ev) {
        /* eslint-disable */
        if (ev.button == 0) {
            // trigger on left click only
            startRipple(ev.type, ev);
        }
        /* eslint-enable */
    });

    root.addEventListener('touchstart', function (ev) {
        for (let i = 0, max = ev.changedTouches.length; i < max; ++i) {
            startRipple(ev.type, ev.changedTouches[i]);
        }
    });
}
