/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _customElement = __webpack_require__(1);

var _customElement2 = _interopRequireDefault(_customElement);

var _customElement3 = __webpack_require__(3);

var _customElement4 = _interopRequireDefault(_customElement3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* globals window */
window.blue = { count: 0 };
window.customElements.define('blue-basket', _customElement2.default);
window.customElements.define('blue-buy', _customElement4.default);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _render2 = __webpack_require__(2);

var _render3 = _interopRequireDefault(_render2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable no-use-before-define, no-console, class-methods-use-this */
/* globals HTMLElement, window, CustomEvent */


var BlueBasket = function (_HTMLElement) {
  _inherits(BlueBasket, _HTMLElement);

  function BlueBasket() {
    _classCallCheck(this, BlueBasket);

    return _possibleConstructorReturn(this, (BlueBasket.__proto__ || Object.getPrototypeOf(BlueBasket)).apply(this, arguments));
  }

  _createClass(BlueBasket, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      this.refresh = this.refresh.bind(this);
      this.log('connected');
      this.render();
      window.addEventListener('blue:basket:changed', this.refresh);
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      this.log('event recieved "blue:basket:changed"');
      this.render();
    }
  }, {
    key: 'render',
    value: function render() {
      this.innerHTML = (0, _render3.default)(window.blue.count);
    }
  }, {
    key: 'disconnectedCallback',
    value: function disconnectedCallback() {
      window.removeEventListener('blue:basket:changed', this.refresh);
      this.log('disconnected');
    }
  }, {
    key: 'log',
    value: function log() {
      var _console;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_console = console).log.apply(_console, ['🛒 blue-basket'].concat(args));
    }
  }]);

  return BlueBasket;
}(HTMLElement);

exports.default = BlueBasket;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderBasket;
function renderBasket(count) {
  var classname = count === 0 ? 'empty' : 'filled';
  return '<div class="' + classname + '">basket: ' + count + ' item(s)</div>';
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _render2 = __webpack_require__(4);

var _render3 = _interopRequireDefault(_render2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable no-use-before-define, no-console, class-methods-use-this */
/* globals HTMLElement, window, CustomEvent */


var BlueBuy = function (_HTMLElement) {
  _inherits(BlueBuy, _HTMLElement);

  function BlueBuy() {
    _classCallCheck(this, BlueBuy);

    return _possibleConstructorReturn(this, (BlueBuy.__proto__ || Object.getPrototypeOf(BlueBuy)).apply(this, arguments));
  }

  _createClass(BlueBuy, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      this.addToCart = this.addToCart.bind(this);
      var sku = this.getAttribute('sku');
      this.log('connected', sku);
      this.render();
      this.firstChild.addEventListener('click', this.addToCart);
    }
  }, {
    key: 'addToCart',
    value: function addToCart() {
      window.blue.count += 1;
      this.log('event sent "blue:basket:changed"');
      this.dispatchEvent(new CustomEvent('blue:basket:changed', {
        bubbles: true
      }));
    }
  }, {
    key: 'render',
    value: function render() {
      var sku = this.getAttribute('sku');
      this.innerHTML = (0, _render3.default)(sku);
    }
  }, {
    key: 'attributeChangedCallback',
    value: function attributeChangedCallback(attr, oldValue, newValue) {
      this.log('attributeChanged', attr, oldValue, newValue);
      this.render();
    }
  }, {
    key: 'disconnectedCallback',
    value: function disconnectedCallback() {
      this.firstChild.removeEventListener('click', this.addToCart);
      var sku = this.getAttribute('sku');
      this.log('disconnected', sku);
    }
  }, {
    key: 'log',
    value: function log() {
      var _console;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_console = console).log.apply(_console, ['🔘 blue-buy'].concat(args));
    }
  }], [{
    key: 'observedAttributes',
    get: function get() {
      return ['sku'];
    }
  }]);

  return BlueBuy;
}(HTMLElement);

exports.default = BlueBuy;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderBuy;
var prices = {
  t_porsche: '66,00 €',
  t_fendt: '54,00 €',
  t_eicher: '58,00 €'
};

function renderBuy() {
  var sku = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 't_porsche';

  var price = prices[sku];
  return '<button type="button">buy for ' + price + '</button>';
}

/***/ })
/******/ ]);