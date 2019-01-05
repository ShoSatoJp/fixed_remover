// ==UserScript==
// @name         Fixed Remover
// @namespace    https://github.com/ShoSatoJp
// @version      0.7
// @description  try to take over the world!
// @author       ShoSato
// @match        *://*/*
// @grant        none
// @updateURL https://raw.githubusercontent.com/ShoSatoJp/fixed_remover/master/fixed_remover.js
// @downloadURL https://raw.githubusercontent.com/ShoSatoJp/fixed_remover/master/fixed_remover.js
// ==/UserScript==

(function () {
    'use strict';
    const MAX_DEPTH = 5;
    let DEPTH = 0;
    let COUNT = 0;
    let PROCESSED = 0;

    function remove_fixed(e, fn = null) {
        const style = window.getComputedStyle(e);
        if (style.position === 'fixed') {
            if (parseInt(style.top || '0') === 0) {
                e.style.cssText += ';position:absolute !important;';
            } else {
                e.remove();
            }
            fn && fn();
        }
    }

    //static element
    function f(e, d = 0) {
        remove_fixed(e, () => {
            PROCESSED++;
        });
        d++ >= DEPTH && (DEPTH = d);
        if (d >= MAX_DEPTH) return;
        Array.from(e.children).forEach(x => f(x, d));
        COUNT++;
    }
    const start = Date.now();
    f(document.body);
    const time = Date.now() - start;
    
    const e = document.createElement('p');
    function show_result(count, processed) {
        e.textContent = `${time}ms depth:${DEPTH} count:${count} processed:${processed}`;
    }
    document.body.appendChild(e);

    //dynamic change
    const observer = new MutationObserver(function (records, mo) {
        records.forEach(x => {
            if (x.attributeName === 'style') {
                remove_fixed(x.target, () => {
                    show_result(COUNT++, PROCESSED++);
                });
            }
        });
    });
    observer.observe(document.body, {
        attributes: true,
        childList: true,
        characterData: true,
        attributeFilter: ['style'],
        subtree: true
    });
})();