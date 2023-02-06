/*!
// ==UserScript==
// @name         跳转链接修复（外链直达）
// @namespace    https://github.com/maomao1996/tampermonkey-scripts
// @version      1.1.0
// @description  修复跳转链接为站外直链，免去拦截页面点击步骤可直达站外；拦截页面自动跳转；已适配百度、知乎、知乎专栏、掘金、码云、开源中国、简书、CSDN、力扣（Leetcode）、语雀、微信开放社区、微博
// @author       maomao1996
// @include      *
// @grant        none
// ==/UserScript==
*/
;
(function () {
    'use strict';
    var SITES = {
        'baidu.com': {
            transform: {
                selector: '#content_left > div',
                customTransform: function (node) {
                    var originUrl = node.getAttribute('mu');
                    originUrl && node.querySelector('a').setAttribute('href', originUrl);
                }
            }
        },
        'zhihu.com': {
            transform: { selector: '[href*="link.zhihu.com/?target="]' }
        },
        'zhuanlan.zhihu.com': {
            transform: { selector: '[href*="link.zhihu.com/?target="]' }
        },
        'link.zhihu.com': {
            autojump: {}
        },
        'juejin.cn': {
            transform: { selector: '[href*="link.juejin.cn?target="]' }
        },
        'link.juejin.cn': {
            autojump: {}
        },
        'gitee.com': {
            transform: { selector: '[href*="gitee.com/link?target="]' },
            autojump: { validator: function () { return pathname === '/link'; } }
        },
        'oschina.net': {
            transform: {
                selector: '[href*="oschina.net/action/GoToLink?url="]',
                separator: 'GoToLink?url='
            },
            autojump: {
                validator: function () { return pathname === '/action/GoToLink'; },
                query: 'url'
            }
        },
        'jianshu.com': {
            transform: {
                selector: '[href*="links.jianshu.com/go?to="]',
                separator: 'go?to='
            },
            autojump: { validator: function () { return pathname === '/go-wild'; }, query: 'url' }
        },
        'link.csdn.net': {
            autojump: {}
        },
        'leetcode.cn': {
            transform: { selector: '[href*="/link/?target="]' }
        },
        'yuque.com': {
            autojump: { validator: function () { return pathname === '/r/goto'; }, query: 'url' }
        },
        'developers.weixin.qq.com': {
            autojump: {
                validator: function () { return pathname === '/community/middlepage/href'; },
                query: 'href'
            }
        },
        'weibo.cn': {
            autojump: { validator: function () { return pathname === '/sinaurl'; }, query: 'u' }
        }
    };
    var hostname = location.hostname, pathname = location.pathname;
    var _a = SITES[hostname.replace(/^www\./, '')], transform = _a.transform, autojump = _a.autojump;
    if (transform) {
        var selector_1 = transform.selector, _b = transform.separator, separator_1 = _b === void 0 ? '?target=' : _b, _c = transform.customTransform, customTransform_1 = _c === void 0 ? function (node) {
            var _a = node.href.split(separator_1), originUrl = _a[1];
            if (originUrl) {
                node.href = decodeURIComponent(originUrl);
            }
        } : _c;
        var observer = new MutationObserver(function () {
            document.querySelectorAll(selector_1).forEach(customTransform_1);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    if (autojump) {
        var validator = autojump.validator, _d = autojump.query, query = _d === void 0 ? 'target' : _d;
        if (validator && !validator()) {
            return;
        }
        var originUrl = new URLSearchParams(location.search).get(query);
        originUrl && location.replace(originUrl);
    }
})();
