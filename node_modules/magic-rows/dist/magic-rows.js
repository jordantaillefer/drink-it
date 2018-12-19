(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("magic-rows", [], factory);
	else if(typeof exports === 'object')
		exports["magic-rows"] = factory();
	else
		root["magic-rows"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MagicRows = function () {
	  function MagicRows(form) {
	    _classCallCheck(this, MagicRows);
	
	    if (!form) return;
	
	    this.rows = Array.from(form.querySelectorAll('input[type="text"], input[type="mail"]'));
	
	    this.maxRows = form.dataset.maxRows || 6;
	    this.placeholderFormat = form.dataset.formatPlaceholder;
	    this.idFormat = form.dataset.formatId;
	    this.nameFormat = form.dataset.formatName;
	
	    this.noRows = this.rows.length;
	    this.lastRow = this.rows[this.noRows - 1];
	
	    this.addRow = this.addRow.bind(this);
	
	    this.addEventListeners();
	  }
	
	  _createClass(MagicRows, [{
	    key: 'addEventListeners',
	    value: function addEventListeners() {
	      this.lastRow.addEventListener('focus', this.addRow);
	      this.lastRow.addEventListener('change', this.addRow);
	    }
	  }, {
	    key: 'removeEventListeners',
	    value: function removeEventListeners() {
	      this.lastRow.removeEventListener('focus', this.addRow);
	      this.lastRow.removeEventListener('change', this.addRow);
	    }
	  }, {
	    key: 'addRow',
	    value: function addRow() {
	      if (this.noRows >= this.maxRows) return;
	      if (this.noRows > 1) {
	        if (!this.rows[this.noRows - 2].value) return;
	      }
	
	      this.removeEventListeners();
	
	      this.noRows++;
	
	      var cloneRow = this.cloneRow(this.lastRow);
	      var newRow = this.fillRow(cloneRow);
	
	      this.insertRow(this.lastRow, newRow);
	
	      this.lastRow = newRow;
	      this.rows.push(this.lastRow);
	
	      this.addEventListeners();
	    }
	  }, {
	    key: 'cloneRow',
	    value: function cloneRow(row) {
	      var newRow = this.lastRow.cloneNode(true);
	      newRow.value = '';
	
	      return newRow;
	    }
	  }, {
	    key: 'fillRow',
	    value: function fillRow(row) {
	      var id = row.getAttribute('id');
	      var placeholder = row.getAttribute('placeholder');
	      var name = row.getAttribute('name');
	
	      if (id) row.setAttribute('id', this.getNextValue(id, this.idFormat));
	      if (placeholder) row.setAttribute('placeholder', this.getNextValue(placeholder, this.placeholderFormat));
	      if (name) row.setAttribute('name', this.getNextValue(name, this.nameFormat));
	
	      return row;
	    }
	  }, {
	    key: 'insertRow',
	    value: function insertRow(reference, node) {
	      reference.parentNode.insertBefore(node, reference.nextSibling);
	    }
	  }, {
	    key: 'getNextValue',
	    value: function getNextValue(value, format) {
	      if (format) {
	        return format.includes('$') ? format.replace(/\$+/g, this.getPatternNumbers(format, format.split('$').length - 1)) : format.includes('@') ? format.replace('@', this.getLetter(this.guessNextPatternNumber())) : this.guessNextValue(value);
	      } else {
	        return this.guessNextValue(value);
	      }
	    }
	  }, {
	    key: 'getPatternNumbers',
	    value: function getPatternNumbers(format, noDigits) {
	      return (Array(noDigits).fill('0').join('') + this.guessNextPatternNumber()).slice(-noDigits);
	    }
	  }, {
	    key: 'guessNextPatternNumber',
	    value: function guessNextPatternNumber() {
	      var likelyAttribute = this.lastRow.getAttribute('id') || this.lastRow.getAttribute('name') || this.lastRow.getAttribute('placeholder');
	
	      var numberGuessed = Number(likelyAttribute.replace(/^\D+/g, '')) + 1;
	
	      return !numberGuessed ? this.noRows : numberGuessed;
	    }
	  }, {
	    key: 'guessNextValue',
	    value: function guessNextValue(value) {
	      var noDigits = value.replace(/^\D+/g, '').length;
	
	      return this.hasNumber(value) ? value.replace(/\d+/g, this.getPatternNumbers(value, noDigits)) : value + '-' + this.noRows;
	    }
	  }, {
	    key: 'getLetter',
	    value: function getLetter(number) {
	      return String.fromCharCode(96 + number).toUpperCase();
	    }
	  }, {
	    key: 'hasNumber',
	    value: function hasNumber(string) {
	      return (/\d/.test(string)
	      );
	    }
	  }]);
	
	  return MagicRows;
	}();
	
	window.addEventListener('load', function () {
	  Array.from(document.querySelectorAll('[data-action="magic-rows"]')).forEach(function (form) {
	    return new MagicRows(form);
	  });
	});

/***/ }
/******/ ])
});
;
//# sourceMappingURL=magic-rows.js.map