/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';

const { asyncWindowLeakTest } = require("./leak-utils");
const { Loader } = require('sdk/test/loader');
const openWindow = require("sdk/window/utils").open;

exports["test sdk/tab/events does not leak new window"] = function*(assert) {
  yield asyncWindowLeakTest(assert, _ => {
    return new Promise(resolve => {
      let loader = Loader(module);
      let { events } = loader.require('sdk/tab/events');
      let w = openWindow();
      w.addEventListener("load", function(evt) {
        w.addEventListener("DOMWindowClose", function(evt) {
          resolve(loader);
        }, {once: true});
        w.close();
      }, {once: true});
    });
  });
}

exports["test sdk/tab/events does not leak when attached to existing window"] = function*(assert) {
  yield asyncWindowLeakTest(assert, _ => {
    return new Promise(resolve => {
      let loader = Loader(module);
      let w = openWindow();
      w.addEventListener("load", function(evt) {
        let { events } = loader.require('sdk/tab/events');
        w.addEventListener("DOMWindowClose", function(evt) {
          resolve(loader);
        }, {once: true});
        w.close();
      }, {once: true});
    });
  });
}

require("sdk/test").run(exports);
