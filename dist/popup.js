/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(229);


/***/ },

/***/ 229:
/***/ function(module, exports) {

	'use strict';
	
	function exportContent() {
	  chrome.runtime.sendMessage({ event: 'exportCards' });
	}
	
	function getStore(key) {
	  return new Promise(function (resolve) {
	    chrome.storage.sync.get(key, function (data) {
	      return resolve(data[key]);
	    });
	  });
	}
	
	function getCount() {
	  return getStore('count');
	}
	
	function isDomainEnabled(domain) {
	  return getStore(domain).then(function (isEnabled) {
	    return isEnabled == null ? true : isEnabled;
	  });
	}
	
	function getDomain() {
	  return new Promise(function (resolve, reject) {
	    chrome.tabs.query({
	      active: true,
	      currentWindow: true
	    }, function (tabs) {
	      if (!tabs[0]) {
	        reject('No active tab');
	        return;
	      }
	
	      var url = tabs[0].url;
	      var link = document.createElement('a');
	      link.href = url;
	      var domain = link.hostname;
	
	      resolve(domain);
	    });
	  });
	}
	
	function toggleSite(enabled) {
	  getDomain().then(function (domain) {
	    var data = {};
	    data[domain] = enabled;
	    chrome.storage.sync.set(data);
	  });
	}
	
	function openOptions() {
	  chrome.runtime.openOptionsPage();
	}
	
	document.addEventListener('DOMContentLoaded', function () {
	  getCount().then(function (count) {
	    if (count == 0) {
	      document.body.className = 'empty-content';
	    }
	  });
	
	  getDomain().then(function (domain) {
	    document.getElementById('domain').textContent = domain.replace(/^www\./, '');
	
	    isDomainEnabled(domain).then(function (isEnabled) {
	      document.getElementById('toggle-site').checked = isEnabled;
	    });
	  });
	
	  document.getElementById('btn-export').addEventListener('click', function (e) {
	    e.preventDefault();
	    exportContent();
	  });
	
	  document.getElementById('options-button').addEventListener('click', function (e) {
	    e.preventDefault();
	    openOptions();
	  });
	
	  document.getElementById('toggle-site').addEventListener('change', function (e) {
	    toggleSite(e.target.checked);
	  });
	});

/***/ }

/******/ });
//# sourceMappingURL=popup.js.map