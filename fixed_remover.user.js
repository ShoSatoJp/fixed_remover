// ==UserScript==
// @name         Fixed Remover
// @namespace    https://github.com/ShoSatoJp
// @version      0.8
// @description  remove fixed elements.
// @author       ShoSato
// @match        *://*/*
// @grant        none
// @updateURL https://raw.githubusercontent.com/ShoSatoJp/fixed_remover/master/fixed_remover.user.js
// @downloadURL https://raw.githubusercontent.com/ShoSatoJp/fixed_remover/master/fixed_remover.user.js
// ==/UserScript==

(function () {
    'use strict';
    const MAX_DEPTH = 5;
    const START = Date.now();
    const RESULT_ELEMENT = document.createElement('p');
    let DEPTH = 0;
    let COUNT = 0;
    let PROCESSED = 0;
    document.body.appendChild(RESULT_ELEMENT);

    function remove_fixed(e, fn) {
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

    function show_result(count, processed) {
        RESULT_ELEMENT.textContent = `${TIME}ms depth:${DEPTH} count:${count} processed:${processed}`;
    }

    //static elements
    (function f(e, d = 0) {
        remove_fixed(e, () => PROCESSED++);
        d++ >= DEPTH && (DEPTH = d);
        if (d >= MAX_DEPTH) return;
        Array.from(e.children).forEach(x => f(x, d));
        COUNT++;
    })(document.body);

    //dynamic change
    (new MutationObserver(function (records) {
        records.forEach(x => {
            if (x.attributeName === 'style')
                remove_fixed(x.target, () => show_result(COUNT++, PROCESSED++));
        });
    })).observe(document.body, {
        attributes: true,
        childList: true,
        characterData: true,
        attributeFilter: ['style'],
        subtree: true
    });

    const TIME = Date.now() - START;
    show_result(COUNT, PROCESSED);
})();