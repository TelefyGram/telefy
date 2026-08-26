(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("tdweb", [], factory);
	else if(typeof exports === 'object')
		exports["tdweb"] = factory();
	else
		root["tdweb"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "/tdweb/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = false;



/***/ }),
/* 1 */
/***/ (function(module, exports) {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(9);

var iterableToArrayLimit = __webpack_require__(10);

var nonIterableRest = __webpack_require__(11);

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function() {
  return new Worker(__webpack_require__.p + "43e37047529305204b53.worker.js");
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(13);
var bytesToUuid = __webpack_require__(14);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(15);


/***/ }),
/* 9 */
/***/ (function(module, exports) {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

module.exports = _nonIterableRest;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 13 */
/***/ (function(module, exports) {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


/***/ }),
/* 14 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/typeof.js
var helpers_typeof = __webpack_require__(4);
var typeof_default = /*#__PURE__*/__webpack_require__.n(helpers_typeof);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/slicedToArray.js
var slicedToArray = __webpack_require__(5);
var slicedToArray_default = /*#__PURE__*/__webpack_require__.n(slicedToArray);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/asyncToGenerator.js
var asyncToGenerator = __webpack_require__(1);
var asyncToGenerator_default = /*#__PURE__*/__webpack_require__.n(asyncToGenerator);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/classCallCheck.js
var classCallCheck = __webpack_require__(2);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/createClass.js
var createClass = __webpack_require__(3);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass);

// EXTERNAL MODULE: ./src/worker.js
var worker = __webpack_require__(6);
var worker_default = /*#__PURE__*/__webpack_require__.n(worker);

// CONCATENATED MODULE: ./node_modules/broadcast-channel/dist/es/util.js
/**
 * returns true if the given object is a promise
 */
function isPromise(obj) {
  if (obj && typeof obj.then === 'function') {
    return true;
  } else {
    return false;
  }
}
function sleep(time) {
  if (!time) time = 0;
  return new Promise(function (res) {
    return setTimeout(res, time);
  });
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
/**
 * https://stackoverflow.com/a/1349426/3443137
 */

function randomToken(length) {
  if (!length) length = 5;
  var text = '';
  var possible = 'abcdefghijklmnopqrstuvwxzy0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
var lastMs = 0;
var additional = 0;
/**
 * returns the current time in micro-seconds,
 * WARNING: This is a pseudo-function
 * Performance.now is not reliable in webworkers, so we just make sure to never return the same time.
 * This is enough in browsers, and this function will not be used in nodejs.
 * The main reason for this hack is to ensure that BroadcastChannel behaves equal to production when it is used in fast-running unit tests.
 */

function microSeconds() {
  var ms = new Date().getTime();

  if (ms === lastMs) {
    additional++;
    return ms * 1000 + additional;
  } else {
    lastMs = ms;
    additional = 0;
    return ms * 1000;
  }
}
// EXTERNAL MODULE: ./node_modules/detect-node/browser.js
var browser = __webpack_require__(0);
var browser_default = /*#__PURE__*/__webpack_require__.n(browser);

// CONCATENATED MODULE: ./node_modules/broadcast-channel/dist/es/methods/native.js


var native_microSeconds = microSeconds;
var type = 'native';
function create(channelName) {
  var state = {
    messagesCallback: null,
    bc: new BroadcastChannel(channelName),
    subFns: [] // subscriberFunctions

  };

  state.bc.onmessage = function (msg) {
    if (state.messagesCallback) {
      state.messagesCallback(msg.data);
    }
  };

  return state;
}
function native_close(channelState) {
  channelState.bc.close();
  channelState.subFns = [];
}
function postMessage(channelState, messageJson) {
  channelState.bc.postMessage(messageJson, false);
}
function onMessage(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
}
function canBeUsed() {
  /**
   * in the electron-renderer, isNode will be true even if we are in browser-context
   * so we also check if window is undefined
   */
  if (browser_default.a && typeof window === 'undefined') return false;

  if (typeof BroadcastChannel === 'function') {
    if (BroadcastChannel._pubkey) {
      throw new Error('BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill');
    }

    return true;
  } else return false;
}
function averageResponseTime() {
  return 100;
}
/* harmony default export */ var methods_native = ({
  create: create,
  close: native_close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: native_microSeconds
});
// CONCATENATED MODULE: ./node_modules/broadcast-channel/dist/es/oblivious-set.js
/**
 *
 *
 */
var ObliviousSet = function ObliviousSet(ttl) {
  this.ttl = ttl;
  this.set = new Set();
  this.timeMap = new Map();
  this.has = this.set.has.bind(this.set);
};

ObliviousSet.prototype = {
  add: function add(value) {
    this.timeMap.set(value, oblivious_set_now());
    this.set.add(value);

    _removeTooOldValues(this);
  },
  clear: function clear() {
    this.set.clear();
    this.timeMap.clear();
  }
};
function _removeTooOldValues(obliviousSet) {
  var olderThen = oblivious_set_now() - obliviousSet.ttl;
  var iterator = obliviousSet.set[Symbol.iterator]();

  while (true) {
    var value = iterator.next().value;
    if (!value) return; // no more elements

    var time = obliviousSet.timeMap.get(value);

    if (time < olderThen) {
      obliviousSet.timeMap["delete"](value);
      obliviousSet.set["delete"](value);
    } else {
      // we reached a value that is not old enough
      return;
    }
  }
}

function oblivious_set_now() {
  return new Date().getTime();
}

/* harmony default export */ var oblivious_set = (ObliviousSet);
// CONCATENATED MODULE: ./node_modules/broadcast-channel/dist/es/options.js
function fillOptionsWithDefaults(options) {
  if (!options) options = {};
  options = JSON.parse(JSON.stringify(options)); // main

  if (typeof options.webWorkerSupport === 'undefined') options.webWorkerSupport = true; // indexed-db

  if (!options.idb) options.idb = {}; //  after this time the messages get deleted

  if (!options.idb.ttl) options.idb.ttl = 1000 * 45;
  if (!options.idb.fallbackInterval) options.idb.fallbackInterval = 150; // localstorage

  if (!options.localstorage) options.localstorage = {};
  if (!options.localstorage.removeTimeout) options.localstorage.removeTimeout = 1000 * 60; // node

  if (!options.node) options.node = {};
  if (!options.node.ttl) options.node.ttl = 1000 * 60 * 2; // 2 minutes;

  if (typeof options.node.useFastPath === 'undefined') options.node.useFastPath = true;
  return options;
}
// CONCATENATED MODULE: ./node_modules/broadcast-channel/dist/es/methods/indexed-db.js
/**
 * this method uses indexeddb to store the messages
 * There is currently no observerAPI for idb
 * @link https://github.com/w3c/IndexedDB/issues/51
 */


var indexed_db_microSeconds = microSeconds;


var DB_PREFIX = 'pubkey.broadcast-channel-0-';
var OBJECT_STORE_ID = 'messages';
var indexed_db_type = 'idb';
function getIdb() {
  if (typeof indexedDB !== 'undefined') return indexedDB;
  if (typeof window.mozIndexedDB !== 'undefined') return window.mozIndexedDB;
  if (typeof window.webkitIndexedDB !== 'undefined') return window.webkitIndexedDB;
  if (typeof window.msIndexedDB !== 'undefined') return window.msIndexedDB;
  return false;
}
function createDatabase(channelName) {
  var IndexedDB = getIdb(); // create table

  var dbName = DB_PREFIX + channelName;
  var openRequest = IndexedDB.open(dbName, 1);

  openRequest.onupgradeneeded = function (ev) {
    var db = ev.target.result;
    db.createObjectStore(OBJECT_STORE_ID, {
      keyPath: 'id',
      autoIncrement: true
    });
  };

  var dbPromise = new Promise(function (res, rej) {
    openRequest.onerror = function (ev) {
      return rej(ev);
    };

    openRequest.onsuccess = function () {
      res(openRequest.result);
    };
  });
  return dbPromise;
}
/**
 * writes the new message to the database
 * so other readers can find it
 */

function writeMessage(db, readerUuid, messageJson) {
  var time = new Date().getTime();
  var writeObject = {
    uuid: readerUuid,
    time: time,
    data: messageJson
  };
  var transaction = db.transaction([OBJECT_STORE_ID], 'readwrite');
  return new Promise(function (res, rej) {
    transaction.oncomplete = function () {
      return res();
    };

    transaction.onerror = function (ev) {
      return rej(ev);
    };

    var objectStore = transaction.objectStore(OBJECT_STORE_ID);
    objectStore.add(writeObject);
  });
}
function getAllMessages(db) {
  var objectStore = db.transaction(OBJECT_STORE_ID).objectStore(OBJECT_STORE_ID);
  var ret = [];
  return new Promise(function (res) {
    objectStore.openCursor().onsuccess = function (ev) {
      var cursor = ev.target.result;

      if (cursor) {
        ret.push(cursor.value); //alert("Name for SSN " + cursor.key + " is " + cursor.value.name);

        cursor["continue"]();
      } else {
        res(ret);
      }
    };
  });
}
function getMessagesHigherThen(db, lastCursorId) {
  var objectStore = db.transaction(OBJECT_STORE_ID).objectStore(OBJECT_STORE_ID);
  var ret = [];
  var keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
  return new Promise(function (res) {
    objectStore.openCursor(keyRangeValue).onsuccess = function (ev) {
      var cursor = ev.target.result;

      if (cursor) {
        ret.push(cursor.value); //alert("Name for SSN " + cursor.key + " is " + cursor.value.name);

        cursor["continue"]();
      } else {
        res(ret);
      }
    };
  });
}
function removeMessageById(db, id) {
  var request = db.transaction([OBJECT_STORE_ID], 'readwrite').objectStore(OBJECT_STORE_ID)["delete"](id);
  return new Promise(function (res) {
    request.onsuccess = function () {
      return res();
    };
  });
}
function getOldMessages(db, ttl) {
  var olderThen = new Date().getTime() - ttl;
  var objectStore = db.transaction(OBJECT_STORE_ID).objectStore(OBJECT_STORE_ID);
  var ret = [];
  return new Promise(function (res) {
    objectStore.openCursor().onsuccess = function (ev) {
      var cursor = ev.target.result;

      if (cursor) {
        var msgObk = cursor.value;

        if (msgObk.time < olderThen) {
          ret.push(msgObk); //alert("Name for SSN " + cursor.key + " is " + cursor.value.name);

          cursor["continue"]();
        } else {
          // no more old messages,
          res(ret);
          return;
        }
      } else {
        res(ret);
      }
    };
  });
}
function cleanOldMessages(db, ttl) {
  return getOldMessages(db, ttl).then(function (tooOld) {
    return Promise.all(tooOld.map(function (msgObj) {
      return removeMessageById(db, msgObj.id);
    }));
  });
}
function indexed_db_create(channelName, options) {
  options = fillOptionsWithDefaults(options);
  return createDatabase(channelName).then(function (db) {
    var state = {
      closed: false,
      lastCursorId: 0,
      channelName: channelName,
      options: options,
      uuid: randomToken(10),

      /**
       * emittedMessagesIds
       * contains all messages that have been emitted before
       * @type {ObliviousSet}
       */
      eMIs: new oblivious_set(options.idb.ttl * 2),
      // ensures we do not read messages in parrallel
      writeBlockPromise: Promise.resolve(),
      messagesCallback: null,
      readQueuePromises: [],
      db: db
    };
    /**
     * if service-workers are used,
     * we have no 'storage'-event if they post a message,
     * therefore we also have to set an interval
     */

    _readLoop(state);

    return state;
  });
}

function _readLoop(state) {
  if (state.closed) return;
  return readNewMessages(state).then(function () {
    return sleep(state.options.idb.fallbackInterval);
  }).then(function () {
    return _readLoop(state);
  });
}

function _filterMessage(msgObj, state) {
  if (msgObj.uuid === state.uuid) return false; // send by own

  if (state.eMIs.has(msgObj.id)) return false; // already emitted

  if (msgObj.data.time < state.messagesCallbackTime) return false; // older then onMessageCallback

  return true;
}
/**
 * reads all new messages from the database and emits them
 */


function readNewMessages(state) {
  // channel already closed
  if (state.closed) return Promise.resolve(); // if no one is listening, we do not need to scan for new messages

  if (!state.messagesCallback) return Promise.resolve();
  return getMessagesHigherThen(state.db, state.lastCursorId).then(function (newerMessages) {
    var useMessages = newerMessages.map(function (msgObj) {
      if (msgObj.id > state.lastCursorId) {
        state.lastCursorId = msgObj.id;
      }

      return msgObj;
    }).filter(function (msgObj) {
      return _filterMessage(msgObj, state);
    }).sort(function (msgObjA, msgObjB) {
      return msgObjA.time - msgObjB.time;
    }); // sort by time

    useMessages.forEach(function (msgObj) {
      if (state.messagesCallback) {
        state.eMIs.add(msgObj.id);
        state.messagesCallback(msgObj.data);
      }
    });
    return Promise.resolve();
  });
}

function indexed_db_close(channelState) {
  channelState.closed = true;
  channelState.db.close();
}
function indexed_db_postMessage(channelState, messageJson) {
  channelState.writeBlockPromise = channelState.writeBlockPromise.then(function () {
    return writeMessage(channelState.db, channelState.uuid, messageJson);
  }).then(function () {
    if (randomInt(0, 10) === 0) {
      /* await (do not await) */
      cleanOldMessages(channelState.db, channelState.options.idb.ttl);
    }
  });
  return channelState.writeBlockPromise;
}
function indexed_db_onMessage(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
  readNewMessages(channelState);
}
function indexed_db_canBeUsed() {
  if (browser_default.a) return false;
  var idb = getIdb();
  if (!idb) return false;
  return true;
}
function indexed_db_averageResponseTime(options) {
  return options.idb.fallbackInterval * 2;
}
/* harmony default export */ var indexed_db = ({
  create: indexed_db_create,
  close: indexed_db_close,
  onMessage: indexed_db_onMessage,
  postMessage: indexed_db_postMessage,
  canBeUsed: indexed_db_canBeUsed,
  type: indexed_db_type,
  averageResponseTime: indexed_db_averageResponseTime,
  microSeconds: indexed_db_microSeconds
});
// CONCATENATED MODULE: ./node_modules/broadcast-channel/dist/es/methods/localstorage.js
/**
 * A localStorage-only method which uses localstorage and its 'storage'-event
 * This does not work inside of webworkers because they have no access to locastorage
 * This is basically implemented to support IE9 or your grandmothers toaster.
 * @link https://caniuse.com/#feat=namevalue-storage
 * @link https://caniuse.com/#feat=indexeddb
 */




var localstorage_microSeconds = microSeconds;
var KEY_PREFIX = 'pubkey.broadcastChannel-';
var localstorage_type = 'localstorage';
/**
 * copied from crosstab
 * @link https://github.com/tejacques/crosstab/blob/master/src/crosstab.js#L32
 */

function getLocalStorage() {
  var localStorage;
  if (typeof window === 'undefined') return null;

  try {
    localStorage = window.localStorage;
    localStorage = window['ie8-eventlistener/storage'] || window.localStorage;
  } catch (e) {// New versions of Firefox throw a Security exception
    // if cookies are disabled. See
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1028153
  }

  return localStorage;
}
function storageKey(channelName) {
  return KEY_PREFIX + channelName;
}
/**
* writes the new message to the storage
* and fires the storage-event so other readers can find it
*/

function localstorage_postMessage(channelState, messageJson) {
  return new Promise(function (res) {
    sleep().then(function () {
      var key = storageKey(channelState.channelName);
      var writeObj = {
        token: randomToken(10),
        time: new Date().getTime(),
        data: messageJson,
        uuid: channelState.uuid
      };
      var value = JSON.stringify(writeObj);
      localStorage.setItem(key, value);
      /**
       * StorageEvent does not fire the 'storage' event
       * in the window that changes the state of the local storage.
       * So we fire it manually
       */

      var ev = document.createEvent('Event');
      ev.initEvent('storage', true, true);
      ev.key = key;
      ev.newValue = value;
      window.dispatchEvent(ev);
      res();
    });
  });
}
function addStorageEventListener(channelName, fn) {
  var key = storageKey(channelName);

  var listener = function listener(ev) {
    if (ev.key === key) {
      fn(JSON.parse(ev.newValue));
    }
  };

  window.addEventListener('storage', listener);
  return listener;
}
function removeStorageEventListener(listener) {
  window.removeEventListener('storage', listener);
}
function localstorage_create(channelName, options) {
  options = fillOptionsWithDefaults(options);

  if (!localstorage_canBeUsed()) {
    throw new Error('BroadcastChannel: localstorage cannot be used');
  }

  var uuid = randomToken(10);
  /**
   * eMIs
   * contains all messages that have been emitted before
   * @type {ObliviousSet}
   */

  var eMIs = new oblivious_set(options.localstorage.removeTimeout);
  var state = {
    channelName: channelName,
    uuid: uuid,
    eMIs: eMIs // emittedMessagesIds

  };
  state.listener = addStorageEventListener(channelName, function (msgObj) {
    if (!state.messagesCallback) return; // no listener

    if (msgObj.uuid === uuid) return; // own message

    if (!msgObj.token || eMIs.has(msgObj.token)) return; // already emitted

    if (msgObj.data.time && msgObj.data.time < state.messagesCallbackTime) return; // too old

    eMIs.add(msgObj.token);
    state.messagesCallback(msgObj.data);
  });
  return state;
}
function localstorage_close(channelState) {
  removeStorageEventListener(channelState.listener);
}
function localstorage_onMessage(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
}
function localstorage_canBeUsed() {
  if (browser_default.a) return false;
  var ls = getLocalStorage();
  if (!ls) return false;
  return true;
}
function localstorage_averageResponseTime() {
  return 120;
}
/* harmony default export */ var localstorage = ({
  create: localstorage_create,
  close: localstorage_close,
  onMessage: localstorage_onMessage,
  postMessage: localstorage_postMessage,
  canBeUsed: localstorage_canBeUsed,
  type: localstorage_type,
  averageResponseTime: localstorage_averageResponseTime,
  microSeconds: localstorage_microSeconds
});
// CONCATENATED MODULE: ./node_modules/broadcast-channel/dist/es/method-chooser.js
var require;


 // order is important

var METHODS = [methods_native, // fastest
indexed_db, localstorage];
var REQUIRE_FUN = require;
/**
 * The NodeMethod is loaded lazy
 * so it will not get bundled in browser-builds
 */

if (browser_default.a) {
  /**
   * we use the non-transpiled code for nodejs
   * because it runs faster
   */
  var NodeMethod = __webpack_require__(12);
  /**
   * this will be false for webpackbuilds
   * which will shim the node-method with an empty object {}
   */

  if (typeof NodeMethod.canBeUsed === 'function') {
    METHODS.push(NodeMethod);
  }
}

function chooseMethod(options) {
  // directly chosen
  if (options.type) {
    var ret = METHODS.find(function (m) {
      return m.type === options.type;
    });
    if (!ret) throw new Error('method-type ' + options.type + ' not found');else return ret;
  }

  var chooseMethods = METHODS;

  if (!options.webWorkerSupport && !browser_default.a) {
    // prefer localstorage over idb when no webworker-support needed
    chooseMethods = METHODS.filter(function (m) {
      return m.type !== 'idb';
    });
  }

  var useMethod = chooseMethods.find(function (method) {
    return method.canBeUsed();
  });
  if (!useMethod) throw new Error('No useable methode found:' + JSON.stringify(METHODS.map(function (m) {
    return m.type;
  })));else return useMethod;
}
// CONCATENATED MODULE: ./node_modules/broadcast-channel/dist/es/index.js




var es_BroadcastChannel = function BroadcastChannel(name, options) {
  this.name = name;
  this.options = fillOptionsWithDefaults(options);
  this.method = chooseMethod(this.options); // isListening

  this._iL = false;
  /**
   * _onMessageListener
   * setting onmessage twice,
   * will overwrite the first listener
   */

  this._onML = null;
  /**
   * _addEventListeners
   */

  this._addEL = {
    message: [],
    internal: []
  };
  /**
   * _beforeClose
   * array of promises that will be awaited
   * before the channel is closed
   */

  this._befC = [];
  /**
   * _preparePromise
   */

  this._prepP = null;

  _prepareChannel(this);
}; // STATICS

/**
 * used to identify if someone overwrites
 * window.BroadcastChannel with this
 * See methods/native.js
 */


es_BroadcastChannel._pubkey = true;
/**
 * clears the tmp-folder if is node
 * @return {Promise<boolean>} true if has run, false if not node
 */

es_BroadcastChannel.clearNodeFolder = function (options) {
  options = fillOptionsWithDefaults(options);
  var method = chooseMethod(options);

  if (method.type === 'node') {
    return method.clearNodeFolder().then(function () {
      return true;
    });
  } else {
    return Promise.resolve(false);
  }
}; // PROTOTYPE


es_BroadcastChannel.prototype = {
  postMessage: function postMessage(msg) {
    if (this.closed) {
      throw new Error('BroadcastChannel.postMessage(): ' + 'Cannot post message after channel has closed');
    }

    return _post(this, 'message', msg);
  },
  postInternal: function postInternal(msg) {
    return _post(this, 'internal', msg);
  },

  set onmessage(fn) {
    var time = this.method.microSeconds();
    var listenObj = {
      time: time,
      fn: fn
    };

    _removeListenerObject(this, 'message', this._onML);

    if (fn && typeof fn === 'function') {
      this._onML = listenObj;

      _addListenerObject(this, 'message', listenObj);
    } else {
      this._onML = null;
    }
  },

  addEventListener: function addEventListener(type, fn) {
    var time = this.method.microSeconds();
    var listenObj = {
      time: time,
      fn: fn
    };

    _addListenerObject(this, type, listenObj);
  },
  removeEventListener: function removeEventListener(type, fn) {
    var obj = this._addEL[type].find(function (obj) {
      return obj.fn === fn;
    });

    _removeListenerObject(this, type, obj);
  },
  close: function close() {
    var _this = this;

    if (this.closed) return;
    this.closed = true;
    var awaitPrepare = this._prepP ? this._prepP : Promise.resolve();
    this._onML = null;
    this._addEL.message = [];
    return awaitPrepare.then(function () {
      return Promise.all(_this._befC.map(function (fn) {
        return fn();
      }));
    }).then(function () {
      return _this.method.close(_this._state);
    });
  },

  get type() {
    return this.method.type;
  }

};

function _post(broadcastChannel, type, msg) {
  var time = broadcastChannel.method.microSeconds();
  var msgObj = {
    time: time,
    type: type,
    data: msg
  };
  var awaitPrepare = broadcastChannel._prepP ? broadcastChannel._prepP : Promise.resolve();
  return awaitPrepare.then(function () {
    return broadcastChannel.method.postMessage(broadcastChannel._state, msgObj);
  });
}

function _prepareChannel(channel) {
  var maybePromise = channel.method.create(channel.name, channel.options);

  if (isPromise(maybePromise)) {
    channel._prepP = maybePromise;
    maybePromise.then(function (s) {
      // used in tests to simulate slow runtime

      /*if (channel.options.prepareDelay) {
           await new Promise(res => setTimeout(res, this.options.prepareDelay));
      }*/
      channel._state = s;
    });
  } else {
    channel._state = maybePromise;
  }
}

function _hasMessageListeners(channel) {
  if (channel._addEL.message.length > 0) return true;
  if (channel._addEL.internal.length > 0) return true;
  return false;
}

function _addListenerObject(channel, type, obj) {
  channel._addEL[type].push(obj);

  _startListening(channel);
}

function _removeListenerObject(channel, type, obj) {
  channel._addEL[type] = channel._addEL[type].filter(function (o) {
    return o !== obj;
  });

  _stopListening(channel);
}

function _startListening(channel) {
  if (!channel._iL && _hasMessageListeners(channel)) {
    // someone is listening, start subscribing
    var listenerFn = function listenerFn(msgObj) {
      channel._addEL[msgObj.type].forEach(function (obj) {
        if (msgObj.time >= obj.time) {
          obj.fn(msgObj.data);
        }
      });
    };

    var time = channel.method.microSeconds();

    if (channel._prepP) {
      channel._prepP.then(function () {
        channel._iL = true;
        channel.method.onMessage(channel._state, listenerFn, time);
      });
    } else {
      channel._iL = true;
      channel.method.onMessage(channel._state, listenerFn, time);
    }
  }
}

function _stopListening(channel) {
  if (channel._iL && !_hasMessageListeners(channel)) {
    // noone is listening, stop subscribing
    channel._iL = false;
    var time = channel.method.microSeconds();
    channel.method.onMessage(channel._state, null, time);
  }
}

/* harmony default export */ var es = (es_BroadcastChannel);
// EXTERNAL MODULE: ./node_modules/uuid/v4.js
var v4 = __webpack_require__(7);
var v4_default = /*#__PURE__*/__webpack_require__.n(v4);

// CONCATENATED MODULE: ./src/logger.js


var logger_Logger = /*#__PURE__*/function () {
  function Logger() {
    classCallCheck_default()(this, Logger);
    this.setVerbosity('WARNING');
  }
  return createClass_default()(Logger, [{
    key: "debug",
    value: function debug() {
      if (this.checkVerbosity(4)) {
        var _console;
        (_console = console).log.apply(_console, arguments);
      }
    }
  }, {
    key: "log",
    value: function log() {
      if (this.checkVerbosity(4)) {
        var _console2;
        (_console2 = console).log.apply(_console2, arguments);
      }
    }
  }, {
    key: "info",
    value: function info() {
      if (this.checkVerbosity(3)) {
        var _console3;
        (_console3 = console).info.apply(_console3, arguments);
      }
    }
  }, {
    key: "warn",
    value: function warn() {
      if (this.checkVerbosity(2)) {
        var _console4;
        (_console4 = console).warn.apply(_console4, arguments);
      }
    }
  }, {
    key: "error",
    value: function error() {
      if (this.checkVerbosity(1)) {
        var _console5;
        (_console5 = console).error.apply(_console5, arguments);
      }
    }
  }, {
    key: "setVerbosity",
    value: function setVerbosity(level) {
      var default_level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
      if (level === undefined) {
        level = default_level;
      }
      if (typeof level === 'string') {
        level = {
          ERROR: 1,
          WARNING: 2,
          INFO: 3,
          LOG: 4,
          DEBUG: 4
        }[level.toUpperCase()] || 2;
      }
      this.level = level;
    }
  }, {
    key: "checkVerbosity",
    value: function checkVerbosity(level) {
      return this.level >= level;
    }
  }]);
}();
var log = new logger_Logger();
/* harmony default export */ var logger = (log);
// CONCATENATED MODULE: ./src/index.js





function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(typeof_default()(e) + " is not iterable"); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }

//import localforage from 'localforage';



var src_sleep = function sleep(ms) {
  return new Promise(function (res) {
    return setTimeout(res, ms);
  });
};

/**
 * TDLib in a browser
 *
 * TDLib can be compiled to WebAssembly using Emscripten compiler and used in a browser from JavaScript.
 * This is a convenient wrapper for TDLib in a browser which controls TDLib instance creation, handles interaction
 * with TDLib and manages a filesystem for persistent TDLib data.
 * TDLib instance is created in a Web Worker to run it in a separate thread.
 * TdClient just sends queries to the Web Worker and receives updates and results from it.
 * <br>
 * <br>
 * Differences from the TDLib JSON API:<br>
 * 1. Added the update <code>updateFatalError error:string = Update;</code> which is sent whenever TDLib encounters a fatal error.<br>
 * 2. Added the method <code>setJsLogVerbosityLevel new_verbosity_level:string = Ok;</code>, which allows to change the verbosity level of tdweb logging.<br>
 * 3. Added the possibility to use blobs as input files via the constructor <code>inputFileBlob data:<JavaScript blob> = InputFile;</code>.<br>
 * 4. The class <code>filePart</code> contains data as a JavaScript blob instead of a base64-encoded string.<br>
 * 5. The methods <code>getStorageStatistics</code>, <code>getStorageStatisticsFast</code>, <code>optimizeStorage</code>, and <code>addProxy</code> are not supported.<br>
 * <br>
 */
var src_TdClient = /*#__PURE__*/function () {
  /**
   * @callback TdClient~updateCallback
   * @param {Object} update The update.
   */

  /**
   * Create TdClient.
   * @param {Object} options - Options for TDLib instance creation.
   * @param {TdClient~updateCallback} options.onUpdate - Callback for all incoming updates.
   * @param {string} [options.instanceName=tdlib] - Name of the TDLib instance. Currently, only one instance of TdClient with a given name is allowed. All but one instances with the same name will be automatically closed. Usually, the newest non-background instance is kept alive. Files will be stored in an IndexedDb table with the same name.
   * @param {boolean} [options.isBackground=false] - Pass true if the instance is opened from the background.
   * @param {string} [options.jsLogVerbosityLevel=info] - The initial verbosity level of the JavaScript part of the code (one of 'error', 'warning', 'info', 'log', 'debug').
   * @param {number} [options.logVerbosityLevel=2] - The initial verbosity level for the TDLib internal logging (0-1023).
   * @param {boolean} [options.useDatabase=true] - Pass false to use TDLib without database and secret chats. It significantly improves loading time, but some functionality is unavailable without the database.
   * @param {boolean} [options.readOnly=false] - For debug only. Pass true to open TDLib database in read-only mode
   */
  function TdClient(options) {
    var _this = this;
    classCallCheck_default()(this, TdClient);
    logger.setVerbosity(options.jsLogVerbosityLevel);
    this.worker = new worker_default.a();
    this.worker.onmessage = function (e) {
      _this.onResponse(e.data);
    };
    this.query_id = 0;
    this.query_callbacks = new Map();
    if ('onUpdate' in options) {
      this.onUpdate = options.onUpdate;
      delete options.onUpdate;
    }
    options.instanceName = options.instanceName || 'tdlib';
    this.fileManager = new src_FileManager(options.instanceName, this);
    this.worker.postMessage({
      '@type': 'init',
      options: options
    });
    this.closeOtherClients(options);
  }

  /**
   * Send a query to TDLib.
   *
   * If the query contains the field '@extra', the same field will be added into the result.
   *
   * @param {Object} query - The query for TDLib. See the [td_api.tl]{@link https://github.com/tdlib/td/blob/master/td/generate/scheme/td_api.tl} scheme or
   *                         the automatically generated [HTML documentation]{@link https://core.telegram.org/tdlib/docs/td__api_8h.html}
   *                         for a list of all available TDLib [methods]{@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1_function.html} and
   *                         [classes]{@link https://core.telegram.org/tdlib/docs/classtd_1_1td__api_1_1_object.html}.
   * @returns {Promise} Promise object represents the result of the query.
   */
  return createClass_default()(TdClient, [{
    key: "send",
    value: function send(query) {
      return this.doSend(query, true);
    }

    /** @private */
  }, {
    key: "sendInternal",
    value: function sendInternal(query) {
      return this.doSend(query, false);
    }
    /** @private */
  }, {
    key: "doSend",
    value: function doSend(query, isExternal) {
      var _this2 = this;
      this.query_id++;
      if (query['@extra']) {
        query['@extra'] = {
          '@old_extra': JSON.parse(JSON.stringify(query['@extra'])),
          query_id: this.query_id
        };
      } else {
        query['@extra'] = {
          query_id: this.query_id
        };
      }
      if (query['@type'] === 'setJsLogVerbosityLevel') {
        logger.setVerbosity(query.new_verbosity_level);
      }
      logger.debug('send to worker: ', query);
      var res = new Promise(function (resolve, reject) {
        _this2.query_callbacks.set(_this2.query_id, [resolve, reject]);
      });
      if (isExternal) {
        this.externalPostMessage(query);
      } else {
        this.worker.postMessage(query);
      }
      return res;
    }

    /** @private */
  }, {
    key: "externalPostMessage",
    value: function externalPostMessage(query) {
      var unsupportedMethods = ['getStorageStatistics', 'getStorageStatisticsFast', 'optimizeStorage', 'addProxy', 'init', 'start'];
      if (unsupportedMethods.includes(query['@type'])) {
        this.onResponse({
          '@type': 'error',
          '@extra': query['@extra'],
          code: 400,
          message: "Method '" + query['@type'] + "' is not supported"
        });
        return;
      }
      if (query['@type'] === 'readFile' || query['@type'] === 'readFilePart') {
        this.readFile(query);
        return;
      }
      if (query['@type'] === 'deleteFile') {
        this.deleteFile(query);
        return;
      }
      this.worker.postMessage(query);
    }

    /** @private */
  }, {
    key: "readFile",
    value: (function () {
      var _readFile = asyncToGenerator_default()(/*#__PURE__*/_regenerator().m(function _callee(query) {
        var response;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.fileManager.readFile(query);
            case 1:
              response = _context.v;
              this.onResponse(response);
            case 2:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function readFile(_x) {
        return _readFile.apply(this, arguments);
      }
      return readFile;
    }() /** @private */)
  }, {
    key: "deleteFile",
    value: (function () {
      var _deleteFile = asyncToGenerator_default()(/*#__PURE__*/_regenerator().m(function _callee2(query) {
        var response, _t;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              response = this.fileManager.deleteFile(query);
              _context2.p = 1;
              if (!response.idb_key) {
                _context2.n = 3;
                break;
              }
              _context2.n = 2;
              return this.sendInternal({
                '@type': 'deleteIdbKey',
                idb_key: response.idb_key
              });
            case 2:
              delete response.idb_key;
            case 3:
              _context2.n = 4;
              return this.sendInternal({
                '@type': 'deleteFile',
                file_id: query.file_id
              });
            case 4:
              _context2.n = 6;
              break;
            case 5:
              _context2.p = 5;
              _t = _context2.v;
            case 6:
              this.onResponse(response);
            case 7:
              return _context2.a(2);
          }
        }, _callee2, this, [[1, 5]]);
      }));
      function deleteFile(_x2) {
        return _deleteFile.apply(this, arguments);
      }
      return deleteFile;
    }() /** @private */)
  }, {
    key: "onResponse",
    value: function onResponse(response) {
      logger.debug('receive from worker: ', JSON.parse(JSON.stringify(response, function (key, value) {
        if (key === 'arr' || key === 'data') {
          return undefined;
        }
        return value;
      })));

      // for FileManager
      response = this.prepareResponse(response);
      if ('@extra' in response) {
        var query_id = response['@extra'].query_id;
        var _this$query_callbacks = this.query_callbacks.get(query_id),
          _this$query_callbacks2 = slicedToArray_default()(_this$query_callbacks, 2),
          resolve = _this$query_callbacks2[0],
          reject = _this$query_callbacks2[1];
        this.query_callbacks["delete"](query_id);
        if ('@old_extra' in response['@extra']) {
          response['@extra'] = response['@extra']['@old_extra'];
        }
        if (resolve) {
          if (response['@type'] === 'error') {
            reject(response);
          } else {
            resolve(response);
          }
        }
      } else {
        if (response['@type'] === 'inited') {
          this.onInited();
          return;
        }
        if (response['@type'] === 'fsInited') {
          this.onFsInited();
          return;
        }
        if (response['@type'] === 'updateAuthorizationState' && response.authorization_state['@type'] === 'authorizationStateClosed') {
          this.onClosed();
        }
        this.onUpdate(response);
      }
    }

    /** @private */
  }, {
    key: "prepareFile",
    value: function prepareFile(file) {
      return this.fileManager.registerFile(file);
    }

    /** @private */
  }, {
    key: "prepareResponse",
    value: function prepareResponse(response) {
      var _this3 = this;
      if (response['@type'] === 'file') {
        if (false) {}
        return this.prepareFile(response);
      }
      for (var key in response) {
        var field = response[key];
        if (field && typeof_default()(field) === 'object' && key !== 'data' && key !== 'arr') {
          response[key] = this.prepareResponse(field);
        }
      }
      return response;
    }

    /** @private */
  }, {
    key: "onBroadcastMessage",
    value: function onBroadcastMessage(e) {
      //const message = e.data;
      var message = e;
      if (message.uid === this.uid) {
        logger.info('ignore self broadcast message: ', message);
        return;
      }
      logger.info('receive broadcast message: ', message);
      if (message.isBackground && !this.isBackground) {
        // continue
      } else if (!message.isBackground && this.isBackground || message.timestamp > this.timestamp) {
        this.close();
        return;
      }
      if (message.state === 'closed') {
        this.waitSet["delete"](message.uid);
        if (this.waitSet.size === 0) {
          logger.info('onWaitSetEmpty');
          this.onWaitSetEmpty();
          this.onWaitSetEmpty = function () {};
        }
      } else {
        this.waitSet.add(message.uid);
        if (message.state !== 'closing') {
          this.postState();
        }
      }
    }

    /** @private */
  }, {
    key: "postState",
    value: function postState() {
      var state = {
        uid: this.uid,
        state: this.state,
        timestamp: this.timestamp,
        isBackground: this.isBackground
      };
      logger.info('Post state: ', state);
      this.channel.postMessage(state);
    }

    /** @private */
  }, {
    key: "onWaitSetEmpty",
    value: function onWaitSetEmpty() {
      // nop
    }

    /** @private */
  }, {
    key: "onFsInited",
    value: function onFsInited() {
      this.fileManager.init();
    }

    /** @private */
  }, {
    key: "onInited",
    value: function onInited() {
      this.isInited = true;
      this.doSendStart();
    }

    /** @private */
  }, {
    key: "sendStart",
    value: function sendStart() {
      this.wantSendStart = true;
      this.doSendStart();
    }

    /** @private */
  }, {
    key: "doSendStart",
    value: function doSendStart() {
      if (!this.isInited || !this.wantSendStart || this.state !== 'start') {
        return;
      }
      this.wantSendStart = false;
      this.state = 'active';
      var query = {
        '@type': 'start'
      };
      logger.info('send to worker: ', query);
      this.worker.postMessage(query);
    }

    /** @private */
  }, {
    key: "onClosed",
    value: function onClosed() {
      this.isClosing = true;
      this.worker.terminate();
      logger.info('worker is terminated');
      this.state = 'closed';
      this.postState();
    }

    /** @private */
  }, {
    key: "close",
    value: function close() {
      if (this.isClosing) {
        return;
      }
      this.isClosing = true;
      logger.info('close state: ', this.state);
      if (this.state === 'start') {
        this.onClosed();
        this.onUpdate({
          '@type': 'updateAuthorizationState',
          authorization_state: {
            '@type': 'authorizationStateClosed'
          }
        });
        return;
      }
      var query = {
        '@type': 'close'
      };
      logger.info('send to worker: ', query);
      this.worker.postMessage(query);
      this.state = 'closing';
      this.postState();
    }

    /** @private */
  }, {
    key: "closeOtherClients",
    value: (function () {
      var _closeOtherClients = asyncToGenerator_default()(/*#__PURE__*/_regenerator().m(function _callee4(options) {
        var _this4 = this;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              this.uid = v4_default()();
              this.state = 'start';
              this.isBackground = !!options.isBackground;
              this.timestamp = Date.now();
              this.waitSet = new Set();
              logger.info('close other clients');
              this.channel = new es(options.instanceName, {
                webWorkerSupport: false
              });
              this.postState();
              this.channel.onmessage = function (message) {
                _this4.onBroadcastMessage(message);
              };
              _context4.n = 1;
              return src_sleep(300);
            case 1:
              if (!(this.waitSet.size !== 0)) {
                _context4.n = 2;
                break;
              }
              _context4.n = 2;
              return new Promise(function (resolve) {
                _this4.onWaitSetEmpty = resolve;
              });
            case 2:
              this.sendStart();
            case 3:
              return _context4.a(2);
          }
        }, _callee4, this);
      }));
      function closeOtherClients(_x3) {
        return _closeOtherClients.apply(this, arguments);
      }
      return closeOtherClients;
    }() /** @private */)
  }, {
    key: "onUpdate",
    value: function onUpdate(update) {
      logger.info('ignore onUpdate');
      //nop
    }
  }]);
}();
/** @private */
var src_ListNode = /*#__PURE__*/function () {
  function ListNode(value) {
    classCallCheck_default()(this, ListNode);
    this.value = value;
    this.clear();
  }
  return createClass_default()(ListNode, [{
    key: "erase",
    value: function erase() {
      this.prev.connect(this.next);
      this.clear();
    }
  }, {
    key: "clear",
    value: function clear() {
      this.prev = this;
      this.next = this;
    }
  }, {
    key: "connect",
    value: function connect(other) {
      this.next = other;
      other.prev = this;
    }
  }, {
    key: "onUsed",
    value: function onUsed(other) {
      other.usedAt = Date.now();
      other.erase();
      other.connect(this.next);
      logger.debug('LRU: used file_id: ', other.value);
      this.connect(other);
    }
  }, {
    key: "getLru",
    value: function getLru() {
      if (this === this.next) {
        throw new Error('popLru from empty list');
      }
      return this.prev;
    }
  }]);
}();
/** @private */
var src_FileManager = /*#__PURE__*/function () {
  function FileManager(instanceName, client) {
    classCallCheck_default()(this, FileManager);
    this.instanceName = instanceName;
    this.cache = new Map();
    this.pending = [];
    this.transaction_id = 0;
    this.totalSize = 0;
    this.lru = new src_ListNode(-1);
    this.client = client;
  }
  return createClass_default()(FileManager, [{
    key: "init",
    value: function init() {
      var _this5 = this;
      this.idb = new Promise(function (resolve, reject) {
        var request = indexedDB.open(_this5.instanceName);
        request.onsuccess = function () {
          return resolve(request.result);
        };
        request.onerror = function () {
          return reject(request.error);
        };
      });
      //this.store = localforage.createInstance({
      //name: instanceName
      //});
      this.isInited = true;
    }
  }, {
    key: "unload",
    value: function unload(info) {
      if (info.arr) {
        logger.debug('LRU: delete file_id: ', info.node.value, ' with arr.length: ', info.arr.length);
        this.totalSize -= info.arr.length;
        delete info.arr;
      }
      if (info.node) {
        info.node.erase();
        delete info.node;
      }
    }
  }, {
    key: "registerFile",
    value: function registerFile(file) {
      if (file.idb_key || file.arr) {
        file.local.is_downloading_completed = true;
      } else {
        file.local.is_downloading_completed = false;
      }
      var info = {};
      var cached_info = this.cache.get(file.id);
      if (cached_info) {
        info = cached_info;
      } else {
        this.cache.set(file.id, info);
      }
      if (file.idb_key) {
        info.idb_key = file.idb_key;
        delete file.idb_key;
      } else {
        delete info.idb_key;
      }
      if (file.arr) {
        var now = Date.now();
        while (this.totalSize > 100000000) {
          var node = this.lru.getLru();
          // immunity for 60 seconds
          if (node.usedAt + 60 * 1000 > now) {
            break;
          }
          var lru_info = this.cache.get(node.value);
          this.unload(lru_info);
        }
        if (info.arr) {
          logger.warn('Receive file.arr at least twice for the same file');
          this.totalSize -= info.arr.length;
        }
        info.arr = file.arr;
        delete file.arr;
        this.totalSize += info.arr.length;
        if (!info.node) {
          logger.debug('LRU: create file_id: ', file.id, ' with arr.length: ', info.arr.length);
          info.node = new src_ListNode(file.id);
        }
        this.lru.onUsed(info.node);
        logger.info('Total file.arr size: ', this.totalSize);
      }
      info.file = file;
      return file;
    }
  }, {
    key: "flushLoad",
    value: function () {
      var _flushLoad = asyncToGenerator_default()(/*#__PURE__*/_regenerator().m(function _callee5() {
        var pending, idb, transaction_id, read, _iterator, _step, _loop, _t3;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              pending = this.pending;
              this.pending = [];
              _context6.n = 1;
              return this.idb;
            case 1:
              idb = _context6.v;
              transaction_id = this.transaction_id++;
              read = idb.transaction(['keyvaluepairs'], 'readonly').objectStore('keyvaluepairs');
              logger.debug('Load group of files from idb', pending.length);
              _iterator = _createForOfIteratorHelper(pending);
              _context6.p = 2;
              _loop = /*#__PURE__*/_regenerator().m(function _loop() {
                var query, request;
                return _regenerator().w(function (_context5) {
                  while (1) switch (_context5.n) {
                    case 0:
                      query = _step.value;
                      request = read.get(query.key);
                      request.onsuccess = function (event) {
                        var blob = event.target.result;
                        if (blob) {
                          if (blob.size === 0) {
                            logger.error('Receive empty blob from db ', query.key);
                          }
                          query.resolve({
                            data: blob,
                            transaction_id: transaction_id
                          });
                        } else {
                          query.reject();
                        }
                      };
                      request.onerror = function () {
                        return query.reject(request.error);
                      };
                    case 1:
                      return _context5.a(2);
                  }
                }, _loop);
              });
              _iterator.s();
            case 3:
              if ((_step = _iterator.n()).done) {
                _context6.n = 5;
                break;
              }
              return _context6.d(_regeneratorValues(_loop()), 4);
            case 4:
              _context6.n = 3;
              break;
            case 5:
              _context6.n = 7;
              break;
            case 6:
              _context6.p = 6;
              _t3 = _context6.v;
              _iterator.e(_t3);
            case 7:
              _context6.p = 7;
              _iterator.f();
              return _context6.f(7);
            case 8:
              return _context6.a(2);
          }
        }, _callee5, this, [[2, 6, 7, 8]]);
      }));
      function flushLoad() {
        return _flushLoad.apply(this, arguments);
      }
      return flushLoad;
    }()
  }, {
    key: "load",
    value: function load(key, resolve, reject) {
      var _this6 = this;
      if (this.pending.length === 0) {
        setTimeout(function () {
          _this6.flushLoad();
        }, 1);
      }
      this.pending.push({
        key: key,
        resolve: resolve,
        reject: reject
      });
    }
  }, {
    key: "doLoadFull",
    value: function () {
      var _doLoadFull = asyncToGenerator_default()(/*#__PURE__*/_regenerator().m(function _callee6(info) {
        var _this7 = this;
        var idb_key;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              if (!info.arr) {
                _context7.n = 1;
                break;
              }
              return _context7.a(2, {
                data: new Blob([info.arr]),
                transaction_id: -1
              });
            case 1:
              if (!info.idb_key) {
                _context7.n = 3;
                break;
              }
              idb_key = info.idb_key; //return this.store.getItem(idb_key);
              _context7.n = 2;
              return new Promise(function (resolve, reject) {
                _this7.load(idb_key, resolve, reject);
              });
            case 2:
              return _context7.a(2, _context7.v);
            case 3:
              throw new Error('File is not loaded');
            case 4:
              return _context7.a(2);
          }
        }, _callee6);
      }));
      function doLoadFull(_x4) {
        return _doLoadFull.apply(this, arguments);
      }
      return doLoadFull;
    }()
  }, {
    key: "doLoad",
    value: function () {
      var _doLoad = asyncToGenerator_default()(/*#__PURE__*/_regenerator().m(function _callee7(info, offset, size) {
        var count, _res, res, data_size, _t4;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              if (!(!info.arr && !info.idb_key && info.file.local.path)) {
                _context8.n = 7;
                break;
              }
              _context8.p = 1;
              _context8.n = 2;
              return this.client.sendInternal({
                '@type': 'getFileDownloadedPrefixSize',
                file_id: info.file.id,
                offset: offset
              });
            case 2:
              count = _context8.v;
              if (size) {
                _context8.n = 3;
                break;
              }
              size = count.count;
              _context8.n = 4;
              break;
            case 3:
              if (!(size > count.count)) {
                _context8.n = 4;
                break;
              }
              throw new Error('File not loaded yet');
            case 4:
              _context8.n = 5;
              return this.client.sendInternal({
                '@type': 'readFilePart',
                path: info.file.local.path,
                offset: offset,
                count: size
              });
            case 5:
              _res = _context8.v;
              _res.data = new Blob([_res.data]);
              _res.transaction_id = -2;
              //log.error(res);
              return _context8.a(2, _res);
            case 6:
              _context8.p = 6;
              _t4 = _context8.v;
              logger.info('readFilePart failed', info, offset, size, _t4);
            case 7:
              _context8.n = 8;
              return this.doLoadFull(info);
            case 8:
              res = _context8.v;
              // return slice(size, offset + size)
              data_size = res.data.size;
              if (!size) {
                size = data_size;
              }
              if (offset > data_size) {
                offset = data_size;
              }
              res.data = res.data.slice(offset, offset + size);
              return _context8.a(2, res);
          }
        }, _callee7, this, [[1, 6]]);
      }));
      function doLoad(_x5, _x6, _x7) {
        return _doLoad.apply(this, arguments);
      }
      return doLoad;
    }()
  }, {
    key: "doDelete",
    value: function doDelete(info) {
      this.unload(info);
      return info.idb_key;
    }
  }, {
    key: "readFile",
    value: function () {
      var _readFile2 = asyncToGenerator_default()(/*#__PURE__*/_regenerator().m(function _callee8(query) {
        var info, response, _t5;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.p = _context9.n) {
            case 0:
              _context9.p = 0;
              if (this.isInited) {
                _context9.n = 1;
                break;
              }
              throw new Error('FileManager is not inited');
            case 1:
              info = this.cache.get(query.file_id);
              if (info) {
                _context9.n = 2;
                break;
              }
              throw new Error('File is not loaded');
            case 2:
              if (info.node) {
                this.lru.onUsed(info.node);
              }
              query.offset = query.offset || 0;
              query.size = query.count || query.size || 0;
              _context9.n = 3;
              return this.doLoad(info, query.offset, query.size);
            case 3:
              response = _context9.v;
              return _context9.a(2, {
                '@type': 'filePart',
                '@extra': query['@extra'],
                data: response.data,
                transaction_id: response.transaction_id
              });
            case 4:
              _context9.p = 4;
              _t5 = _context9.v;
              return _context9.a(2, {
                '@type': 'error',
                '@extra': query['@extra'],
                code: 400,
                message: _t5
              });
          }
        }, _callee8, this, [[0, 4]]);
      }));
      function readFile(_x8) {
        return _readFile2.apply(this, arguments);
      }
      return readFile;
    }()
  }, {
    key: "deleteFile",
    value: function deleteFile(query) {
      var res = {
        '@type': 'ok',
        '@extra': query['@extra']
      };
      try {
        if (!this.isInited) {
          throw new Error('FileManager is not inited');
        }
        var info = this.cache.get(query.file_id);
        if (!info) {
          throw new Error('File is not loaded');
        }
        var idb_key = this.doDelete(info);
        if (idb_key) {
          res.idb_key = idb_key;
        }
      } catch (e) {}
      return res;
    }
  }]);
}();
/* harmony default export */ var src = __webpack_exports__["default"] = (src_TdClient);

/***/ })
/******/ ]);
});