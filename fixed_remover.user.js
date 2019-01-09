// ==UserScript==
// @name         Fixed Remover
// @namespace    https://github.com/ShoSatoJp
// @version      0.10
// @description  remove fixed elements.
// @author       ShoSato
// @match        *://*/*
// @exclude /^https?:\/\/(.*\.|)(google|amazon)\.(com|co\.[a-zA-Z]{2})\/.*$/
// @exclude /^https?:\/\/(.*\.|)(twitter|github|microsoftonline|visualstudio|dropbox|live|skype|bing|wunderlist|android|youtube|amazon|facebook|apple|regex101)\.com\/.*$/
// @exclude /^https?:\/\/(.*\.|)(nicovideo)\.jp\/.*$/
// @exclude /^https?:\/\/(([^\/]+(bank|gin))\.(com|jp|co\.[a-zA-Z]{2})|([^\/]*\.|)((paypal|smbc-card)\.com)|(mufg|japanpost|smtb)\.jp|(kansaiurban|visa|aeonbank|smbc|smbctb|hyakugo|juroku|boy)\.(com|co\.[a-zA-Z]{2}))\/.*$/
// @exclude *://*ac.jp/*
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
    let TIME = 0;
    document.body && document.body.appendChild(RESULT_ELEMENT);

    function remove_fixed(e, fn) {
        const style = window.getComputedStyle(e);
        if (~['fixed', 'sticky'].indexOf(style.position)) {
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
    function remove_fixed_recursive(target, fn) {
        (function f(e, d = 0) {
            remove_fixed(e, fn);
            d++ >= DEPTH && (DEPTH = d);
            if (d >= MAX_DEPTH) return;
            Array.from(e.children).forEach(x => f(x, d));
            COUNT++;
        })(target);
    }
    remove_fixed_recursive(document.body, () => PROCESSED++);

    //dynamic change
    (new MutationObserver(function (records) {
        records.forEach(x => remove_fixed_recursive(x.target, () => (COUNT++, PROCESSED++)));
    })).observe(document.body, {
        attributes: true,
        childList: true,
        characterData: true,
        attributeFilter: ['style', 'class'],
        subtree: true
    });

    TIME = Date.now() - START;
    show_result(COUNT, PROCESSED);
})();