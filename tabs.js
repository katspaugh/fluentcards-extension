/**
 * Copyright (c) 2011 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

function loadContentScriptInAllTabs() {
    chrome.windows.getAll({ 'populate': true }, function (windows) {
        for (var i = 0; i < windows.length; i++) {
            var tabs = windows[i].tabs;
            for (var j = 0; j < tabs.length; j++) {
                chrome.tabs.executeScript(
                    tabs[j].id,
                    { file: 'content_script.js', allFrames: true });
            }
        }
    });
}
