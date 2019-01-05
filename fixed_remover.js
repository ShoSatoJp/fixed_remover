// ==UserScript==
// @name         Fixed Remover
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       ShoSato
// @match        *://*/*
// @grant        none
// @updateURL https://www.dropbox.com/s/zlt03rpwxhysyab/fixed_remover.js?dl=1
// @downloadURL https://www.dropbox.com/s/zlt03rpwxhysyab/fixed_remover.js?dl=1
// ==/UserScript==

(function () {
    'use strict';
    const max_depth = 5;
    let depth = 0;
    let count = 0;
    let processed=0;

    function f(e, d = 0) {
        const style = window.getComputedStyle(e);
        if (style.position === 'fixed') {
            if (parseInt(style.top || '0') === 0) {
                e.style.cssText += ';position:absolute !important;';
            } else {
                e.remove();
            }
            processed++;
        }
        d++ >= depth && (depth = d);
        if (d >= max_depth) return;
        Array.from(e.children).forEach(x => f(x, d));
        count++;
    }
    const start = Date.now();
    f(document.body);
    const e = document.createElement('p');
    e.textContent = `${(Date.now() - start)}ms depth:${depth} count:${count} processed:${processed}`;
    document.body.appendChild(e);
    // document.insertBefore(e,document.body.firstChild);
})();