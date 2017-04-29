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

	module.exports = __webpack_require__(228);


/***/ },

/***/ 228:
/***/ function(module, exports) {

	'use strict';
	
	var defaultOptions = {
	  targetLanguage: 'en',
	  behavior: 'double-click',
	  ttsEnabled: false
	};
	
	// Saves options to chrome.storage.sync.
	function saveOptions(form) {
	  var data = {
	    'userOptions': JSON.stringify({
	      targetLanguage: form.elements.targetLanguage.value,
	      behavior: form.elements.behavior.value,
	      ttsEnabled: form.elements.tts.checked
	    })
	  };
	
	  chrome.storage.sync.set(data, function () {
	    // Update status to let user know options were saved.
	    var status = document.getElementById('status');
	    status.textContent = 'Options saved.';
	    setTimeout(function () {
	      status.textContent = '';
	    }, 750);
	  });
	}
	
	// Restores the form state using the preferences stored in chrome.storage.
	function restoreOptions(form) {
	  chrome.storage.sync.get('userOptions', function (data) {
	    var userOptions = Object.assign({}, defaultOptions, data.userOptions ? JSON.parse(data.userOptions) : {});
	    form.elements.targetLanguage.value = userOptions.targetLanguage;
	    form.elements.behavior.value = userOptions.behavior;
	    form.elements.tts.checked = userOptions.ttsEnabled;
	  });
	}
	
	// Init
	document.addEventListener('DOMContentLoaded', function () {
	  var form = document.getElementById('options-form');
	
	  form.addEventListener('submit', function (e) {
	    e.preventDefault();
	    saveOptions(form);
	  });
	
	  restoreOptions(form);
	});

/***/ }

/******/ });
//# sourceMappingURL=options.js.map