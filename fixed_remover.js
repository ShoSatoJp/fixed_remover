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
    const START = Date.now();

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
    (function f(e, d = 0) {
        remove_fixed(e, () => {
            PROCESSED++;
        });
        d++ >= DEPTH && (DEPTH = d);
        if (d >= MAX_DEPTH) return;
        Array.from(e.children).forEach(x => f(x, d));
        COUNT++;
    })(document.body);

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

    const TIME = Date.now() - START;

    const RESULT_ELEMENT = document.createElement('p');

    function show_result(count, processed) {
        RESULT_ELEMENT.textContent = `${TIME}ms depth:${DEPTH} count:${count} processed:${processed}`;
    }
    document.body.appendChild(RESULT_ELEMENT);

})();