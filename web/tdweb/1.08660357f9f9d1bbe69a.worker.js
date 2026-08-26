this["webpackChunktdweb"]([1],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(module, exports) {



/***/ }),
/* 9 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(11)
var ieee754 = __webpack_require__(12)
var isArray = __webpack_require__(13)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),
/* 12 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 13 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if (!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(16);

var iterableToArrayLimit = __webpack_require__(17);

var nonIterableRest = __webpack_require__(18);

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;

/***/ }),
/* 16 */
/***/ (function(module, exports) {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;

/***/ }),
/* 17 */
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
/* 18 */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

module.exports = _nonIterableRest;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithoutHoles = __webpack_require__(21);

var iterableToArray = __webpack_require__(22);

var nonIterableSpread = __webpack_require__(23);

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;

/***/ }),
/* 21 */
/***/ (function(module, exports) {

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

module.exports = _arrayWithoutHoles;

/***/ }),
/* 22 */
/***/ (function(module, exports) {

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

module.exports = _iterableToArray;

/***/ }),
/* 23 */
/***/ (function(module, exports) {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

module.exports = _nonIterableSpread;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(4);

var assertThisInitialized = __webpack_require__(25);

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;

/***/ }),
/* 25 */
/***/ (function(module, exports) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;

/***/ }),
/* 26 */
/***/ (function(module, exports) {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(28);

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;

/***/ }),
/* 28 */
/***/ (function(module, exports) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;

/***/ }),
/* 29 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__filename, __dirname, process, Buffer, module) {/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(19);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(20);
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(24);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(26);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(27);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(0);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_9__);










function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default()(o), _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4___default()(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default()(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
var createTdwebModule = function (_globalThis$document) {
  var _scriptName = (_globalThis$document = globalThis.document) === null || _globalThis$document === void 0 || (_globalThis$document = _globalThis$document.currentScript) === null || _globalThis$document === void 0 ? void 0 : _globalThis$document.src;
  return /*#__PURE__*/_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_9___default()(/*#__PURE__*/_regenerator().m(function _callee10() {
    var _globalThis$process, _globalThis$process2;
    var moduleArg,
      Module,
      ENVIRONMENT_IS_WEB,
      ENVIRONMENT_IS_WORKER,
      ENVIRONMENT_IS_NODE,
      programArgs,
      thisProgram,
      quit_,
      scriptDirectory,
      locateFile,
      readAsync,
      readBinary,
      fs,
      out,
      err,
      wasmBinary,
      ABORT,
      EXITSTATUS,
      assert,
      isFileURI,
      EmscriptenEH,
      EmscriptenSjLj,
      runtimeInitialized,
      getMemoryBuffer,
      updateMemoryViews,
      preRun,
      initRuntime,
      postRun,
      abort,
      wasmBinaryFile,
      findWasmBinary,
      getBinarySync,
      getWasmBinary,
      _getWasmBinary,
      instantiateArrayBuffer,
      _instantiateArrayBuffer,
      instantiateAsync,
      _instantiateAsync,
      getWasmImports,
      createWasm,
      _createWasm,
      ExitStatus,
      HEAP8,
      callRuntimeCallbacks,
      onPostRuns,
      onPreRuns,
      noExitRuntime,
      stackRestore,
      stackSave,
      PATH,
      initRandomFill,
      _randomFill,
      PATH_FS,
      UTF8Decoder,
      findStringEnd,
      UTF8ArrayToString,
      FS_stdin_getChar_buffer,
      lengthBytesUTF8,
      stringToUTF8Array,
      intArrayFromString,
      FS_stdin_getChar,
      TTY,
      HEAPU8,
      zeroMemory,
      alignMemory,
      mmapAlloc,
      MEMFS,
      FS_modeStringToFlags,
      FS_fileDataToTypedArray,
      FS_getMode,
      IDBFS,
      WORKERFS,
      asyncLoad,
      FS_createDataFile,
      getUniqueRunDependency,
      dependenciesPromise,
      resolveRunDependencies,
      runDependencies,
      dependenciesPromiseResolve,
      removeRunDependency,
      addRunDependency,
      preloadPlugins,
      FS_handledByPreloadPlugin,
      FS_preloadFile,
      FS_createPreloadedFile,
      FS,
      UTF8ToString,
      HEAP32,
      HEAPU32,
      HEAP64,
      SYSCALLS,
      ___syscall_chmod,
      SOCKFS,
      getSocketFromFD,
      inetNtop4,
      inetNtop6,
      HEAP16,
      HEAPU16,
      readSockaddr,
      inetPton4,
      inetPton6,
      DNS,
      getSocketAddress,
      ___syscall_connect,
      ___syscall_dup3,
      ___syscall_faccessat,
      ___syscall_fchmod,
      ___syscall_fchown32,
      syscallGetVarargI,
      syscallGetVarargP,
      ___syscall_fcntl64,
      ___syscall_fstat64,
      INT53_MAX,
      INT53_MIN,
      bigintToI53Checked,
      ___syscall_ftruncate64,
      stringToUTF8,
      ___syscall_getcwd,
      ___syscall_getdents64,
      ___syscall_getegid32,
      ___syscall_geteuid32,
      ___syscall_getgid32,
      writeSockaddr,
      ___syscall_getpeername,
      ___syscall_getsockname,
      ___syscall_getsockopt,
      ___syscall_getuid32,
      ___syscall_ioctl,
      ___syscall_lstat64,
      ___syscall_mkdirat,
      ___syscall_newfstatat,
      ___syscall_openat,
      pollOne,
      doPollSync,
      ___syscall_poll,
      ___syscall_poll_nonblocking,
      ___syscall_readlinkat,
      ___syscall_renameat,
      ___syscall_rmdir,
      ___syscall_sendmsg,
      ___syscall_setsockopt,
      ___syscall_socket,
      ___syscall_stat64,
      ___syscall_unlinkat,
      readI53FromI64,
      ___syscall_utimensat,
      __abort_js,
      jsStackTrace,
      getCallstack,
      __emscripten_log_formatted,
      __gmtime_js,
      isLeapYear,
      MONTH_DAYS_LEAP_CUMULATIVE,
      MONTH_DAYS_REGULAR_CUMULATIVE,
      ydayFromDate,
      __localtime_js,
      __mmap_js,
      __munmap_js,
      __tzset_js,
      _emscripten_get_now,
      _emscripten_date_now,
      nowIsMonotonic,
      checkWasiClock,
      _clock_time_get,
      readEmAsmArgsArray,
      HEAPF64,
      readEmAsmArgs,
      runEmAsmFunction,
      _emscripten_asm_const_int,
      _emscripten_exit_with_live_runtime,
      getHeapMax,
      _emscripten_get_heap_max,
      growMemory,
      _emscripten_resize_heap,
      ENV,
      getExecutableName,
      _getEnvStrings,
      _environ_get,
      _environ_sizes_get,
      _fd_close,
      _fd_fdstat_get,
      doReadv,
      _fd_pread,
      doWritev,
      _fd_pwrite,
      _fd_read,
      _fd_seek,
      _fd_sync,
      _fd_write,
      _getaddrinfo,
      _random_get,
      runtimeKeepaliveCounter,
      keepRuntimeAlive,
      _proc_exit,
      exitJS,
      handleException,
      getCFunc,
      writeArrayToMemory,
      stackAlloc,
      stringToUTF8OnStack,
      ccall,
      cwrap,
      preInit,
      ASM_CONSTS,
      _td_emscripten_create_client_id,
      _td_emscripten_send,
      _td_emscripten_receive,
      _td_emscripten_execute,
      _td_emscripten_get_timeout,
      _main,
      _malloc,
      _htonl,
      _htons,
      _ntohs,
      _emscripten_builtin_memalign,
      __emscripten_stack_restore,
      __emscripten_stack_alloc,
      _emscripten_stack_get_current,
      memory,
      __indirect_function_table,
      wasmMemory,
      assignWasmExports,
      wasmImports,
      callMain,
      run,
      _run,
      wasmExports,
      _args10 = arguments;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.n) {
        case 0:
          _run = function _run3() {
            _run = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_9___default()(/*#__PURE__*/_regenerator().m(function _callee1() {
              var _Module$onRuntimeInit;
              var setStatus, noInitialRun;
              return _regenerator().w(function (_context1) {
                while (1) switch (_context1.n) {
                  case 0:
                    preRun();
                    if (!runDependencies) {
                      _context1.n = 1;
                      break;
                    }
                    _context1.n = 1;
                    return resolveRunDependencies();
                  case 1:
                    setStatus = Module["setStatus"];
                    if (!setStatus) {
                      _context1.n = 3;
                      break;
                    }
                    setStatus("Running...");
                    _context1.n = 2;
                    return new Promise(function (resolve) {
                      return setTimeout(resolve, 1);
                    });
                  case 2:
                    setTimeout(setStatus, 1, "");
                  case 3:
                    if (!ABORT) {
                      _context1.n = 4;
                      break;
                    }
                    return _context1.a(2);
                  case 4:
                    initRuntime();
                    (_Module$onRuntimeInit = Module["onRuntimeInitialized"]) === null || _Module$onRuntimeInit === void 0 || _Module$onRuntimeInit.call(Module);
                    noInitialRun = Module["noInitialRun"] || false;
                    if (!noInitialRun) callMain();
                    postRun();
                  case 5:
                    return _context1.a(2);
                }
              }, _callee1);
            }));
            return _run.apply(this, arguments);
          };
          run = function _run2() {
            return _run.apply(this, arguments);
          };
          callMain = function _callMain() {
            var entryFunction = _main;
            var argc = 0;
            var argv = 0;
            try {
              var ret = entryFunction(argc, argv);
              exitJS(ret, true);
              return ret;
            } catch (e) {
              return handleException(e);
            }
          };
          assignWasmExports = function _assignWasmExports(wasmExports) {
            _td_emscripten_create_client_id = Module["_td_emscripten_create_client_id"] = wasmExports["ia"];
            _td_emscripten_send = Module["_td_emscripten_send"] = wasmExports["ja"];
            _td_emscripten_receive = Module["_td_emscripten_receive"] = wasmExports["ka"];
            _td_emscripten_execute = Module["_td_emscripten_execute"] = wasmExports["la"];
            _td_emscripten_get_timeout = Module["_td_emscripten_get_timeout"] = wasmExports["ma"];
            _main = Module["_main"] = wasmExports["na"];
            _malloc = wasmExports["oa"];
            _htonl = wasmExports["pa"];
            _htons = wasmExports["qa"];
            _ntohs = wasmExports["ra"];
            _emscripten_builtin_memalign = wasmExports["sa"];
            __emscripten_stack_restore = wasmExports["ta"];
            __emscripten_stack_alloc = wasmExports["ua"];
            _emscripten_stack_get_current = wasmExports["va"];
            memory = wasmMemory = wasmExports["ga"];
            __indirect_function_table = wasmExports["__indirect_function_table"];
          };
          _fd_write = function _fd_write2(fd, iov, iovcnt, pnum) {
            try {
              var stream = SYSCALLS.getStreamFromFD(fd);
              var num = doWritev(stream, iov, iovcnt);
              HEAPU32[pnum >> 2] = num;
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return e.errno;
            }
          };
          _fd_sync = function _fd_sync2(fd) {
            try {
              var _stream$stream_ops4, _stream$stream_ops4$f;
              var stream = SYSCALLS.getStreamFromFD(fd);
              var rtn = (_stream$stream_ops4 = stream.stream_ops) === null || _stream$stream_ops4 === void 0 || (_stream$stream_ops4$f = _stream$stream_ops4.fsync) === null || _stream$stream_ops4$f === void 0 ? void 0 : _stream$stream_ops4$f.call(_stream$stream_ops4, stream);
              return rtn;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return e.errno;
            }
          };
          _fd_seek = function _fd_seek2(fd, offset, whence, newOffset) {
            offset = bigintToI53Checked(offset);
            try {
              if (isNaN(offset)) return 22;
              var stream = SYSCALLS.getStreamFromFD(fd);
              FS.llseek(stream, offset, whence);
              HEAP64[newOffset >> 3] = BigInt(stream.position);
              if (stream.getdents && !offset && whence === 0) stream.getdents = null;
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return e.errno;
            }
          };
          _fd_read = function _fd_read2(fd, iov, iovcnt, pnum) {
            try {
              var stream = SYSCALLS.getStreamFromFD(fd);
              var num = doReadv(stream, iov, iovcnt);
              HEAPU32[pnum >> 2] = num;
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return e.errno;
            }
          };
          _fd_pwrite = function _fd_pwrite2(fd, iov, iovcnt, offset, pnum) {
            offset = bigintToI53Checked(offset);
            try {
              if (isNaN(offset)) return 22;
              var stream = SYSCALLS.getStreamFromFD(fd);
              var num = doWritev(stream, iov, iovcnt, offset);
              HEAPU32[pnum >> 2] = num;
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return e.errno;
            }
          };
          _fd_pread = function _fd_pread2(fd, iov, iovcnt, offset, pnum) {
            offset = bigintToI53Checked(offset);
            try {
              if (isNaN(offset)) return 22;
              var stream = SYSCALLS.getStreamFromFD(fd);
              var num = doReadv(stream, iov, iovcnt, offset);
              HEAPU32[pnum >> 2] = num;
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return e.errno;
            }
          };
          _fd_fdstat_get = function _fd_fdstat_get2(fd, pbuf) {
            try {
              var rightsBase = 0;
              var rightsInheriting = 0;
              var flags = 0;
              {
                var stream = SYSCALLS.getStreamFromFD(fd);
                var type = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
              }
              HEAP8[pbuf] = type;
              HEAP16[pbuf + 2 >> 1] = flags;
              HEAP64[pbuf + 8 >> 3] = BigInt(rightsBase);
              HEAP64[pbuf + 16 >> 3] = BigInt(rightsInheriting);
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return e.errno;
            }
          };
          _fd_close = function _fd_close2(fd) {
            try {
              var stream = SYSCALLS.getStreamFromFD(fd);
              FS.close(stream);
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return e.errno;
            }
          };
          _clock_time_get = function _clock_time_get2(clk_id, ignored_precision, ptime) {
            ignored_precision = bigintToI53Checked(ignored_precision);
            if (!checkWasiClock(clk_id)) {
              return 28;
            }
            var now;
            if (clk_id === 0) {
              now = _emscripten_date_now();
            } else if (nowIsMonotonic) {
              now = _emscripten_get_now();
            } else {
              return 52;
            }
            var nsec = Math.round(now * 1e3 * 1e3);
            HEAP64[ptime >> 3] = BigInt(nsec);
            return 0;
          };
          __munmap_js = function _munmap_js(addr, len, prot, flags, fd, offset) {
            offset = bigintToI53Checked(offset);
            try {
              var stream = SYSCALLS.getStreamFromFD(fd);
              if (prot & 2) {
                SYSCALLS.doMsync(addr, stream, len, flags, offset);
              }
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          __mmap_js = function _mmap_js(len, prot, flags, fd, offset, allocated, addr) {
            offset = bigintToI53Checked(offset);
            try {
              var stream = SYSCALLS.getStreamFromFD(fd);
              var res = FS.mmap(stream, len, offset, prot, flags);
              var ptr = res.ptr;
              HEAP32[allocated >> 2] = res.allocated;
              HEAPU32[addr >> 2] = ptr;
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          __localtime_js = function _localtime_js(time, tmPtr) {
            time = bigintToI53Checked(time);
            var date = new Date(time * 1e3);
            if (isNaN(date.getTime())) {
              return 1;
            }
            HEAP32[tmPtr >> 2] = date.getSeconds();
            HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
            HEAP32[tmPtr + 8 >> 2] = date.getHours();
            HEAP32[tmPtr + 12 >> 2] = date.getDate();
            HEAP32[tmPtr + 16 >> 2] = date.getMonth();
            HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
            HEAP32[tmPtr + 24 >> 2] = date.getDay();
            var yday = ydayFromDate(date) | 0;
            HEAP32[tmPtr + 28 >> 2] = yday;
            HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
            var start = new Date(date.getFullYear(), 0, 1);
            var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
            var winterOffset = start.getTimezoneOffset();
            var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
            HEAP32[tmPtr + 32 >> 2] = dst;
            return 0;
          };
          __gmtime_js = function _gmtime_js(time, tmPtr) {
            time = bigintToI53Checked(time);
            var date = new Date(time * 1e3);
            if (isNaN(date.getTime())) {
              return 1;
            }
            HEAP32[tmPtr >> 2] = date.getUTCSeconds();
            HEAP32[tmPtr + 4 >> 2] = date.getUTCMinutes();
            HEAP32[tmPtr + 8 >> 2] = date.getUTCHours();
            HEAP32[tmPtr + 12 >> 2] = date.getUTCDate();
            HEAP32[tmPtr + 16 >> 2] = date.getUTCMonth();
            HEAP32[tmPtr + 20 >> 2] = date.getUTCFullYear() - 1900;
            HEAP32[tmPtr + 24 >> 2] = date.getUTCDay();
            var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
            var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
            HEAP32[tmPtr + 28 >> 2] = yday;
            return 0;
          };
          ___syscall_utimensat = function _syscall_utimensat(dirfd, path, times, flags) {
            try {
              var nofollow = flags & 256;
              path = SYSCALLS.getStr(path);
              path = SYSCALLS.calculateAt(dirfd, path, true);
              var now = Date.now(),
                atime,
                mtime;
              if (!times) {
                atime = now;
                mtime = now;
              } else {
                var seconds = readI53FromI64(times);
                var nanoseconds = HEAP32[times + 8 >> 2];
                if (nanoseconds == 1073741823) {
                  atime = now;
                } else if (nanoseconds == 1073741822) {
                  atime = null;
                } else {
                  atime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
                }
                times += 16;
                seconds = readI53FromI64(times);
                nanoseconds = HEAP32[times + 8 >> 2];
                if (nanoseconds == 1073741823) {
                  mtime = now;
                } else if (nanoseconds == 1073741822) {
                  mtime = null;
                } else {
                  mtime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
                }
              }
              if ((mtime !== null && mtime !== void 0 ? mtime : atime) !== null) {
                FS.utime(path, atime, mtime, nofollow);
              }
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_unlinkat = function _syscall_unlinkat(dirfd, path, flags) {
            try {
              path = SYSCALLS.getStr(path);
              path = SYSCALLS.calculateAt(dirfd, path);
              if (!flags) {
                FS.unlink(path);
              } else if (flags === 512) {
                FS.rmdir(path);
              } else {
                return -28;
              }
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_stat64 = function _syscall_stat(path, buf) {
            try {
              path = SYSCALLS.getStr(path);
              return SYSCALLS.writeStat(buf, FS.stat(path));
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_socket = function _syscall_socket(domain, type, protocol, u1, u2, u3) {
            try {
              var sock = SOCKFS.createSocket(domain, type, protocol);
              return sock.stream.fd;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_setsockopt = function _syscall_setsockopt(fd, level, optname, optval, optlen, unused) {
            try {
              getSocketFromFD(fd);
              return -50;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_sendmsg = function _syscall_sendmsg(fd, message, flags, u1, u2, u3) {
            try {
              var sock = getSocketFromFD(fd);
              var iov = HEAPU32[message + 8 >> 2];
              var num = HEAP32[message + 12 >> 2];
              var addr, port;
              var name = HEAPU32[message >> 2];
              var namelen = HEAP32[message + 4 >> 2];
              if (name) {
                var info = getSocketAddress(name, namelen);
                port = info.port;
                addr = info.addr;
              }
              var total = 0;
              for (var i = 0; i < num; i++) {
                total += HEAP32[iov + (8 * i + 4) >> 2];
              }
              var view = new Uint8Array(total);
              var offset = 0;
              for (var i = 0; i < num; i++) {
                var iovbase = HEAPU32[iov + (8 * i + 0) >> 2];
                var iovlen = HEAP32[iov + (8 * i + 4) >> 2];
                for (var j = 0; j < iovlen; j++) {
                  view[offset++] = HEAP8[iovbase + j];
                }
              }
              return sock.sock_ops.sendmsg(sock, view, 0, total, addr, port);
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_rmdir = function _syscall_rmdir(path) {
            try {
              path = SYSCALLS.getStr(path);
              FS.rmdir(path);
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_renameat = function _syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
            try {
              oldpath = SYSCALLS.getStr(oldpath);
              newpath = SYSCALLS.getStr(newpath);
              oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
              newpath = SYSCALLS.calculateAt(newdirfd, newpath);
              FS.rename(oldpath, newpath);
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_readlinkat = function _syscall_readlinkat(dirfd, path, buf, bufsize) {
            try {
              path = SYSCALLS.getStr(path);
              path = SYSCALLS.calculateAt(dirfd, path);
              if (bufsize <= 0) return -28;
              var ret = FS.readlink(path);
              var len = Math.min(bufsize, lengthBytesUTF8(ret));
              var endChar = HEAP8[buf + len];
              stringToUTF8(ret, buf, bufsize + 1);
              HEAP8[buf + len] = endChar;
              return len;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_poll_nonblocking = function _syscall_poll_nonbl(fds, nfds) {
            try {
              return doPollSync(fds, nfds);
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_poll = function _syscall_poll(fds, nfds, timeout) {
            try {
              var count = doPollSync(fds, nfds);
              return count;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_openat = function _syscall_openat(dirfd, path, flags, varargs) {
            SYSCALLS.varargs = varargs;
            try {
              path = SYSCALLS.getStr(path);
              path = SYSCALLS.calculateAt(dirfd, path);
              var mode = varargs ? syscallGetVarargI() : 0;
              if (flags & 64) {
                mode &= ~SYSCALLS.currentUmask;
              }
              return FS.open(path, flags, mode).fd;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_newfstatat = function _syscall_newfstatat(dirfd, path, buf, flags) {
            try {
              path = SYSCALLS.getStr(path);
              var nofollow = flags & 256;
              var allowEmpty = flags & 4096;
              flags = flags & ~6400;
              path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
              return SYSCALLS.writeStat(buf, nofollow ? FS.lstat(path) : FS.stat(path));
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_mkdirat = function _syscall_mkdirat(dirfd, path, mode) {
            try {
              path = SYSCALLS.getStr(path);
              path = SYSCALLS.calculateAt(dirfd, path);
              mode &= ~SYSCALLS.currentUmask;
              FS.mkdir(path, mode, 0);
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_lstat64 = function _syscall_lstat(path, buf) {
            try {
              path = SYSCALLS.getStr(path);
              return SYSCALLS.writeStat(buf, FS.lstat(path));
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_ioctl = function _syscall_ioctl(fd, op, varargs) {
            SYSCALLS.varargs = varargs;
            try {
              var stream = SYSCALLS.getStreamFromFD(fd);
              switch (op) {
                case 21509:
                  {
                    if (!stream.tty) return -59;
                    return 0;
                  }
                case 21505:
                  {
                    if (!stream.tty) return -59;
                    if (stream.tty.ops.ioctl_tcgets) {
                      var termios = stream.tty.ops.ioctl_tcgets(stream);
                      var argp = syscallGetVarargP();
                      HEAP32[argp >> 2] = termios.c_iflag || 0;
                      HEAP32[argp + 4 >> 2] = termios.c_oflag || 0;
                      HEAP32[argp + 8 >> 2] = termios.c_cflag || 0;
                      HEAP32[argp + 12 >> 2] = termios.c_lflag || 0;
                      for (var i = 0; i < 32; i++) {
                        HEAP8[argp + i + 17] = termios.c_cc[i] || 0;
                      }
                      return 0;
                    }
                    return 0;
                  }
                case 21510:
                case 21511:
                case 21512:
                  {
                    if (!stream.tty) return -59;
                    return 0;
                  }
                case 21506:
                case 21507:
                case 21508:
                  {
                    if (!stream.tty) return -59;
                    if (stream.tty.ops.ioctl_tcsets) {
                      var argp = syscallGetVarargP();
                      var c_iflag = HEAP32[argp >> 2];
                      var c_oflag = HEAP32[argp + 4 >> 2];
                      var c_cflag = HEAP32[argp + 8 >> 2];
                      var c_lflag = HEAP32[argp + 12 >> 2];
                      var c_cc = [];
                      for (var i = 0; i < 32; i++) {
                        c_cc.push(HEAP8[argp + i + 17]);
                      }
                      return stream.tty.ops.ioctl_tcsets(stream.tty, op, {
                        c_iflag: c_iflag,
                        c_oflag: c_oflag,
                        c_cflag: c_cflag,
                        c_lflag: c_lflag,
                        c_cc: c_cc
                      });
                    }
                    return 0;
                  }
                case 21519:
                  {
                    if (!stream.tty) return -59;
                    var argp = syscallGetVarargP();
                    HEAP32[argp >> 2] = 0;
                    return 0;
                  }
                case 21520:
                  {
                    if (!stream.tty) return -59;
                    return -28;
                  }
                case 21537:
                case 21531:
                  {
                    var argp = syscallGetVarargP();
                    return FS.ioctl(stream, op, argp);
                  }
                case 21523:
                  {
                    if (!stream.tty) return -59;
                    if (stream.tty.ops.ioctl_tiocgwinsz) {
                      var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
                      var argp = syscallGetVarargP();
                      HEAP16[argp >> 1] = winsize[0];
                      HEAP16[argp + 2 >> 1] = winsize[1];
                    }
                    return 0;
                  }
                case 21524:
                  {
                    if (!stream.tty) return -59;
                    return 0;
                  }
                case 21515:
                  {
                    if (!stream.tty) return -59;
                    return 0;
                  }
                default:
                  return -28;
              }
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_getsockopt = function _syscall_getsockopt(fd, level, optname, optval, optlen, unused) {
            try {
              var sock = getSocketFromFD(fd);
              if (level === 1) {
                if (optname === 4) {
                  HEAP32[optval >> 2] = sock.error;
                  HEAP32[optlen >> 2] = 4;
                  sock.error = null;
                  return 0;
                }
              }
              return -50;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_getsockname = function _syscall_getsocknam(fd, addr, len, u1, u2, u3) {
            try {
              var sock = getSocketFromFD(fd);
              var defaultAddr = "0.0.0.0";
              var errno = writeSockaddr(addr, sock.family, sock.saddr || defaultAddr, sock.sport, len);
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_getpeername = function _syscall_getpeernam(fd, addr, len, u1, u2, u3) {
            try {
              var sock = getSocketFromFD(fd);
              if (!sock.daddr) {
                return -53;
              }
              var errno = writeSockaddr(addr, sock.family, sock.daddr, sock.dport, len);
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_getdents64 = function _syscall_getdents(fd, dirp, count) {
            try {
              var stream = SYSCALLS.getStreamFromFD(fd);
              stream.getdents || (stream.getdents = FS.readdir(stream.path));
              var struct_size = 280;
              var pos = 0;
              var off = FS.llseek(stream, 0, 1);
              var startIdx = Math.floor(off / struct_size);
              var endIdx = Math.min(stream.getdents.length, startIdx + Math.floor(count / struct_size));
              for (var idx = startIdx; idx < endIdx; idx++) {
                var id;
                var type;
                var name = stream.getdents[idx];
                if (name === ".") {
                  id = stream.node.id;
                  type = 4;
                } else if (name === "..") {
                  var lookup = FS.lookupPath(stream.path, {
                    parent: true
                  });
                  id = lookup.node.id;
                  type = 4;
                } else {
                  var child;
                  try {
                    child = FS.lookupNode(stream.node, name);
                  } catch (e) {
                    if ((e === null || e === void 0 ? void 0 : e.errno) === 28) {
                      continue;
                    }
                    throw e;
                  }
                  id = child.id;
                  type = FS.isChrdev(child.mode) ? 2 : FS.isDir(child.mode) ? 4 : FS.isLink(child.mode) ? 10 : 8;
                }
                HEAP64[dirp + pos >> 3] = BigInt(id);
                HEAP64[dirp + pos + 8 >> 3] = BigInt((idx + 1) * struct_size);
                HEAP16[dirp + pos + 16 >> 1] = 280;
                HEAP8[dirp + pos + 18] = type;
                stringToUTF8(name, dirp + pos + 19, 256);
                pos += struct_size;
              }
              FS.llseek(stream, idx * struct_size, 0);
              return pos;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_getcwd = function _syscall_getcwd(buf, size) {
            try {
              if (!size) return -28;
              var cwd = FS.cwd();
              var cwdLengthInBytes = lengthBytesUTF8(cwd) + 1;
              if (size < cwdLengthInBytes) return -68;
              stringToUTF8(cwd, buf, size);
              return cwdLengthInBytes;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_ftruncate64 = function _syscall_ftruncate(fd, length) {
            length = bigintToI53Checked(length);
            try {
              if (isNaN(length)) return -22;
              FS.ftruncate(fd, length);
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_fstat64 = function _syscall_fstat(fd, buf) {
            try {
              return SYSCALLS.writeStat(buf, FS.fstat(fd));
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_fcntl64 = function _syscall_fcntl(fd, cmd, varargs) {
            SYSCALLS.varargs = varargs;
            try {
              var stream = SYSCALLS.getStreamFromFD(fd);
              switch (cmd) {
                case 0:
                  {
                    var arg = syscallGetVarargI();
                    if (arg < 0) {
                      return -28;
                    }
                    while (FS.streams[arg]) {
                      arg++;
                    }
                    var newStream;
                    newStream = FS.dupStream(stream, arg);
                    return newStream.fd;
                  }
                case 1:
                case 2:
                  return 0;
                case 3:
                  return stream.flags;
                case 4:
                  {
                    var arg = syscallGetVarargI();
                    var mask = 289792;
                    stream.flags = stream.flags & ~mask | arg & mask;
                    return 0;
                  }
                case 12:
                  {
                    var arg = syscallGetVarargP();
                    var offset = 0;
                    HEAP16[arg + offset >> 1] = 2;
                    return 0;
                  }
                case 13:
                case 14:
                  return 0;
              }
              return -28;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_fchown32 = function _syscall_fchown(fd, owner, group) {
            try {
              FS.fchown(fd, owner, group);
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_fchmod = function _syscall_fchmod(fd, mode) {
            try {
              FS.fchmod(fd, mode);
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_faccessat = function _syscall_faccessat(dirfd, path, amode, flags) {
            try {
              path = SYSCALLS.getStr(path);
              path = SYSCALLS.calculateAt(dirfd, path);
              if (amode & ~7) {
                return -28;
              }
              var lookup = FS.lookupPath(path, {
                follow: true
              });
              var node = lookup.node;
              if (!node) {
                return -44;
              }
              var perms = "";
              if (amode & 4) perms += "r";
              if (amode & 2) perms += "w";
              if (amode & 1) perms += "x";
              if (perms && FS.nodePermissions(node, perms)) {
                return -2;
              }
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_dup3 = function _syscall_dup(fd, newfd, flags) {
            try {
              if (fd === newfd) return -28;
              if (flags & ~524288) return -28;
              var old = SYSCALLS.getStreamFromFD(fd);
              if (newfd < 0 || newfd >= FS.MAX_OPEN_FDS) return -8;
              var existing = FS.getStream(newfd);
              if (existing) FS.close(existing);
              var stream = FS.dupStream(old, newfd);
              if (flags & 524288) {
                stream.flags |= 524288;
              }
              return stream.fd;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_connect = function _syscall_connect(fd, addr, len, u1, u2, u3) {
            try {
              var sock = getSocketFromFD(fd);
              var info = getSocketAddress(addr, len);
              sock.sock_ops.connect(sock, info.addr, info.port);
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          ___syscall_chmod = function _syscall_chmod(path, mode) {
            try {
              path = SYSCALLS.getStr(path);
              FS.chmod(path, mode);
              return 0;
            } catch (e) {
              if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
              return -e.errno;
            }
          };
          _createWasm = function _createWasm3() {
            _createWasm = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_9___default()(/*#__PURE__*/_regenerator().m(function _callee0() {
              var receiveInstance, receiveInstantiationResult, info, instantiateWasm, result, exports;
              return _regenerator().w(function (_context0) {
                while (1) switch (_context0.n) {
                  case 0:
                    receiveInstantiationResult = function _receiveInstantiation(result) {
                      return receiveInstance(result["instance"]);
                    };
                    receiveInstance = function _receiveInstance(instance) {
                      wasmExports = instance.exports;
                      assignWasmExports(wasmExports);
                      updateMemoryViews();
                      return wasmExports;
                    };
                    info = getWasmImports();
                    instantiateWasm = Module["instantiateWasm"];
                    if (!instantiateWasm) {
                      _context0.n = 1;
                      break;
                    }
                    return _context0.a(2, new Promise(function (resolve) {
                      instantiateWasm(info, function (inst) {
                        return resolve(receiveInstance(inst));
                      });
                    }));
                  case 1:
                    wasmBinaryFile !== null && wasmBinaryFile !== void 0 ? wasmBinaryFile : wasmBinaryFile = findWasmBinary();
                    _context0.n = 2;
                    return instantiateAsync(wasmBinary, wasmBinaryFile, info);
                  case 2:
                    result = _context0.v;
                    exports = receiveInstantiationResult(result);
                    return _context0.a(2, exports);
                }
              }, _callee0);
            }));
            return _createWasm.apply(this, arguments);
          };
          createWasm = function _createWasm2() {
            return _createWasm.apply(this, arguments);
          };
          getWasmImports = function _getWasmImports() {
            var imports = {
              a: wasmImports
            };
            return imports;
          };
          _instantiateAsync = function _instantiateAsync3() {
            _instantiateAsync = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_9___default()(/*#__PURE__*/_regenerator().m(function _callee9(binary, binaryFile, imports) {
              var response, instantiationResult, _t3;
              return _regenerator().w(function (_context9) {
                while (1) switch (_context9.p = _context9.n) {
                  case 0:
                    if (!(!binary && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE)) {
                      _context9.n = 4;
                      break;
                    }
                    _context9.p = 1;
                    response = fetch(binaryFile, {
                      credentials: "same-origin"
                    });
                    _context9.n = 2;
                    return WebAssembly.instantiateStreaming(response, imports);
                  case 2:
                    instantiationResult = _context9.v;
                    return _context9.a(2, instantiationResult);
                  case 3:
                    _context9.p = 3;
                    _t3 = _context9.v;
                    err("wasm streaming compile failed: ".concat(_t3));
                    err("falling back to ArrayBuffer instantiation");
                  case 4:
                    return _context9.a(2, instantiateArrayBuffer(binaryFile, imports));
                }
              }, _callee9, null, [[1, 3]]);
            }));
            return _instantiateAsync.apply(this, arguments);
          };
          instantiateAsync = function _instantiateAsync2(_x6, _x7, _x8) {
            return _instantiateAsync.apply(this, arguments);
          };
          _instantiateArrayBuffer = function _instantiateArrayBuff2() {
            _instantiateArrayBuffer = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_9___default()(/*#__PURE__*/_regenerator().m(function _callee8(binaryFile, imports) {
              var binary, instance, _t2;
              return _regenerator().w(function (_context8) {
                while (1) switch (_context8.p = _context8.n) {
                  case 0:
                    _context8.p = 0;
                    _context8.n = 1;
                    return getWasmBinary(binaryFile);
                  case 1:
                    binary = _context8.v;
                    _context8.n = 2;
                    return WebAssembly.instantiate(binary, imports);
                  case 2:
                    instance = _context8.v;
                    return _context8.a(2, instance);
                  case 3:
                    _context8.p = 3;
                    _t2 = _context8.v;
                    err("failed to asynchronously prepare wasm: ".concat(_t2));
                    abort(_t2);
                  case 4:
                    return _context8.a(2);
                }
              }, _callee8, null, [[0, 3]]);
            }));
            return _instantiateArrayBuffer.apply(this, arguments);
          };
          instantiateArrayBuffer = function _instantiateArrayBuff(_x4, _x5) {
            return _instantiateArrayBuffer.apply(this, arguments);
          };
          _getWasmBinary = function _getWasmBinary3() {
            _getWasmBinary = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_9___default()(/*#__PURE__*/_regenerator().m(function _callee7(binaryFile) {
              var response, _t;
              return _regenerator().w(function (_context7) {
                while (1) switch (_context7.p = _context7.n) {
                  case 0:
                    if (wasmBinary) {
                      _context7.n = 4;
                      break;
                    }
                    _context7.p = 1;
                    _context7.n = 2;
                    return readAsync(binaryFile);
                  case 2:
                    response = _context7.v;
                    return _context7.a(2, new Uint8Array(response));
                  case 3:
                    _context7.p = 3;
                    _t = _context7.v;
                  case 4:
                    return _context7.a(2, getBinarySync(binaryFile));
                }
              }, _callee7, null, [[1, 3]]);
            }));
            return _getWasmBinary.apply(this, arguments);
          };
          getWasmBinary = function _getWasmBinary2(_x3) {
            return _getWasmBinary.apply(this, arguments);
          };
          getBinarySync = function _getBinarySync(file) {
            if (readBinary) {
              return readBinary(file);
            }
            throw "both async and sync fetching of the wasm failed";
          };
          findWasmBinary = function _findWasmBinary() {
            return locateFile("td_wasm.wasm");
          };
          abort = function _abort(what) {
            var _Module$onAbort;
            (_Module$onAbort = Module["onAbort"]) === null || _Module$onAbort === void 0 || _Module$onAbort.call(Module, what);
            what = "Aborted(".concat(what, ")");
            err(what);
            ABORT = true;
            what += ". Build with -sASSERTIONS for more info.";
            var e = new WebAssembly.RuntimeError(what);
            throw e;
          };
          postRun = function _postRun() {
            var postRun = Module["postRun"];
            if (postRun) {
              if (typeof postRun == "function") postRun = [postRun];
              onPostRuns.push.apply(onPostRuns, _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3___default()(postRun));
            }
            callRuntimeCallbacks(onPostRuns);
          };
          initRuntime = function _initRuntime() {
            runtimeInitialized = true;
            if (!Module["noFSInit"] && !FS.initialized) FS.init();
            TTY.init();
            SOCKFS.root = FS.mount(SOCKFS, {}, null);
            wasmExports["ha"]();
            FS.ignorePermissions = false;
          };
          preRun = function _preRun() {
            var preRun = Module["preRun"];
            if (preRun) {
              if (typeof preRun == "function") preRun = [preRun];
              onPreRuns.push.apply(onPreRuns, _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3___default()(preRun));
            }
            callRuntimeCallbacks(onPreRuns);
          };
          updateMemoryViews = function _updateMemoryViews() {
            var _HEAP;
            if ((_HEAP = HEAP8) !== null && _HEAP !== void 0 && (_HEAP = _HEAP.buffer) !== null && _HEAP !== void 0 && _HEAP.resizable) return;
            var b = getMemoryBuffer();
            HEAP8 = new Int8Array(b);
            HEAP16 = new Int16Array(b);
            HEAPU8 = new Uint8Array(b);
            HEAPU16 = new Uint16Array(b);
            HEAP32 = new Int32Array(b);
            HEAPU32 = new Uint32Array(b);
            HEAPF64 = new Float64Array(b);
            HEAP64 = new BigInt64Array(b);
          };
          getMemoryBuffer = function _getMemoryBuffer() {
            return wasmMemory.buffer;
          };
          assert = function _assert(condition, text) {
            if (!condition) {
              abort(text);
            }
          };
          locateFile = function _locateFile(path) {
            if (Module["locateFile"]) {
              return Module["locateFile"](path, scriptDirectory);
            }
            return scriptDirectory + path;
          };
          moduleArg = _args10.length > 0 && _args10[0] !== undefined ? _args10[0] : {};
          Module = moduleArg;
          ENVIRONMENT_IS_WEB = !!globalThis.window;
          ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;
          ENVIRONMENT_IS_NODE = ((_globalThis$process = globalThis.process) === null || _globalThis$process === void 0 || (_globalThis$process = _globalThis$process.versions) === null || _globalThis$process === void 0 ? void 0 : _globalThis$process.node) && ((_globalThis$process2 = globalThis.process) === null || _globalThis$process2 === void 0 ? void 0 : _globalThis$process2.type) != "renderer";
          programArgs = [];
          thisProgram = "./this.program";
          quit_ = function quit_(status, toThrow) {
            throw toThrow;
          };
          if (true) {
            _scriptName = __filename;
          } else {}
          scriptDirectory = "";
          if (ENVIRONMENT_IS_NODE) {
            fs = __webpack_require__(8);
            scriptDirectory = __dirname + "/";
            readBinary = function readBinary(filename) {
              filename = isFileURI(filename) ? new URL(filename) : filename;
              var ret = fs.readFileSync(filename);
              return ret;
            };
            readAsync = /*#__PURE__*/function () {
              var _ref2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_9___default()(/*#__PURE__*/_regenerator().m(function _callee(filename) {
                var binary,
                  ret,
                  _args = arguments;
                return _regenerator().w(function (_context) {
                  while (1) switch (_context.n) {
                    case 0:
                      binary = _args.length > 1 && _args[1] !== undefined ? _args[1] : true;
                      filename = isFileURI(filename) ? new URL(filename) : filename;
                      ret = fs.readFileSync(filename, binary ? undefined : "utf8");
                      return _context.a(2, ret);
                  }
                }, _callee);
              }));
              return function readAsync(_x) {
                return _ref2.apply(this, arguments);
              };
            }();
            if (process.argv.length > 1) {
              thisProgram = process.argv[1].replace(/\\/g, "/");
            }
            programArgs = process.argv.slice(2);
            quit_ = function quit_(status, toThrow) {
              process.exitCode = status;
              throw toThrow;
            };
          } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
            try {
              scriptDirectory = new URL(".", _scriptName).href;
            } catch (_unused) {}
            {
              if (ENVIRONMENT_IS_WORKER) {
                readBinary = function readBinary(url) {
                  var xhr = new XMLHttpRequest();
                  xhr.open("GET", url, false);
                  xhr.responseType = "arraybuffer";
                  xhr.send(null);
                  return new Uint8Array(xhr.response);
                };
              }
              readAsync = /*#__PURE__*/function () {
                var _ref3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_9___default()(/*#__PURE__*/_regenerator().m(function _callee2(url) {
                  var response;
                  return _regenerator().w(function (_context2) {
                    while (1) switch (_context2.n) {
                      case 0:
                        if (!isFileURI(url)) {
                          _context2.n = 1;
                          break;
                        }
                        return _context2.a(2, new Promise(function (resolve, reject) {
                          var xhr = new XMLHttpRequest();
                          xhr.open("GET", url, true);
                          xhr.responseType = "arraybuffer";
                          xhr.onload = function () {
                            if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                              resolve(xhr.response);
                              return;
                            }
                            reject(xhr.status);
                          };
                          xhr.onerror = reject;
                          xhr.send(null);
                        }));
                      case 1:
                        _context2.n = 2;
                        return fetch(url, {
                          credentials: "same-origin"
                        });
                      case 2:
                        response = _context2.v;
                        if (!response.ok) {
                          _context2.n = 3;
                          break;
                        }
                        return _context2.a(2, response.arrayBuffer());
                      case 3:
                        throw new Error(response.status + " : " + response.url);
                      case 4:
                        return _context2.a(2);
                    }
                  }, _callee2);
                }));
                return function readAsync(_x2) {
                  return _ref3.apply(this, arguments);
                };
              }();
            }
          } else {}
          out = console.log.bind(console);
          err = console.error.bind(console);
          ABORT = false;
          isFileURI = function isFileURI(filename) {
            return filename.startsWith("file://");
          };
          EmscriptenEH = /*#__PURE__*/_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_7___default()(function EmscriptenEH() {
            _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_8___default()(this, EmscriptenEH);
          });
          EmscriptenSjLj = /*#__PURE__*/function (_EmscriptenEH) {
            function EmscriptenSjLj() {
              _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_8___default()(this, EmscriptenSjLj);
              return _callSuper(this, EmscriptenSjLj, arguments);
            }
            _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default()(EmscriptenSjLj, _EmscriptenEH);
            return _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_7___default()(EmscriptenSjLj);
          }(EmscriptenEH);
          runtimeInitialized = false;
          ExitStatus = /*#__PURE__*/_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_7___default()(function ExitStatus(status) {
            _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_8___default()(this, ExitStatus);
            _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "name", "ExitStatus");
            this.message = "Program terminated with exit(".concat(status, ")");
            this.status = status;
          });
          callRuntimeCallbacks = function callRuntimeCallbacks(callbacks) {
            while (callbacks.length > 0) {
              callbacks.shift()(Module);
            }
          };
          onPostRuns = [];
          onPreRuns = [];
          noExitRuntime = true;
          stackRestore = function stackRestore(val) {
            return __emscripten_stack_restore(val);
          };
          stackSave = function stackSave() {
            return _emscripten_stack_get_current();
          };
          PATH = {
            isAbs: function isAbs(path) {
              return path.charAt(0) === "/";
            },
            splitPath: function splitPath(filename) {
              var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
              return splitPathRe.exec(filename).slice(1);
            },
            normalizeArray: function normalizeArray(parts, allowAboveRoot) {
              var up = 0;
              for (var i = parts.length - 1; i >= 0; i--) {
                var last = parts[i];
                if (last === ".") {
                  parts.splice(i, 1);
                } else if (last === "..") {
                  parts.splice(i, 1);
                  up++;
                } else if (up) {
                  parts.splice(i, 1);
                  up--;
                }
              }
              if (allowAboveRoot) {
                for (; up; up--) {
                  parts.unshift("..");
                }
              }
              return parts;
            },
            normalize: function normalize(path) {
              var isAbsolute = PATH.isAbs(path),
                trailingSlash = path.slice(-1) === "/";
              path = PATH.normalizeArray(path.split("/").filter(function (p) {
                return !!p;
              }), !isAbsolute).join("/");
              if (!path && !isAbsolute) {
                path = ".";
              }
              if (path && trailingSlash) {
                path += "/";
              }
              return (isAbsolute ? "/" : "") + path;
            },
            dirname: function dirname(path) {
              var result = PATH.splitPath(path),
                root = result[0],
                dir = result[1];
              if (!root && !dir) {
                return ".";
              }
              if (dir) {
                dir = dir.slice(0, -1);
              }
              return root + dir;
            },
            basename: function basename(path) {
              return path && path.match(/([^\/]+|\/)\/*$/)[1];
            },
            join: function join() {
              for (var _len = arguments.length, paths = new Array(_len), _key = 0; _key < _len; _key++) {
                paths[_key] = arguments[_key];
              }
              return PATH.normalize(paths.join("/"));
            },
            join2: function join2(l, r) {
              return PATH.normalize(l + "/" + r);
            }
          };
          initRandomFill = function initRandomFill() {
            if (ENVIRONMENT_IS_NODE) {
              var nodeCrypto = __webpack_require__(8);
              return function (view) {
                return nodeCrypto.randomFillSync(view), 0;
              };
            }
            return function (view) {
              return crypto.getRandomValues(view), 0;
            };
          };
          _randomFill = function randomFill(view) {
            return (_randomFill = initRandomFill())(view);
          };
          PATH_FS = {
            resolve: function resolve() {
              var resolvedPath = "",
                resolvedAbsolute = false;
              for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                var path = i >= 0 ? i < 0 || arguments.length <= i ? undefined : arguments[i] : FS.cwd();
                if (typeof path != "string") {
                  throw new TypeError("Arguments to path.resolve must be strings");
                } else if (!path) {
                  return "";
                }
                resolvedPath = path + "/" + resolvedPath;
                resolvedAbsolute = PATH.isAbs(path);
              }
              resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(function (p) {
                return !!p;
              }), !resolvedAbsolute).join("/");
              return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
            },
            relative: function relative(from, to) {
              from = PATH_FS.resolve(from).slice(1);
              to = PATH_FS.resolve(to).slice(1);
              function trim(arr) {
                var start = 0;
                for (; start < arr.length; start++) {
                  if (arr[start] !== "") break;
                }
                var end = arr.length - 1;
                for (; end >= 0; end--) {
                  if (arr[end] !== "") break;
                }
                if (start > end) return [];
                return arr.slice(start, end - start + 1);
              }
              var fromParts = trim(from.split("/"));
              var toParts = trim(to.split("/"));
              var length = Math.min(fromParts.length, toParts.length);
              var samePartsLength = length;
              for (var i = 0; i < length; i++) {
                if (fromParts[i] !== toParts[i]) {
                  samePartsLength = i;
                  break;
                }
              }
              var outputParts = [];
              for (var i = samePartsLength; i < fromParts.length; i++) {
                outputParts.push("..");
              }
              outputParts = outputParts.concat(toParts.slice(samePartsLength));
              return outputParts.join("/");
            }
          };
          UTF8Decoder = globalThis.TextDecoder && new TextDecoder();
          findStringEnd = function findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul) {
            var maxIdx = idx + maxBytesToRead;
            if (ignoreNul) return maxIdx;
            while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
            return idx;
          };
          UTF8ArrayToString = function UTF8ArrayToString(heapOrArray) {
            var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var maxBytesToRead = arguments.length > 2 ? arguments[2] : undefined;
            var ignoreNul = arguments.length > 3 ? arguments[3] : undefined;
            var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
            if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
              return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
            }
            var str = "";
            while (idx < endPtr) {
              var u0 = heapOrArray[idx++];
              if (!(u0 & 128)) {
                str += String.fromCharCode(u0);
                continue;
              }
              var u1 = heapOrArray[idx++] & 63;
              if ((u0 & 224) == 192) {
                str += String.fromCharCode((u0 & 31) << 6 | u1);
                continue;
              }
              var u2 = heapOrArray[idx++] & 63;
              if ((u0 & 240) == 224) {
                u0 = (u0 & 15) << 12 | u1 << 6 | u2;
              } else {
                u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
              }
              if (u0 < 65536) {
                str += String.fromCharCode(u0);
              } else {
                var ch = u0 - 65536;
                str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
              }
            }
            return str;
          };
          FS_stdin_getChar_buffer = [];
          lengthBytesUTF8 = function lengthBytesUTF8(str) {
            var len = 0;
            for (var i = 0; i < str.length; ++i) {
              var c = str.charCodeAt(i);
              if (c <= 127) {
                len++;
              } else if (c <= 2047) {
                len += 2;
              } else if (c >= 55296 && c <= 57343) {
                len += 4;
                ++i;
              } else {
                len += 3;
              }
            }
            return len;
          };
          stringToUTF8Array = function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
            if (!(maxBytesToWrite > 0)) return 0;
            var startIdx = outIdx;
            var endIdx = outIdx + maxBytesToWrite - 1;
            for (var i = 0; i < str.length; ++i) {
              var u = str.codePointAt(i);
              if (u <= 127) {
                if (outIdx >= endIdx) break;
                heap[outIdx++] = u;
              } else if (u <= 2047) {
                if (outIdx + 1 >= endIdx) break;
                heap[outIdx++] = 192 | u >> 6;
                heap[outIdx++] = 128 | u & 63;
              } else if (u <= 65535) {
                if (outIdx + 2 >= endIdx) break;
                heap[outIdx++] = 224 | u >> 12;
                heap[outIdx++] = 128 | u >> 6 & 63;
                heap[outIdx++] = 128 | u & 63;
              } else {
                if (outIdx + 3 >= endIdx) break;
                heap[outIdx++] = 240 | u >> 18;
                heap[outIdx++] = 128 | u >> 12 & 63;
                heap[outIdx++] = 128 | u >> 6 & 63;
                heap[outIdx++] = 128 | u & 63;
                i++;
              }
            }
            heap[outIdx] = 0;
            return outIdx - startIdx;
          };
          intArrayFromString = function intArrayFromString(stringy, dontAddNull, length) {
            var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
            var u8array = new Array(len);
            var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
            if (dontAddNull) u8array.length = numBytesWritten;
            return u8array;
          };
          FS_stdin_getChar = function FS_stdin_getChar() {
            if (!FS_stdin_getChar_buffer.length) {
              var _globalThis$window;
              var result = null;
              if (ENVIRONMENT_IS_NODE) {
                var BUFSIZE = 256;
                var buf = Buffer.alloc(BUFSIZE);
                var bytesRead = 0;
                var fd = process.stdin.fd;
                try {
                  bytesRead = fs.readSync(fd, buf, 0, BUFSIZE);
                } catch (e) {
                  if (e.toString().includes("EOF")) bytesRead = 0;else throw e;
                }
                if (bytesRead > 0) {
                  result = buf.slice(0, bytesRead).toString("utf-8");
                }
              } else if ((_globalThis$window = globalThis.window) !== null && _globalThis$window !== void 0 && _globalThis$window.prompt) {
                result = window.prompt("Input: ");
                if (result !== null) {
                  result += "\n";
                }
              } else {}
              if (!result) {
                return null;
              }
              FS_stdin_getChar_buffer = intArrayFromString(result, true);
            }
            return FS_stdin_getChar_buffer.shift();
          };
          TTY = {
            ttys: [],
            init: function init() {},
            shutdown: function shutdown() {},
            register: function register(dev, ops) {
              TTY.ttys[dev] = {
                input: [],
                output: [],
                ops: ops
              };
              FS.registerDevice(dev, TTY.stream_ops);
            },
            stream_ops: {
              open: function open(stream) {
                var tty = TTY.ttys[stream.node.rdev];
                if (!tty) {
                  throw new FS.ErrnoError(43);
                }
                stream.tty = tty;
                stream.seekable = false;
              },
              close: function close(stream) {
                stream.tty.ops.fsync(stream.tty);
              },
              fsync: function fsync(stream) {
                stream.tty.ops.fsync(stream.tty);
              },
              read: function read(stream, buffer, offset, length, pos) {
                if (!stream.tty || !stream.tty.ops.get_char) {
                  throw new FS.ErrnoError(60);
                }
                var bytesRead = 0;
                for (var i = 0; i < length; i++) {
                  var result;
                  try {
                    result = stream.tty.ops.get_char(stream.tty);
                  } catch (e) {
                    throw new FS.ErrnoError(29);
                  }
                  if (result === undefined && !bytesRead) {
                    throw new FS.ErrnoError(6);
                  }
                  if (result === null || result === undefined) break;
                  bytesRead++;
                  buffer[offset + i] = result;
                }
                if (bytesRead) {
                  stream.node.atime = Date.now();
                }
                return bytesRead;
              },
              write: function write(stream, buffer, offset, length, pos) {
                if (!stream.tty || !stream.tty.ops.put_char) {
                  throw new FS.ErrnoError(60);
                }
                try {
                  for (var i = 0; i < length; i++) {
                    stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
                  }
                } catch (e) {
                  throw new FS.ErrnoError(29);
                }
                if (length) {
                  stream.node.mtime = stream.node.ctime = Date.now();
                }
                return i;
              }
            },
            default_tty_ops: {
              get_char: function get_char(tty) {
                return FS_stdin_getChar();
              },
              put_char: function put_char(tty, val) {
                if (val === null || val === 10) {
                  out(UTF8ArrayToString(tty.output));
                  tty.output = [];
                } else {
                  if (val != 0) tty.output.push(val);
                }
              },
              fsync: function fsync(tty) {
                var _tty$output;
                if (((_tty$output = tty.output) === null || _tty$output === void 0 ? void 0 : _tty$output.length) > 0) {
                  out(UTF8ArrayToString(tty.output));
                  tty.output = [];
                }
              },
              ioctl_tcgets: function ioctl_tcgets(tty) {
                return {
                  c_iflag: 25856,
                  c_oflag: 5,
                  c_cflag: 191,
                  c_lflag: 35387,
                  c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                };
              },
              ioctl_tcsets: function ioctl_tcsets(tty, optional_actions, data) {
                return 0;
              },
              ioctl_tiocgwinsz: function ioctl_tiocgwinsz(tty) {
                return [24, 80];
              }
            },
            default_tty1_ops: {
              put_char: function put_char(tty, val) {
                if (val === null || val === 10) {
                  err(UTF8ArrayToString(tty.output));
                  tty.output = [];
                } else {
                  if (val != 0) tty.output.push(val);
                }
              },
              fsync: function fsync(tty) {
                var _tty$output2;
                if (((_tty$output2 = tty.output) === null || _tty$output2 === void 0 ? void 0 : _tty$output2.length) > 0) {
                  err(UTF8ArrayToString(tty.output));
                  tty.output = [];
                }
              }
            }
          };
          zeroMemory = function zeroMemory(ptr, size) {
            return HEAPU8.fill(0, ptr, ptr + size);
          };
          alignMemory = function alignMemory(size, alignment) {
            return Math.ceil(size / alignment) * alignment;
          };
          mmapAlloc = function mmapAlloc(size) {
            size = alignMemory(size, 65536);
            var ptr = _emscripten_builtin_memalign(65536, size);
            if (ptr) zeroMemory(ptr, size);
            return ptr;
          };
          MEMFS = {
            ops_table: null,
            mount: function mount(_mount) {
              return MEMFS.createNode(null, "/", 16895, 0);
            },
            createNode: function createNode(parent, name, mode, dev) {
              if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
                throw new FS.ErrnoError(63);
              }
              MEMFS.ops_table || (MEMFS.ops_table = {
                dir: {
                  node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr,
                    lookup: MEMFS.node_ops.lookup,
                    mknod: MEMFS.node_ops.mknod,
                    rename: MEMFS.node_ops.rename,
                    unlink: MEMFS.node_ops.unlink,
                    rmdir: MEMFS.node_ops.rmdir,
                    readdir: MEMFS.node_ops.readdir,
                    symlink: MEMFS.node_ops.symlink
                  },
                  stream: {
                    llseek: MEMFS.stream_ops.llseek
                  }
                },
                file: {
                  node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr
                  },
                  stream: {
                    llseek: MEMFS.stream_ops.llseek,
                    read: MEMFS.stream_ops.read,
                    write: MEMFS.stream_ops.write,
                    mmap: MEMFS.stream_ops.mmap,
                    msync: MEMFS.stream_ops.msync
                  }
                },
                link: {
                  node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr,
                    readlink: MEMFS.node_ops.readlink
                  },
                  stream: {}
                },
                chrdev: {
                  node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr
                  },
                  stream: FS.chrdev_stream_ops
                }
              });
              var node = FS.createNode(parent, name, mode, dev);
              if (FS.isDir(node.mode)) {
                node.node_ops = MEMFS.ops_table.dir.node;
                node.stream_ops = MEMFS.ops_table.dir.stream;
                node.contents = {};
              } else if (FS.isFile(node.mode)) {
                var _MEMFS$emptyFileConte;
                node.node_ops = MEMFS.ops_table.file.node;
                node.stream_ops = MEMFS.ops_table.file.stream;
                node.usedBytes = 0;
                node.contents = (_MEMFS$emptyFileConte = MEMFS.emptyFileContents) !== null && _MEMFS$emptyFileConte !== void 0 ? _MEMFS$emptyFileConte : MEMFS.emptyFileContents = new Uint8Array(0);
              } else if (FS.isLink(node.mode)) {
                node.node_ops = MEMFS.ops_table.link.node;
                node.stream_ops = MEMFS.ops_table.link.stream;
              } else if (FS.isChrdev(node.mode)) {
                node.node_ops = MEMFS.ops_table.chrdev.node;
                node.stream_ops = MEMFS.ops_table.chrdev.stream;
              }
              node.atime = node.mtime = node.ctime = Date.now();
              if (parent) {
                parent.contents[name] = node;
                parent.atime = parent.mtime = parent.ctime = node.atime;
              }
              return node;
            },
            getFileDataAsTypedArray: function getFileDataAsTypedArray(node) {
              return node.contents.subarray(0, node.usedBytes);
            },
            expandFileStorage: function expandFileStorage(node, newCapacity) {
              var prevCapacity = node.contents.length;
              if (prevCapacity >= newCapacity) return;
              var CAPACITY_DOUBLING_MAX = 1024 * 1024;
              newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
              if (prevCapacity) newCapacity = Math.max(newCapacity, 256);
              var oldContents = MEMFS.getFileDataAsTypedArray(node);
              node.contents = new Uint8Array(newCapacity);
              node.contents.set(oldContents);
            },
            resizeFileStorage: function resizeFileStorage(node, newSize) {
              if (node.usedBytes == newSize) return;
              var oldContents = node.contents;
              node.contents = new Uint8Array(newSize);
              node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
              node.usedBytes = newSize;
            },
            node_ops: {
              getattr: function getattr(node) {
                var attr = {};
                attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
                attr.ino = node.id;
                attr.mode = node.mode;
                attr.nlink = 1;
                attr.uid = 0;
                attr.gid = 0;
                attr.rdev = node.rdev;
                if (FS.isDir(node.mode)) {
                  attr.size = 4096;
                } else if (FS.isFile(node.mode)) {
                  attr.size = node.usedBytes;
                } else if (FS.isLink(node.mode)) {
                  attr.size = node.link.length;
                } else {
                  attr.size = 0;
                }
                attr.atime = new Date(node.atime);
                attr.mtime = new Date(node.mtime);
                attr.ctime = new Date(node.ctime);
                attr.blksize = 4096;
                attr.blocks = Math.ceil(attr.size / attr.blksize);
                return attr;
              },
              setattr: function setattr(node, attr) {
                for (var _i = 0, _arr = ["mode", "atime", "mtime", "ctime"]; _i < _arr.length; _i++) {
                  var key = _arr[_i];
                  if (attr[key] != null) {
                    node[key] = attr[key];
                  }
                }
                if (attr.size !== undefined) {
                  MEMFS.resizeFileStorage(node, attr.size);
                }
              },
              lookup: function lookup(parent, name) {
                if (!MEMFS.doesNotExistError) {
                  MEMFS.doesNotExistError = new FS.ErrnoError(44);
                  MEMFS.doesNotExistError.stack = "<generic error, no stack>";
                }
                throw MEMFS.doesNotExistError;
              },
              mknod: function mknod(parent, name, mode, dev) {
                return MEMFS.createNode(parent, name, mode, dev);
              },
              rename: function rename(old_node, new_dir, new_name) {
                var new_node;
                try {
                  new_node = FS.lookupNode(new_dir, new_name);
                } catch (e) {}
                if (new_node) {
                  if (FS.isDir(old_node.mode)) {
                    for (var i in new_node.contents) {
                      throw new FS.ErrnoError(55);
                    }
                  }
                  FS.hashRemoveNode(new_node);
                }
                delete old_node.parent.contents[old_node.name];
                new_dir.contents[new_name] = old_node;
                old_node.name = new_name;
                new_dir.ctime = new_dir.mtime = old_node.parent.ctime = old_node.parent.mtime = Date.now();
              },
              unlink: function unlink(parent, name) {
                delete parent.contents[name];
                parent.ctime = parent.mtime = Date.now();
              },
              rmdir: function rmdir(parent, name) {
                var node = FS.lookupNode(parent, name);
                for (var i in node.contents) {
                  throw new FS.ErrnoError(55);
                }
                delete parent.contents[name];
                parent.ctime = parent.mtime = Date.now();
              },
              readdir: function readdir(node) {
                return [".", ".."].concat(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3___default()(Object.keys(node.contents)));
              },
              symlink: function symlink(parent, newname, oldpath) {
                var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
                node.link = oldpath;
                return node;
              },
              readlink: function readlink(node) {
                if (!FS.isLink(node.mode)) {
                  throw new FS.ErrnoError(28);
                }
                return node.link;
              }
            },
            stream_ops: {
              read: function read(stream, buffer, offset, length, position) {
                var contents = stream.node.contents;
                if (position >= stream.node.usedBytes) return 0;
                var size = Math.min(stream.node.usedBytes - position, length);
                buffer.set(contents.subarray(position, position + size), offset);
                return size;
              },
              write: function write(stream, buffer, offset, length, position, canOwn) {
                if (buffer.buffer === HEAP8.buffer) {
                  canOwn = false;
                }
                if (!length) return 0;
                var node = stream.node;
                node.mtime = node.ctime = Date.now();
                if (canOwn) {
                  node.contents = buffer.subarray(offset, offset + length);
                  node.usedBytes = length;
                } else if (!node.usedBytes && !position) {
                  node.contents = buffer.slice(offset, offset + length);
                  node.usedBytes = length;
                } else {
                  MEMFS.expandFileStorage(node, position + length);
                  node.contents.set(buffer.subarray(offset, offset + length), position);
                  node.usedBytes = Math.max(node.usedBytes, position + length);
                }
                return length;
              },
              llseek: function llseek(stream, offset, whence) {
                var position = offset;
                if (whence === 1) {
                  position += stream.position;
                } else if (whence === 2) {
                  if (FS.isFile(stream.node.mode)) {
                    position += stream.node.usedBytes;
                  }
                }
                if (position < 0) {
                  throw new FS.ErrnoError(28);
                }
                return position;
              },
              mmap: function mmap(stream, length, position, prot, flags) {
                if (!FS.isFile(stream.node.mode)) {
                  throw new FS.ErrnoError(43);
                }
                var ptr;
                var allocated;
                var contents = stream.node.contents;
                if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
                  allocated = false;
                  ptr = contents.byteOffset;
                } else {
                  allocated = true;
                  ptr = mmapAlloc(length);
                  if (!ptr) {
                    throw new FS.ErrnoError(48);
                  }
                  if (contents) {
                    if (position > 0 || position + length < contents.length) {
                      if (contents.subarray) {
                        contents = contents.subarray(position, position + length);
                      } else {
                        contents = Array.prototype.slice.call(contents, position, position + length);
                      }
                    }
                    HEAP8.set(contents, ptr);
                  }
                }
                return {
                  ptr: ptr,
                  allocated: allocated
                };
              },
              msync: function msync(stream, buffer, offset, length, mmapFlags) {
                MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
                return 0;
              }
            }
          };
          FS_modeStringToFlags = function FS_modeStringToFlags(str) {
            if (typeof str != "string") return str;
            var flagModes = {
              r: 0,
              "r+": 2,
              w: 512 | 64 | 1,
              "w+": 512 | 64 | 2,
              a: 1024 | 64 | 1,
              "a+": 1024 | 64 | 2
            };
            var flags = flagModes[str];
            if (typeof flags == "undefined") {
              throw new Error("Unknown file open mode: ".concat(str));
            }
            return flags;
          };
          FS_fileDataToTypedArray = function FS_fileDataToTypedArray(data) {
            if (typeof data == "string") {
              data = intArrayFromString(data, true);
            }
            if (!data.subarray) {
              data = new Uint8Array(data);
            }
            return data;
          };
          FS_getMode = function FS_getMode(canRead, canWrite) {
            var mode = 0;
            if (canRead) mode |= 292 | 73;
            if (canWrite) mode |= 146;
            return mode;
          };
          IDBFS = {
            dbs: {},
            indexedDB: function (_indexedDB) {
              function indexedDB() {
                return _indexedDB.apply(this, arguments);
              }
              indexedDB.toString = function () {
                return _indexedDB.toString();
              };
              return indexedDB;
            }(function () {
              return indexedDB;
            }),
            DB_VERSION: 21,
            DB_STORE_NAME: "FILE_DATA",
            queuePersist: function queuePersist(mount) {
              function onPersistComplete() {
                if (mount.idbPersistState === "again") startPersist();else {
                  var _IDBFS$onAutoPersistS;
                  mount.idbPersistState = 0;
                  (_IDBFS$onAutoPersistS = IDBFS.onAutoPersistStateChanged) === null || _IDBFS$onAutoPersistS === void 0 || _IDBFS$onAutoPersistS.call(IDBFS, false);
                }
              }
              function startPersist() {
                var _IDBFS$onAutoPersistS2;
                mount.idbPersistState = "idb";
                (_IDBFS$onAutoPersistS2 = IDBFS.onAutoPersistStateChanged) === null || _IDBFS$onAutoPersistS2 === void 0 || _IDBFS$onAutoPersistS2.call(IDBFS, true);
                IDBFS.syncfs(mount, false, onPersistComplete);
              }
              if (!mount.idbPersistState) {
                mount.idbPersistState = setTimeout(startPersist, 0);
              } else if (mount.idbPersistState === "idb") {
                mount.idbPersistState = "again";
              }
            },
            mount: function mount(_mount2) {
              var _mount2$opts;
              var mnt = MEMFS.mount(_mount2);
              if (_mount2 !== null && _mount2 !== void 0 && (_mount2$opts = _mount2.opts) !== null && _mount2$opts !== void 0 && _mount2$opts.autoPersist) {
                _mount2.idbPersistState = 0;
                var memfs_node_ops = mnt.node_ops;
                mnt.node_ops = _objectSpread({}, mnt.node_ops);
                mnt.node_ops.mknod = function (parent, name, mode, dev) {
                  var node = memfs_node_ops.mknod(parent, name, mode, dev);
                  node.node_ops = mnt.node_ops;
                  node.idbfs_mount = mnt.mount;
                  node.memfs_stream_ops = node.stream_ops;
                  node.stream_ops = _objectSpread({}, node.stream_ops);
                  node.stream_ops.write = function (stream, buffer, offset, length, position, canOwn) {
                    stream.node.isModified = true;
                    return node.memfs_stream_ops.write(stream, buffer, offset, length, position, canOwn);
                  };
                  node.stream_ops.close = function (stream) {
                    var n = stream.node;
                    if (n.isModified) {
                      IDBFS.queuePersist(n.idbfs_mount);
                      n.isModified = false;
                    }
                    if (n.memfs_stream_ops.close) return n.memfs_stream_ops.close(stream);
                  };
                  IDBFS.queuePersist(mnt.mount);
                  return node;
                };
                mnt.node_ops.rmdir = function () {
                  return IDBFS.queuePersist(mnt.mount), memfs_node_ops.rmdir.apply(memfs_node_ops, arguments);
                };
                mnt.node_ops.symlink = function () {
                  return IDBFS.queuePersist(mnt.mount), memfs_node_ops.symlink.apply(memfs_node_ops, arguments);
                };
                mnt.node_ops.unlink = function () {
                  return IDBFS.queuePersist(mnt.mount), memfs_node_ops.unlink.apply(memfs_node_ops, arguments);
                };
                mnt.node_ops.rename = function () {
                  return IDBFS.queuePersist(mnt.mount), memfs_node_ops.rename.apply(memfs_node_ops, arguments);
                };
              }
              return mnt;
            },
            syncfs: function syncfs(mount, populate, callback) {
              IDBFS.getLocalSet(mount, function (err, local) {
                if (err) return callback(err);
                IDBFS.getRemoteSet(mount, function (err, remote) {
                  if (err) return callback(err);
                  var src = populate ? remote : local;
                  var dst = populate ? local : remote;
                  IDBFS.reconcile(src, dst, callback);
                });
              });
            },
            quit: function quit() {
              for (var _i2 = 0, _Object$values = Object.values(IDBFS.dbs); _i2 < _Object$values.length; _i2++) {
                var value = _Object$values[_i2];
                value.close();
              }
              IDBFS.dbs = {};
            },
            getDB: function getDB(name, callback) {
              var db = IDBFS.dbs[name];
              if (db) {
                return callback(null, db);
              }
              var req;
              try {
                req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
              } catch (e) {
                return callback(e);
              }
              if (!req) {
                return callback("Unable to connect to IndexedDB");
              }
              req.onupgradeneeded = function (e) {
                var db = e.target.result;
                var transaction = e.target.transaction;
                var fileStore;
                if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
                  fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
                } else {
                  fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
                }
                if (!fileStore.indexNames.contains("timestamp")) {
                  fileStore.createIndex("timestamp", "timestamp", {
                    unique: false
                  });
                }
              };
              req.onsuccess = function () {
                db = req.result;
                IDBFS.dbs[name] = db;
                callback(null, db);
              };
              req.onerror = function (e) {
                callback(e.target.error);
                e.preventDefault();
              };
            },
            getLocalSet: function getLocalSet(mount, callback) {
              var entries = {};
              function isRealDir(p) {
                return p !== "." && p !== "..";
              }
              function toAbsolute(root) {
                return function (p) {
                  return PATH.join2(root, p);
                };
              }
              var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
              while (check.length) {
                var path = check.pop();
                var stat;
                try {
                  stat = FS.lstat(path);
                } catch (e) {
                  return callback(e);
                }
                if (FS.isDir(stat.mode)) {
                  check.push.apply(check, _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3___default()(FS.readdir(path).filter(isRealDir).map(toAbsolute(path))));
                }
                entries[path] = {
                  timestamp: stat.mtime
                };
              }
              return callback(null, {
                type: "local",
                entries: entries
              });
            },
            getRemoteSet: function getRemoteSet(mount, callback) {
              var entries = {};
              IDBFS.getDB(mount.mountpoint, function (err, db) {
                if (err) return callback(err);
                try {
                  var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readonly");
                  transaction.onerror = function (e) {
                    callback(e.target.error);
                    e.preventDefault();
                  };
                  var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
                  var index = store.index("timestamp");
                  index.openKeyCursor().onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (!cursor) {
                      return callback(null, {
                        type: "remote",
                        db: db,
                        entries: entries
                      });
                    }
                    entries[cursor.primaryKey] = {
                      timestamp: cursor.key
                    };
                    cursor["continue"]();
                  };
                } catch (e) {
                  return callback(e);
                }
              });
            },
            loadLocalEntry: function loadLocalEntry(path, callback) {
              var stat, node;
              try {
                var lookup = FS.lookupPath(path);
                node = lookup.node;
                stat = FS.lstat(path);
              } catch (e) {
                return callback(e);
              }
              if (FS.isDir(stat.mode)) {
                return callback(null, {
                  timestamp: stat.mtime,
                  mode: stat.mode
                });
              } else if (FS.isLink(stat.mode)) {
                return callback(null, {
                  timestamp: stat.mtime,
                  mode: stat.mode,
                  link: node.link
                });
              } else if (FS.isFile(stat.mode)) {
                node.contents = MEMFS.getFileDataAsTypedArray(node);
                return callback(null, {
                  timestamp: stat.mtime,
                  mode: stat.mode,
                  contents: node.contents
                });
              } else {
                return callback(new Error("node type not supported"));
              }
            },
            storeLocalEntry: function storeLocalEntry(path, entry, callback) {
              try {
                if (FS.isDir(entry["mode"])) {
                  FS.mkdirTree(path, entry["mode"]);
                } else if (FS.isLink(entry["mode"])) {
                  FS.symlink(entry["link"], path);
                } else if (FS.isFile(entry["mode"])) {
                  FS.writeFile(path, entry["contents"], {
                    canOwn: true
                  });
                } else {
                  return callback(new Error("node type not supported"));
                }
                FS.chmod(path, entry["mode"]);
                FS.utime(path, entry["timestamp"], entry["timestamp"]);
              } catch (e) {
                return callback(e);
              }
              callback(null);
            },
            removeLocalEntry: function removeLocalEntry(path, callback) {
              try {
                var stat = FS.lstat(path);
                if (FS.isDir(stat.mode)) {
                  FS.rmdir(path);
                } else {
                  FS.unlink(path);
                }
              } catch (e) {
                return callback(e);
              }
              callback(null);
            },
            loadRemoteEntry: function loadRemoteEntry(store, path, callback) {
              var req = store.get(path);
              req.onsuccess = function (event) {
                return callback(null, event.target.result);
              };
              req.onerror = function (e) {
                callback(e.target.error);
                e.preventDefault();
              };
            },
            storeRemoteEntry: function storeRemoteEntry(store, path, entry, callback) {
              try {
                var req = store.put(entry, path);
              } catch (e) {
                callback(e);
                return;
              }
              req.onsuccess = function (event) {
                return callback();
              };
              req.onerror = function (e) {
                callback(e.target.error);
                e.preventDefault();
              };
            },
            removeRemoteEntry: function removeRemoteEntry(store, path, callback) {
              var req = store["delete"](path);
              req.onsuccess = function (event) {
                return callback();
              };
              req.onerror = function (e) {
                callback(e.target.error);
                e.preventDefault();
              };
            },
            reconcile: function reconcile(src, dst, callback) {
              var total = 0;
              var create = [];
              for (var _i3 = 0, _Object$entries = Object.entries(src.entries); _i3 < _Object$entries.length; _i3++) {
                var _Object$entries$_i = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_Object$entries[_i3], 2),
                  key = _Object$entries$_i[0],
                  e = _Object$entries$_i[1];
                var e2 = dst.entries[key];
                if (!e2 || e["timestamp"].getTime() != e2["timestamp"].getTime()) {
                  create.push(key);
                  total++;
                }
              }
              var remove = [];
              for (var _i4 = 0, _Object$keys = Object.keys(dst.entries); _i4 < _Object$keys.length; _i4++) {
                var key = _Object$keys[_i4];
                if (!src.entries[key]) {
                  remove.push(key);
                  total++;
                }
              }
              if (!total) {
                return callback(null);
              }
              var errored = false;
              var db = src.type === "remote" ? src.db : dst.db;
              var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readwrite");
              var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
              function done(err) {
                if (err && !errored) {
                  errored = true;
                  return callback(err);
                }
              }
              transaction.onerror = transaction.onabort = function (e) {
                done(e.target.error);
                e.preventDefault();
              };
              transaction.oncomplete = function (e) {
                if (!errored) {
                  callback(null);
                }
              };
              var _iterator = _createForOfIteratorHelper(create.sort()),
                _step;
              try {
                var _loop = function _loop() {
                  var path = _step.value;
                  if (dst.type === "local") {
                    IDBFS.loadRemoteEntry(store, path, function (err, entry) {
                      if (err) return done(err);
                      IDBFS.storeLocalEntry(path, entry, done);
                    });
                  } else {
                    IDBFS.loadLocalEntry(path, function (err, entry) {
                      if (err) return done(err);
                      IDBFS.storeRemoteEntry(store, path, entry, done);
                    });
                  }
                };
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  _loop();
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              var _iterator2 = _createForOfIteratorHelper(remove.sort().reverse()),
                _step2;
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var path = _step2.value;
                  if (dst.type === "local") {
                    IDBFS.removeLocalEntry(path, done);
                  } else {
                    IDBFS.removeRemoteEntry(store, path, done);
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
            }
          };
          WORKERFS = {
            DIR_MODE: 16895,
            FILE_MODE: 33279,
            reader: null,
            mount: function mount(_mount3) {
              var _WORKERFS$reader;
              assert(ENVIRONMENT_IS_WORKER);
              (_WORKERFS$reader = WORKERFS.reader) !== null && _WORKERFS$reader !== void 0 ? _WORKERFS$reader : WORKERFS.reader = new FileReaderSync();
              var root = WORKERFS.createNode(null, "/", WORKERFS.DIR_MODE, 0);
              var createdParents = {};
              function ensureParent(path) {
                var parts = path.split("/");
                var parent = root;
                for (var i = 0; i < parts.length - 1; i++) {
                  var _curr;
                  var curr = parts.slice(0, i + 1).join("/");
                  createdParents[_curr = curr] || (createdParents[_curr] = WORKERFS.createNode(parent, parts[i], WORKERFS.DIR_MODE, 0));
                  parent = createdParents[curr];
                }
                return parent;
              }
              function base(path) {
                var parts = path.split("/");
                return parts[parts.length - 1];
              }
              var _iterator3 = _createForOfIteratorHelper(_mount3.opts["files"] || []),
                _step3;
              try {
                for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                  var file = _step3.value;
                  WORKERFS.createNode(ensureParent(file.name), base(file.name), WORKERFS.FILE_MODE, 0, file, file.lastModifiedDate);
                }
              } catch (err) {
                _iterator3.e(err);
              } finally {
                _iterator3.f();
              }
              var _iterator4 = _createForOfIteratorHelper(_mount3.opts["blobs"] || []),
                _step4;
              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  var obj = _step4.value;
                  WORKERFS.createNode(ensureParent(obj["name"]), base(obj["name"]), WORKERFS.FILE_MODE, 0, obj["data"]);
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }
              var _iterator5 = _createForOfIteratorHelper(_mount3.opts["packages"] || []),
                _step5;
              try {
                for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                  var pack = _step5.value;
                  var _iterator6 = _createForOfIteratorHelper(pack["metadata"].files),
                    _step6;
                  try {
                    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                      var file = _step6.value;
                      var name = file.filename.slice(1);
                      WORKERFS.createNode(ensureParent(name), base(name), WORKERFS.FILE_MODE, 0, pack["blob"].slice(file.start, file.end));
                    }
                  } catch (err) {
                    _iterator6.e(err);
                  } finally {
                    _iterator6.f();
                  }
                }
              } catch (err) {
                _iterator5.e(err);
              } finally {
                _iterator5.f();
              }
              return root;
            },
            createNode: function createNode(parent, name, mode, dev, contents, mtime) {
              var node = FS.createNode(parent, name, mode);
              node.mode = mode;
              node.node_ops = WORKERFS.node_ops;
              node.stream_ops = WORKERFS.stream_ops;
              node.atime = node.mtime = node.ctime = (mtime || new Date()).getTime();
              assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE);
              if (mode === WORKERFS.FILE_MODE) {
                node.size = contents.size;
                node.contents = contents;
              } else {
                node.size = 4096;
                node.contents = {};
              }
              if (parent) {
                parent.contents[name] = node;
              }
              return node;
            },
            node_ops: {
              getattr: function getattr(node) {
                return {
                  dev: 1,
                  ino: node.id,
                  mode: node.mode,
                  nlink: 1,
                  uid: 0,
                  gid: 0,
                  rdev: 0,
                  size: node.size,
                  atime: new Date(node.atime),
                  mtime: new Date(node.mtime),
                  ctime: new Date(node.ctime),
                  blksize: 4096,
                  blocks: Math.ceil(node.size / 4096)
                };
              },
              setattr: function setattr(node, attr) {
                for (var _i5 = 0, _arr2 = ["mode", "atime", "mtime", "ctime"]; _i5 < _arr2.length; _i5++) {
                  var key = _arr2[_i5];
                  if (attr[key] != null) {
                    node[key] = attr[key];
                  }
                }
              },
              lookup: function lookup(parent, name) {
                throw new FS.ErrnoError(44);
              },
              mknod: function mknod(parent, name, mode, dev) {
                throw new FS.ErrnoError(63);
              },
              rename: function rename(oldNode, newDir, newName) {
                throw new FS.ErrnoError(63);
              },
              unlink: function unlink(parent, name) {
                throw new FS.ErrnoError(63);
              },
              rmdir: function rmdir(parent, name) {
                throw new FS.ErrnoError(63);
              },
              readdir: function readdir(node) {
                var entries = [".", ".."];
                for (var _i6 = 0, _Object$keys2 = Object.keys(node.contents); _i6 < _Object$keys2.length; _i6++) {
                  var key = _Object$keys2[_i6];
                  entries.push(key);
                }
                return entries;
              },
              symlink: function symlink(parent, newName, oldPath) {
                throw new FS.ErrnoError(63);
              }
            },
            stream_ops: {
              read: function read(stream, buffer, offset, length, position) {
                if (position >= stream.node.size) return 0;
                var chunk = stream.node.contents.slice(position, position + length);
                var ab = WORKERFS.reader.readAsArrayBuffer(chunk);
                buffer.set(new Uint8Array(ab), offset);
                return chunk.size;
              },
              write: function write(stream, buffer, offset, length, position) {
                throw new FS.ErrnoError(29);
              },
              llseek: function llseek(stream, offset, whence) {
                var position = offset;
                if (whence === 1) {
                  position += stream.position;
                } else if (whence === 2) {
                  if (FS.isFile(stream.node.mode)) {
                    position += stream.node.size;
                  }
                }
                if (position < 0) {
                  throw new FS.ErrnoError(28);
                }
                return position;
              }
            }
          };
          asyncLoad = /*#__PURE__*/function () {
            var _ref4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_9___default()(/*#__PURE__*/_regenerator().m(function _callee3(url) {
              var arrayBuffer;
              return _regenerator().w(function (_context3) {
                while (1) switch (_context3.n) {
                  case 0:
                    _context3.n = 1;
                    return readAsync(url);
                  case 1:
                    arrayBuffer = _context3.v;
                    return _context3.a(2, new Uint8Array(arrayBuffer));
                }
              }, _callee3);
            }));
            return function asyncLoad(_x9) {
              return _ref4.apply(this, arguments);
            };
          }();
          FS_createDataFile = function FS_createDataFile() {
            return FS.createDataFile.apply(FS, arguments);
          };
          getUniqueRunDependency = function getUniqueRunDependency(id) {
            return id;
          };
          dependenciesPromise = null;
          resolveRunDependencies = /*#__PURE__*/function () {
            var _ref5 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_9___default()(/*#__PURE__*/_regenerator().m(function _callee4() {
              return _regenerator().w(function (_context4) {
                while (1) switch (_context4.n) {
                  case 0:
                    return _context4.a(2, dependenciesPromise);
                }
              }, _callee4);
            }));
            return function resolveRunDependencies() {
              return _ref5.apply(this, arguments);
            };
          }();
          runDependencies = 0;
          dependenciesPromiseResolve = null;
          removeRunDependency = function removeRunDependency(id) {
            var _Module$monitorRunDep;
            runDependencies--;
            (_Module$monitorRunDep = Module["monitorRunDependencies"]) === null || _Module$monitorRunDep === void 0 || _Module$monitorRunDep.call(Module, runDependencies);
            if (!runDependencies) {
              dependenciesPromiseResolve();
            }
          };
          addRunDependency = function addRunDependency(id) {
            var _Module$monitorRunDep2;
            if (!runDependencies) {
              dependenciesPromise = new Promise(function (resolve) {
                return dependenciesPromiseResolve = resolve;
              });
            }
            runDependencies++;
            (_Module$monitorRunDep2 = Module["monitorRunDependencies"]) === null || _Module$monitorRunDep2 === void 0 || _Module$monitorRunDep2.call(Module, runDependencies);
          };
          preloadPlugins = [];
          FS_handledByPreloadPlugin = /*#__PURE__*/function () {
            var _ref6 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_9___default()(/*#__PURE__*/_regenerator().m(function _callee5(byteArray, fullname) {
              var _i7, _preloadPlugins, plugin;
              return _regenerator().w(function (_context5) {
                while (1) switch (_context5.n) {
                  case 0:
                    if (typeof Browser != "undefined") Browser.init();
                    _i7 = 0, _preloadPlugins = preloadPlugins;
                  case 1:
                    if (!(_i7 < _preloadPlugins.length)) {
                      _context5.n = 3;
                      break;
                    }
                    plugin = _preloadPlugins[_i7];
                    if (!plugin["canHandle"](fullname)) {
                      _context5.n = 2;
                      break;
                    }
                    return _context5.a(2, plugin["handle"](byteArray, fullname));
                  case 2:
                    _i7++;
                    _context5.n = 1;
                    break;
                  case 3:
                    return _context5.a(2, byteArray);
                }
              }, _callee5);
            }));
            return function FS_handledByPreloadPlugin(_x0, _x1) {
              return _ref6.apply(this, arguments);
            };
          }();
          FS_preloadFile = /*#__PURE__*/function () {
            var _ref7 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_9___default()(/*#__PURE__*/_regenerator().m(function _callee6(parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish) {
              var fullname, dep, byteArray;
              return _regenerator().w(function (_context6) {
                while (1) switch (_context6.p = _context6.n) {
                  case 0:
                    fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
                    dep = getUniqueRunDependency("cp ".concat(fullname));
                    addRunDependency(dep);
                    _context6.p = 1;
                    byteArray = url;
                    if (!(typeof url == "string")) {
                      _context6.n = 3;
                      break;
                    }
                    _context6.n = 2;
                    return asyncLoad(url);
                  case 2:
                    byteArray = _context6.v;
                  case 3:
                    _context6.n = 4;
                    return FS_handledByPreloadPlugin(byteArray, fullname);
                  case 4:
                    byteArray = _context6.v;
                    preFinish === null || preFinish === void 0 || preFinish();
                    if (!dontCreateFile) {
                      FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
                    }
                  case 5:
                    _context6.p = 5;
                    removeRunDependency(dep);
                    return _context6.f(5);
                  case 6:
                    return _context6.a(2);
                }
              }, _callee6, null, [[1,, 5, 6]]);
            }));
            return function FS_preloadFile(_x10, _x11, _x12, _x13, _x14, _x15, _x16, _x17) {
              return _ref7.apply(this, arguments);
            };
          }();
          FS_createPreloadedFile = function FS_createPreloadedFile(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
            FS_preloadFile(parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish).then(onload)["catch"](onerror);
          };
          FS = {
            root: null,
            mounts: [],
            devices: {},
            streams: [],
            nextInode: 1,
            nameTable: null,
            currentPath: "/",
            initialized: false,
            ignorePermissions: true,
            filesystems: null,
            syncFSRequests: 0,
            ErrnoError: /*#__PURE__*/_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_7___default()(function ErrnoError(errno) {
              _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_8___default()(this, ErrnoError);
              _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "name", "ErrnoError");
              this.errno = errno;
            }),
            FSStream: /*#__PURE__*/function () {
              function FSStream() {
                _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_8___default()(this, FSStream);
                _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "shared", {});
              }
              return _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_7___default()(FSStream, [{
                key: "object",
                get: function get() {
                  return this.node;
                },
                set: function set(val) {
                  this.node = val;
                }
              }, {
                key: "isRead",
                get: function get() {
                  return (this.flags & 2097155) !== 1;
                }
              }, {
                key: "isWrite",
                get: function get() {
                  return (this.flags & 2097155) !== 0;
                }
              }, {
                key: "isAppend",
                get: function get() {
                  return this.flags & 1024;
                }
              }, {
                key: "flags",
                get: function get() {
                  return this.shared.flags;
                },
                set: function set(val) {
                  this.shared.flags = val;
                }
              }, {
                key: "position",
                get: function get() {
                  return this.shared.position;
                },
                set: function set(val) {
                  this.shared.position = val;
                }
              }]);
            }(),
            FSNode: /*#__PURE__*/function () {
              function FSNode(parent, name, mode, rdev) {
                _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_8___default()(this, FSNode);
                _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "node_ops", {});
                _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "stream_ops", {});
                _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "readMode", 292 | 73);
                _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "writeMode", 146);
                _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "mounted", null);
                if (!parent) {
                  parent = this;
                }
                this.parent = parent;
                this.mount = parent.mount;
                this.id = FS.nextInode++;
                this.name = name;
                this.mode = mode;
                this.rdev = rdev;
                this.atime = this.mtime = this.ctime = Date.now();
              }
              return _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_7___default()(FSNode, [{
                key: "read",
                get: function get() {
                  return (this.mode & this.readMode) === this.readMode;
                },
                set: function set(val) {
                  val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
                }
              }, {
                key: "write",
                get: function get() {
                  return (this.mode & this.writeMode) === this.writeMode;
                },
                set: function set(val) {
                  val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
                }
              }, {
                key: "isFolder",
                get: function get() {
                  return FS.isDir(this.mode);
                }
              }, {
                key: "isDevice",
                get: function get() {
                  return FS.isChrdev(this.mode);
                }
              }, {
                key: "addListener",
                value: function addListener(cb) {
                  var _this$listeners;
                  var exclusive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                  var entry = {
                    cb: cb,
                    exclusive: exclusive
                  };
                  var listeners = (_this$listeners = this.listeners) !== null && _this$listeners !== void 0 ? _this$listeners : this.listeners = new Set();
                  listeners.add(entry);
                  return {
                    listeners: listeners,
                    entry: entry
                  };
                }
              }, {
                key: "notifyListeners",
                value: function notifyListeners(flags) {
                  if (!this.listeners) return;
                  var excl;
                  var _iterator7 = _createForOfIteratorHelper(this.listeners),
                    _step7;
                  try {
                    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                      var entry = _step7.value;
                      if (entry.exclusive) (excl || (excl = [])).push(entry);else entry.cb(flags);
                    }
                  } catch (err) {
                    _iterator7.e(err);
                  } finally {
                    _iterator7.f();
                  }
                  if (excl) {
                    var i = (this.exclTurn || 0) % excl.length;
                    this.exclTurn = i + 1;
                    excl[i].cb(flags);
                  }
                }
              }]);
            }(),
            lookupPath: function lookupPath(path) {
              var _opts$follow_mount;
              var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
              if (!path) {
                throw new FS.ErrnoError(44);
              }
              (_opts$follow_mount = opts.follow_mount) !== null && _opts$follow_mount !== void 0 ? _opts$follow_mount : opts.follow_mount = true;
              if (!PATH.isAbs(path)) {
                path = FS.cwd() + "/" + path;
              }
              linkloop: for (var nlinks = 0; nlinks < 40; nlinks++) {
                var parts = path.split("/").filter(function (p) {
                  return !!p;
                });
                var current = FS.root;
                var current_path = "/";
                for (var i = 0; i < parts.length; i++) {
                  var islast = i === parts.length - 1;
                  if (islast && opts.parent) {
                    break;
                  }
                  if (parts[i] === ".") {
                    continue;
                  }
                  if (parts[i] === "..") {
                    current_path = PATH.dirname(current_path);
                    if (FS.isRoot(current)) {
                      path = current_path + "/" + parts.slice(i + 1).join("/");
                      nlinks--;
                      continue linkloop;
                    } else {
                      current = current.parent;
                    }
                    continue;
                  }
                  current_path = PATH.join2(current_path, parts[i]);
                  try {
                    current = FS.lookupNode(current, parts[i]);
                  } catch (e) {
                    if ((e === null || e === void 0 ? void 0 : e.errno) === 44 && islast && opts.noent_okay) {
                      return {
                        path: current_path
                      };
                    }
                    throw e;
                  }
                  if (FS.isMountpoint(current) && (!islast || opts.follow_mount)) {
                    current = current.mounted.root;
                  }
                  if (FS.isLink(current.mode) && (!islast || opts.follow)) {
                    if (!current.node_ops.readlink) {
                      throw new FS.ErrnoError(52);
                    }
                    var link = current.node_ops.readlink(current);
                    if (!PATH.isAbs(link)) {
                      link = PATH.dirname(current_path) + "/" + link;
                    }
                    path = link + "/" + parts.slice(i + 1).join("/");
                    continue linkloop;
                  }
                }
                return {
                  path: current_path,
                  node: current
                };
              }
              throw new FS.ErrnoError(32);
            },
            getPath: function getPath(node) {
              var path;
              while (true) {
                if (FS.isRoot(node)) {
                  var mount = node.mount.mountpoint;
                  if (!path) return mount;
                  return mount[mount.length - 1] !== "/" ? "".concat(mount, "/").concat(path) : mount + path;
                }
                path = path ? "".concat(node.name, "/").concat(path) : node.name;
                node = node.parent;
              }
            },
            hashName: function hashName(parentid, name) {
              var hash = 0;
              for (var i = 0; i < name.length; i++) {
                hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
              }
              return (parentid + hash >>> 0) % FS.nameTable.length;
            },
            hashAddNode: function hashAddNode(node) {
              var hash = FS.hashName(node.parent.id, node.name);
              node.name_next = FS.nameTable[hash];
              FS.nameTable[hash] = node;
            },
            hashRemoveNode: function hashRemoveNode(node) {
              var hash = FS.hashName(node.parent.id, node.name);
              if (FS.nameTable[hash] === node) {
                FS.nameTable[hash] = node.name_next;
              } else {
                var current = FS.nameTable[hash];
                while (current) {
                  if (current.name_next === node) {
                    current.name_next = node.name_next;
                    break;
                  }
                  current = current.name_next;
                }
              }
            },
            lookupNode: function lookupNode(parent, name) {
              var errCode = FS.mayLookup(parent);
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
              var hash = FS.hashName(parent.id, name);
              for (var node = FS.nameTable[hash]; node; node = node.name_next) {
                var nodeName = node.name;
                if (node.parent.id === parent.id && nodeName === name) {
                  return node;
                }
              }
              return FS.lookup(parent, name);
            },
            createNode: function createNode(parent, name, mode, rdev) {
              var node = new FS.FSNode(parent, name, mode, rdev);
              FS.hashAddNode(node);
              return node;
            },
            destroyNode: function destroyNode(node) {
              FS.hashRemoveNode(node);
            },
            isRoot: function isRoot(node) {
              return node === node.parent;
            },
            isMountpoint: function isMountpoint(node) {
              return !!node.mounted;
            },
            isFile: function isFile(mode) {
              return (mode & 61440) === 32768;
            },
            isDir: function isDir(mode) {
              return (mode & 61440) === 16384;
            },
            isLink: function isLink(mode) {
              return (mode & 61440) === 40960;
            },
            isChrdev: function isChrdev(mode) {
              return (mode & 61440) === 8192;
            },
            isBlkdev: function isBlkdev(mode) {
              return (mode & 61440) === 24576;
            },
            isFIFO: function isFIFO(mode) {
              return (mode & 61440) === 4096;
            },
            isSocket: function isSocket(mode) {
              return (mode & 49152) === 49152;
            },
            flagsToPermissionString: function flagsToPermissionString(flag) {
              var perms = ["r", "w", "rw"][flag & 3];
              if (flag & 512) {
                perms += "w";
              }
              return perms;
            },
            nodePermissions: function nodePermissions(node, perms) {
              if (FS.ignorePermissions) {
                return 0;
              }
              if (perms.includes("r") && !(node.mode & 292)) {
                return 2;
              }
              if (perms.includes("w") && !(node.mode & 146)) {
                return 2;
              }
              if (perms.includes("x") && !(node.mode & 73)) {
                return 2;
              }
              return 0;
            },
            mayLookup: function mayLookup(dir) {
              if (!FS.isDir(dir.mode)) return 54;
              var errCode = FS.nodePermissions(dir, "x");
              if (errCode) return errCode;
              if (!dir.node_ops.lookup) return 2;
              return 0;
            },
            mayCreate: function mayCreate(dir, name) {
              if (!FS.isDir(dir.mode)) {
                return 54;
              }
              try {
                var node = FS.lookupNode(dir, name);
                return 20;
              } catch (e) {}
              return FS.nodePermissions(dir, "wx");
            },
            mayDelete: function mayDelete(dir, name, isdir) {
              var node;
              try {
                node = FS.lookupNode(dir, name);
              } catch (e) {
                return e.errno;
              }
              var errCode = FS.nodePermissions(dir, "wx");
              if (errCode) {
                return errCode;
              }
              if (isdir) {
                if (!FS.isDir(node.mode)) {
                  return 54;
                }
                if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                  return 10;
                }
              } else if (FS.isDir(node.mode)) {
                return 31;
              }
              return 0;
            },
            mayOpen: function mayOpen(node, flags) {
              if (!node) {
                return 44;
              }
              if (FS.isLink(node.mode)) {
                return 32;
              }
              var mode = FS.flagsToPermissionString(flags);
              if (FS.isDir(node.mode)) {
                if (mode !== "r" || flags & (512 | 64)) {
                  return 31;
                }
              }
              return FS.nodePermissions(node, mode);
            },
            checkOpExists: function checkOpExists(op, err) {
              if (!op) {
                throw new FS.ErrnoError(err);
              }
              return op;
            },
            MAX_OPEN_FDS: 4096,
            nextfd: function nextfd() {
              for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
                if (!FS.streams[fd]) {
                  return fd;
                }
              }
              throw new FS.ErrnoError(33);
            },
            getStreamChecked: function getStreamChecked(fd) {
              var stream = FS.getStream(fd);
              if (!stream) {
                throw new FS.ErrnoError(8);
              }
              return stream;
            },
            getStream: function getStream(fd) {
              return FS.streams[fd];
            },
            createStream: function createStream(stream) {
              var fd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
              stream = Object.assign(new FS.FSStream(), stream);
              if (fd == -1) {
                fd = FS.nextfd();
              }
              stream.fd = fd;
              FS.streams[fd] = stream;
              return stream;
            },
            closeStream: function closeStream(fd) {
              FS.streams[fd] = null;
            },
            dupStream: function dupStream(origStream) {
              var _stream$stream_ops, _stream$stream_ops$du;
              var fd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
              var stream = FS.createStream(origStream, fd);
              (_stream$stream_ops = stream.stream_ops) === null || _stream$stream_ops === void 0 || (_stream$stream_ops$du = _stream$stream_ops.dup) === null || _stream$stream_ops$du === void 0 || _stream$stream_ops$du.call(_stream$stream_ops, stream);
              return stream;
            },
            doSetAttr: function doSetAttr(stream, node, attr) {
              var setattr = stream === null || stream === void 0 ? void 0 : stream.stream_ops.setattr;
              var arg = setattr ? stream : node;
              setattr !== null && setattr !== void 0 ? setattr : setattr = node.node_ops.setattr;
              FS.checkOpExists(setattr, 63);
              try {
                setattr(arg, attr);
              } catch (e) {
                if (e instanceof RangeError) {
                  throw new FS.ErrnoError(22);
                }
                throw e;
              }
            },
            chrdev_stream_ops: {
              open: function open(stream) {
                var _stream$stream_ops$op, _stream$stream_ops2;
                var device = FS.getDevice(stream.node.rdev);
                stream.stream_ops = device.stream_ops;
                (_stream$stream_ops$op = (_stream$stream_ops2 = stream.stream_ops).open) === null || _stream$stream_ops$op === void 0 || _stream$stream_ops$op.call(_stream$stream_ops2, stream);
              },
              llseek: function llseek() {
                throw new FS.ErrnoError(70);
              }
            },
            major: function major(dev) {
              return dev >> 8;
            },
            minor: function minor(dev) {
              return dev & 255;
            },
            makedev: function makedev(ma, mi) {
              return ma << 8 | mi;
            },
            registerDevice: function registerDevice(dev, ops) {
              FS.devices[dev] = {
                stream_ops: ops
              };
            },
            getDevice: function getDevice(dev) {
              return FS.devices[dev];
            },
            getMounts: function getMounts(mount) {
              var mounts = [];
              var check = [mount];
              while (check.length) {
                var m = check.pop();
                mounts.push(m);
                check.push.apply(check, _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3___default()(m.mounts));
              }
              return mounts;
            },
            syncfs: function syncfs(populate, callback) {
              if (typeof populate == "function") {
                callback = populate;
                populate = false;
              }
              FS.syncFSRequests++;
              if (FS.syncFSRequests > 1) {
                err("warning: ".concat(FS.syncFSRequests, " FS.syncfs operations in flight at once, probably just doing extra work"));
              }
              var mounts = FS.getMounts(FS.root.mount);
              var completed = 0;
              function doCallback(errCode) {
                FS.syncFSRequests--;
                return callback(errCode);
              }
              function done(errCode) {
                if (errCode) {
                  if (!done.errored) {
                    done.errored = true;
                    return doCallback(errCode);
                  }
                  return;
                }
                if (++completed >= mounts.length) {
                  doCallback(null);
                }
              }
              var _iterator8 = _createForOfIteratorHelper(mounts),
                _step8;
              try {
                for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                  var mount = _step8.value;
                  if (mount.type.syncfs) {
                    mount.type.syncfs(mount, populate, done);
                  } else {
                    done(null);
                  }
                }
              } catch (err) {
                _iterator8.e(err);
              } finally {
                _iterator8.f();
              }
            },
            mount: function mount(type, opts, mountpoint) {
              var root = mountpoint === "/";
              var pseudo = !mountpoint;
              var node;
              if (root && FS.root) {
                throw new FS.ErrnoError(10);
              } else if (!root && !pseudo) {
                var lookup = FS.lookupPath(mountpoint, {
                  follow_mount: false
                });
                mountpoint = lookup.path;
                node = lookup.node;
                if (FS.isMountpoint(node)) {
                  throw new FS.ErrnoError(10);
                }
                if (!FS.isDir(node.mode)) {
                  throw new FS.ErrnoError(54);
                }
              }
              var mount = {
                type: type,
                opts: opts,
                mountpoint: mountpoint,
                mounts: []
              };
              var mountRoot = type.mount(mount);
              mountRoot.mount = mount;
              mount.root = mountRoot;
              if (root) {
                FS.root = mountRoot;
              } else if (node) {
                node.mounted = mount;
                if (node.mount) {
                  node.mount.mounts.push(mount);
                }
              }
              return mountRoot;
            },
            unmount: function unmount(mountpoint) {
              var lookup = FS.lookupPath(mountpoint, {
                follow_mount: false
              });
              if (!FS.isMountpoint(lookup.node)) {
                throw new FS.ErrnoError(28);
              }
              var node = lookup.node;
              var mount = node.mounted;
              var mounts = FS.getMounts(mount);
              for (var _i8 = 0, _Object$entries2 = Object.entries(FS.nameTable); _i8 < _Object$entries2.length; _i8++) {
                var _Object$entries2$_i = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_Object$entries2[_i8], 2),
                  hash = _Object$entries2$_i[0],
                  current = _Object$entries2$_i[1];
                while (current) {
                  var next = current.name_next;
                  if (mounts.includes(current.mount)) {
                    FS.destroyNode(current);
                  }
                  current = next;
                }
              }
              node.mounted = null;
              var idx = node.mount.mounts.indexOf(mount);
              node.mount.mounts.splice(idx, 1);
            },
            lookup: function lookup(parent, name) {
              return parent.node_ops.lookup(parent, name);
            },
            mknod: function mknod(path, mode, dev) {
              var lookup = FS.lookupPath(path, {
                parent: true
              });
              var parent = lookup.node;
              var name = PATH.basename(path);
              if (!name) {
                throw new FS.ErrnoError(28);
              }
              if (name === "." || name === "..") {
                throw new FS.ErrnoError(20);
              }
              var errCode = FS.mayCreate(parent, name);
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
              if (!parent.node_ops.mknod) {
                throw new FS.ErrnoError(63);
              }
              return parent.node_ops.mknod(parent, name, mode, dev);
            },
            statfs: function statfs(path) {
              return FS.statfsNode(FS.lookupPath(path, {
                follow: true
              }).node);
            },
            statfsStream: function statfsStream(stream) {
              return FS.statfsNode(stream.node);
            },
            statfsNode: function statfsNode(node) {
              var rtn = {
                bsize: 4096,
                frsize: 4096,
                blocks: 1e6,
                bfree: 5e5,
                bavail: 5e5,
                files: FS.nextInode,
                ffree: FS.nextInode - 1,
                fsid: 42,
                flags: 2,
                namelen: 255
              };
              if (node.node_ops.statfs) {
                Object.assign(rtn, node.node_ops.statfs(node.mount.opts.root));
              }
              return rtn;
            },
            create: function create(path) {
              var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 438;
              mode &= 4095;
              mode |= 32768;
              return FS.mknod(path, mode, 0);
            },
            mkdir: function mkdir(path) {
              var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 511;
              mode &= 511 | 512;
              mode |= 16384;
              return FS.mknod(path, mode, 0);
            },
            mkdirTree: function mkdirTree(path, mode) {
              var dirs = path.split("/");
              var d = "";
              var _iterator9 = _createForOfIteratorHelper(dirs),
                _step9;
              try {
                for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                  var dir = _step9.value;
                  if (!dir) continue;
                  if (d || PATH.isAbs(path)) d += "/";
                  d += dir;
                  try {
                    FS.mkdir(d, mode);
                  } catch (e) {
                    if (e.errno != 20) throw e;
                  }
                }
              } catch (err) {
                _iterator9.e(err);
              } finally {
                _iterator9.f();
              }
            },
            mkdev: function mkdev(path, mode, dev) {
              if (typeof dev == "undefined") {
                dev = mode;
                mode = 438;
              }
              mode |= 8192;
              return FS.mknod(path, mode, dev);
            },
            symlink: function symlink(oldpath, newpath) {
              if (!PATH_FS.resolve(oldpath)) {
                throw new FS.ErrnoError(44);
              }
              var lookup = FS.lookupPath(newpath, {
                parent: true
              });
              var parent = lookup.node;
              if (!parent) {
                throw new FS.ErrnoError(44);
              }
              var newname = PATH.basename(newpath);
              var errCode = FS.mayCreate(parent, newname);
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
              if (!parent.node_ops.symlink) {
                throw new FS.ErrnoError(63);
              }
              return parent.node_ops.symlink(parent, newname, oldpath);
            },
            link: function link(oldpath, newpath, flags) {
              var lookup = FS.lookupPath(newpath, {
                parent: true
              });
              var parent = lookup.node;
              if (!parent) {
                throw new FS.ErrnoError(44);
              }
              var newname = PATH.basename(newpath);
              var errCode = FS.mayCreate(parent, newname);
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
              if (!parent.node_ops.link) {
                throw new FS.ErrnoError(34);
              }
              return parent.node_ops.link(parent, newname, oldpath, flags);
            },
            rename: function rename(old_path, new_path) {
              var old_dirname = PATH.dirname(old_path);
              var new_dirname = PATH.dirname(new_path);
              var old_name = PATH.basename(old_path);
              var new_name = PATH.basename(new_path);
              var lookup, old_dir, new_dir;
              lookup = FS.lookupPath(old_path, {
                parent: true
              });
              old_dir = lookup.node;
              lookup = FS.lookupPath(new_path, {
                parent: true
              });
              new_dir = lookup.node;
              if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
              if (old_dir.mount !== new_dir.mount) {
                throw new FS.ErrnoError(75);
              }
              var old_node = FS.lookupNode(old_dir, old_name);
              var relative = PATH_FS.relative(old_path, new_dirname);
              if (relative.charAt(0) !== ".") {
                throw new FS.ErrnoError(28);
              }
              relative = PATH_FS.relative(new_path, old_dirname);
              if (relative.charAt(0) !== ".") {
                throw new FS.ErrnoError(55);
              }
              var new_node;
              try {
                new_node = FS.lookupNode(new_dir, new_name);
              } catch (e) {}
              if (old_node === new_node) {
                return;
              }
              var isdir = FS.isDir(old_node.mode);
              var errCode = FS.mayDelete(old_dir, old_name, isdir);
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
              errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
              if (!old_dir.node_ops.rename) {
                throw new FS.ErrnoError(63);
              }
              if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
                throw new FS.ErrnoError(10);
              }
              if (new_dir !== old_dir) {
                errCode = FS.nodePermissions(old_dir, "w");
                if (errCode) {
                  throw new FS.ErrnoError(errCode);
                }
              }
              FS.hashRemoveNode(old_node);
              try {
                old_dir.node_ops.rename(old_node, new_dir, new_name);
                old_node.parent = new_dir;
              } catch (e) {
                throw e;
              } finally {
                FS.hashAddNode(old_node);
              }
            },
            rmdir: function rmdir(path) {
              var lookup = FS.lookupPath(path, {
                parent: true
              });
              var parent = lookup.node;
              var name = PATH.basename(path);
              var node = FS.lookupNode(parent, name);
              var errCode = FS.mayDelete(parent, name, true);
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
              if (!parent.node_ops.rmdir) {
                throw new FS.ErrnoError(63);
              }
              if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(10);
              }
              parent.node_ops.rmdir(parent, name);
              FS.destroyNode(node);
            },
            readdir: function readdir(path) {
              var lookup = FS.lookupPath(path, {
                follow: true
              });
              var node = lookup.node;
              var readdir = FS.checkOpExists(node.node_ops.readdir, 54);
              return readdir(node);
            },
            unlink: function unlink(path) {
              var lookup = FS.lookupPath(path, {
                parent: true
              });
              var parent = lookup.node;
              if (!parent) {
                throw new FS.ErrnoError(44);
              }
              var name = PATH.basename(path);
              var node = FS.lookupNode(parent, name);
              var errCode = FS.mayDelete(parent, name, false);
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
              if (!parent.node_ops.unlink) {
                throw new FS.ErrnoError(63);
              }
              if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(10);
              }
              parent.node_ops.unlink(parent, name);
              FS.destroyNode(node);
            },
            readlink: function readlink(path) {
              var lookup = FS.lookupPath(path);
              var link = lookup.node;
              if (!link) {
                throw new FS.ErrnoError(44);
              }
              if (!link.node_ops.readlink) {
                throw new FS.ErrnoError(28);
              }
              return link.node_ops.readlink(link);
            },
            stat: function stat(path, dontFollow) {
              var lookup = FS.lookupPath(path, {
                follow: !dontFollow
              });
              var node = lookup.node;
              var getattr = FS.checkOpExists(node.node_ops.getattr, 63);
              return getattr(node);
            },
            fstat: function fstat(fd) {
              var stream = FS.getStreamChecked(fd);
              var node = stream.node;
              var getattr = stream.stream_ops.getattr;
              var arg = getattr ? stream : node;
              getattr !== null && getattr !== void 0 ? getattr : getattr = node.node_ops.getattr;
              FS.checkOpExists(getattr, 63);
              return getattr(arg);
            },
            lstat: function lstat(path) {
              return FS.stat(path, true);
            },
            doChmod: function doChmod(stream, node, mode, dontFollow) {
              FS.doSetAttr(stream, node, {
                mode: mode & 4095 | node.mode & ~4095,
                ctime: Date.now(),
                dontFollow: dontFollow
              });
            },
            chmod: function chmod(path, mode, dontFollow) {
              var node;
              if (typeof path == "string") {
                var lookup = FS.lookupPath(path, {
                  follow: !dontFollow
                });
                node = lookup.node;
              } else {
                node = path;
              }
              FS.doChmod(null, node, mode, dontFollow);
            },
            lchmod: function lchmod(path, mode) {
              FS.chmod(path, mode, true);
            },
            fchmod: function fchmod(fd, mode) {
              var stream = FS.getStreamChecked(fd);
              FS.doChmod(stream, stream.node, mode, false);
            },
            doChown: function doChown(stream, node, dontFollow) {
              FS.doSetAttr(stream, node, {
                timestamp: Date.now(),
                dontFollow: dontFollow
              });
            },
            chown: function chown(path, uid, gid, dontFollow) {
              var node;
              if (typeof path == "string") {
                var lookup = FS.lookupPath(path, {
                  follow: !dontFollow
                });
                node = lookup.node;
              } else {
                node = path;
              }
              FS.doChown(null, node, dontFollow);
            },
            lchown: function lchown(path, uid, gid) {
              FS.chown(path, uid, gid, true);
            },
            fchown: function fchown(fd, uid, gid) {
              var stream = FS.getStreamChecked(fd);
              FS.doChown(stream, stream.node, false);
            },
            doTruncate: function doTruncate(stream, node, len) {
              if (FS.isDir(node.mode)) {
                throw new FS.ErrnoError(31);
              }
              if (!FS.isFile(node.mode)) {
                throw new FS.ErrnoError(28);
              }
              var errCode = FS.nodePermissions(node, "w");
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
              FS.doSetAttr(stream, node, {
                size: len,
                timestamp: Date.now()
              });
            },
            truncate: function truncate(path, len) {
              if (len < 0) {
                throw new FS.ErrnoError(28);
              }
              var node;
              if (typeof path == "string") {
                var lookup = FS.lookupPath(path, {
                  follow: true
                });
                node = lookup.node;
              } else {
                node = path;
              }
              FS.doTruncate(null, node, len);
            },
            ftruncate: function ftruncate(fd, len) {
              var stream = FS.getStreamChecked(fd);
              if (len < 0 || (stream.flags & 2097155) === 0) {
                throw new FS.ErrnoError(28);
              }
              FS.doTruncate(stream, stream.node, len);
            },
            utime: function utime(path, atime, mtime, dontFollow) {
              var lookup = FS.lookupPath(path, {
                follow: !dontFollow
              });
              FS.doSetAttr(null, lookup.node, {
                atime: atime,
                mtime: mtime,
                dontFollow: dontFollow
              });
            },
            open: function open(path, flags) {
              var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 438;
              if (path === "") {
                throw new FS.ErrnoError(44);
              }
              flags = FS_modeStringToFlags(flags);
              if (flags & 64) {
                mode = mode & 4095 | 32768;
              } else {
                mode = 0;
              }
              var node;
              var isDirPath;
              if (_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(path) == "object") {
                node = path;
              } else {
                isDirPath = path.endsWith("/");
                var lookup = FS.lookupPath(path, {
                  follow: !(flags & 131072),
                  noent_okay: true
                });
                node = lookup.node;
                path = lookup.path;
              }
              var created = false;
              if (flags & 64) {
                if (node) {
                  if (flags & 128) {
                    throw new FS.ErrnoError(20);
                  }
                } else if (isDirPath) {
                  throw new FS.ErrnoError(31);
                } else {
                  node = FS.mknod(path, mode | 511, 0);
                  created = true;
                }
              }
              if (!node) {
                throw new FS.ErrnoError(44);
              }
              if (FS.isChrdev(node.mode)) {
                flags &= ~512;
              }
              if (flags & 65536 && !FS.isDir(node.mode)) {
                throw new FS.ErrnoError(54);
              }
              if (!created) {
                var errCode = FS.mayOpen(node, flags);
                if (errCode) {
                  throw new FS.ErrnoError(errCode);
                }
              }
              if (flags & 512 && !created) {
                FS.truncate(node, 0);
              }
              flags &= ~(128 | 512 | 131072);
              var stream = FS.createStream({
                node: node,
                path: FS.getPath(node),
                flags: flags,
                seekable: true,
                position: 0,
                stream_ops: node.stream_ops,
                ungotten: [],
                error: false
              });
              if (stream.stream_ops.open) {
                stream.stream_ops.open(stream);
              }
              if (created) {
                FS.chmod(node, mode & 511);
              }
              return stream;
            },
            close: function close(stream) {
              var _stream$node;
              if (FS.isClosed(stream)) {
                throw new FS.ErrnoError(8);
              }
              if (stream.getdents) stream.getdents = null;
              (_stream$node = stream.node) === null || _stream$node === void 0 || _stream$node.notifyListeners(32);
              try {
                if (stream.stream_ops.close) {
                  stream.stream_ops.close(stream);
                }
              } catch (e) {
                throw e;
              } finally {
                FS.closeStream(stream.fd);
              }
              stream.fd = null;
            },
            isClosed: function isClosed(stream) {
              return stream.fd === null;
            },
            llseek: function llseek(stream, offset, whence) {
              if (FS.isClosed(stream)) {
                throw new FS.ErrnoError(8);
              }
              if (!stream.seekable || !stream.stream_ops.llseek) {
                throw new FS.ErrnoError(70);
              }
              if (whence != 0 && whence != 1 && whence != 2) {
                throw new FS.ErrnoError(28);
              }
              stream.position = stream.stream_ops.llseek(stream, offset, whence);
              stream.ungotten = [];
              return stream.position;
            },
            read: function read(stream, buffer, offset, length, position) {
              if (length < 0 || position < 0) {
                throw new FS.ErrnoError(28);
              }
              if (FS.isClosed(stream)) {
                throw new FS.ErrnoError(8);
              }
              if ((stream.flags & 2097155) === 1) {
                throw new FS.ErrnoError(8);
              }
              if (FS.isDir(stream.node.mode)) {
                throw new FS.ErrnoError(31);
              }
              if (!stream.stream_ops.read) {
                throw new FS.ErrnoError(28);
              }
              var seeking = typeof position != "undefined";
              if (!seeking) {
                position = stream.position;
              } else if (!stream.seekable) {
                throw new FS.ErrnoError(70);
              }
              var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
              if (!seeking) stream.position += bytesRead;
              return bytesRead;
            },
            write: function write(stream, buffer, offset, length, position, canOwn) {
              if (length < 0 || position < 0) {
                throw new FS.ErrnoError(28);
              }
              if (FS.isClosed(stream)) {
                throw new FS.ErrnoError(8);
              }
              if ((stream.flags & 2097155) === 0) {
                throw new FS.ErrnoError(8);
              }
              if (FS.isDir(stream.node.mode)) {
                throw new FS.ErrnoError(31);
              }
              if (!stream.stream_ops.write) {
                throw new FS.ErrnoError(28);
              }
              if (stream.seekable && stream.flags & 1024) {
                FS.llseek(stream, 0, 2);
              }
              var seeking = typeof position != "undefined";
              if (!seeking) {
                position = stream.position;
              } else if (!stream.seekable) {
                throw new FS.ErrnoError(70);
              }
              var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
              if (!seeking) stream.position += bytesWritten;
              return bytesWritten;
            },
            mmap: function mmap(stream, length, position, prot, flags) {
              if (prot & 2 && !(flags & 2) && (stream.flags & 2097155) !== 2) {
                throw new FS.ErrnoError(2);
              }
              if ((stream.flags & 2097155) === 1) {
                throw new FS.ErrnoError(2);
              }
              if (!stream.stream_ops.mmap) {
                throw new FS.ErrnoError(43);
              }
              if (!length) {
                throw new FS.ErrnoError(28);
              }
              return stream.stream_ops.mmap(stream, length, position, prot, flags);
            },
            msync: function msync(stream, buffer, offset, length, mmapFlags) {
              if (!stream.stream_ops.msync) {
                return 0;
              }
              return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
            },
            ioctl: function ioctl(stream, cmd, arg) {
              if (!stream.stream_ops.ioctl) {
                throw new FS.ErrnoError(59);
              }
              return stream.stream_ops.ioctl(stream, cmd, arg);
            },
            readFile: function readFile(path) {
              var _opts$flags, _opts$encoding;
              var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
              opts.flags = (_opts$flags = opts.flags) !== null && _opts$flags !== void 0 ? _opts$flags : 0;
              opts.encoding = (_opts$encoding = opts.encoding) !== null && _opts$encoding !== void 0 ? _opts$encoding : "binary";
              if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
                abort("Invalid encoding type \"".concat(opts.encoding, "\""));
              }
              var stream = FS.open(path, opts.flags);
              var stat = FS.stat(path);
              var length = stat.size;
              var buf = new Uint8Array(length);
              FS.read(stream, buf, 0, length, 0);
              if (opts.encoding === "utf8") {
                buf = UTF8ArrayToString(buf);
              }
              FS.close(stream);
              return buf;
            },
            writeFile: function writeFile(path, data) {
              var _opts$flags2;
              var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
              opts.flags = (_opts$flags2 = opts.flags) !== null && _opts$flags2 !== void 0 ? _opts$flags2 : 577;
              var stream = FS.open(path, opts.flags, opts.mode);
              data = FS_fileDataToTypedArray(data);
              FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
              FS.close(stream);
            },
            cwd: function cwd() {
              return FS.currentPath;
            },
            chdir: function chdir(path) {
              var lookup = FS.lookupPath(path, {
                follow: true
              });
              if (lookup.node === null) {
                throw new FS.ErrnoError(44);
              }
              if (!FS.isDir(lookup.node.mode)) {
                throw new FS.ErrnoError(54);
              }
              var errCode = FS.nodePermissions(lookup.node, "x");
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
              FS.currentPath = lookup.path;
            },
            createDefaultDirectories: function createDefaultDirectories() {
              FS.mkdir("/tmp");
              FS.mkdir("/home");
              FS.mkdir("/home/web_user");
            },
            createDefaultDevices: function createDefaultDevices() {
              FS.mkdir("/dev");
              FS.registerDevice(FS.makedev(1, 3), {
                read: function read() {
                  return 0;
                },
                write: function write(stream, buffer, offset, length, pos) {
                  return length;
                },
                llseek: function llseek() {
                  return 0;
                }
              });
              FS.mkdev("/dev/null", FS.makedev(1, 3));
              TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
              TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
              FS.mkdev("/dev/tty", FS.makedev(5, 0));
              FS.mkdev("/dev/tty1", FS.makedev(6, 0));
              var randomBuffer = new Uint8Array(1024),
                randomLeft = 0;
              var randomByte = function randomByte() {
                if (!randomLeft) {
                  _randomFill(randomBuffer);
                  randomLeft = randomBuffer.byteLength;
                }
                return randomBuffer[--randomLeft];
              };
              FS.createDevice("/dev", "random", randomByte);
              FS.createDevice("/dev", "urandom", randomByte);
              FS.mkdir("/dev/shm");
              FS.mkdir("/dev/shm/tmp");
            },
            createSpecialDirectories: function createSpecialDirectories() {
              FS.mkdir("/proc");
              var proc_self = FS.mkdir("/proc/self");
              FS.mkdir("/proc/self/fd");
              FS.mount({
                mount: function mount() {
                  var node = FS.createNode(proc_self, "fd", 16895, 73);
                  node.stream_ops = {
                    llseek: MEMFS.stream_ops.llseek
                  };
                  node.node_ops = {
                    lookup: function lookup(parent, name) {
                      var fd = +name;
                      var stream = FS.getStreamChecked(fd);
                      var ret = {
                        parent: null,
                        mount: {
                          mountpoint: "fake"
                        },
                        node_ops: {
                          readlink: function readlink() {
                            return stream.path;
                          }
                        },
                        id: fd + 1
                      };
                      ret.parent = ret;
                      return ret;
                    },
                    readdir: function readdir() {
                      return Array.from(FS.streams.entries()).filter(function (_ref8) {
                        var _ref9 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_ref8, 2),
                          k = _ref9[0],
                          v = _ref9[1];
                        return v;
                      }).map(function (_ref0) {
                        var _ref1 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_ref0, 2),
                          k = _ref1[0],
                          v = _ref1[1];
                        return k.toString();
                      });
                    }
                  };
                  return node;
                }
              }, {}, "/proc/self/fd");
            },
            createStandardStreams: function createStandardStreams(input, output, error) {
              if (input) {
                FS.createDevice("/dev", "stdin", input);
              } else {
                FS.symlink("/dev/tty", "/dev/stdin");
              }
              if (output) {
                FS.createDevice("/dev", "stdout", null, output);
              } else {
                FS.symlink("/dev/tty", "/dev/stdout");
              }
              if (error) {
                FS.createDevice("/dev", "stderr", null, error);
              } else {
                FS.symlink("/dev/tty1", "/dev/stderr");
              }
              var stdin = FS.open("/dev/stdin", 0);
              var stdout = FS.open("/dev/stdout", 1);
              var stderr = FS.open("/dev/stderr", 1);
            },
            staticInit: function staticInit() {
              FS.nameTable = new Array(4096);
              FS.mount(MEMFS, {}, "/");
              FS.createDefaultDirectories();
              FS.createDefaultDevices();
              FS.createSpecialDirectories();
              FS.filesystems = {
                MEMFS: MEMFS,
                IDBFS: IDBFS,
                WORKERFS: WORKERFS
              };
            },
            init: function init(input, output, error) {
              FS.initialized = true;
              input !== null && input !== void 0 ? input : input = Module["stdin"];
              output !== null && output !== void 0 ? output : output = Module["stdout"];
              error !== null && error !== void 0 ? error : error = Module["stderr"];
              FS.createStandardStreams(input, output, error);
            },
            quit: function quit() {
              FS.initialized = false;
              var _iterator0 = _createForOfIteratorHelper(FS.streams),
                _step0;
              try {
                for (_iterator0.s(); !(_step0 = _iterator0.n()).done;) {
                  var stream = _step0.value;
                  if (stream) {
                    FS.close(stream);
                  }
                }
              } catch (err) {
                _iterator0.e(err);
              } finally {
                _iterator0.f();
              }
            },
            findObject: function findObject(path, dontResolveLastLink) {
              var ret = FS.analyzePath(path, dontResolveLastLink);
              if (!ret.exists) {
                return null;
              }
              return ret.object;
            },
            analyzePath: function analyzePath(path, dontResolveLastLink) {
              try {
                var lookup = FS.lookupPath(path, {
                  follow: !dontResolveLastLink
                });
                path = lookup.path;
              } catch (e) {}
              var ret = {
                isRoot: false,
                exists: false,
                error: 0,
                name: null,
                path: null,
                object: null,
                parentExists: false,
                parentPath: null,
                parentObject: null
              };
              try {
                var lookup = FS.lookupPath(path, {
                  parent: true
                });
                ret.parentExists = true;
                ret.parentPath = lookup.path;
                ret.parentObject = lookup.node;
                ret.name = PATH.basename(path);
                lookup = FS.lookupPath(path, {
                  follow: !dontResolveLastLink
                });
                ret.exists = true;
                ret.path = lookup.path;
                ret.object = lookup.node;
                ret.name = lookup.node.name;
                ret.isRoot = lookup.path === "/";
              } catch (e) {
                ret.error = e.errno;
              }
              return ret;
            },
            createPath: function createPath(parent, path, canRead, canWrite) {
              parent = typeof parent == "string" ? parent : FS.getPath(parent);
              var parts = path.split("/").reverse();
              while (parts.length) {
                var part = parts.pop();
                if (!part) continue;
                var current = PATH.join2(parent, part);
                try {
                  FS.mkdir(current);
                } catch (e) {
                  if (e.errno != 20) throw e;
                }
                parent = current;
              }
              return current;
            },
            createFile: function createFile(parent, name, properties, canRead, canWrite) {
              var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
              var mode = FS_getMode(canRead, canWrite);
              return FS.create(path, mode);
            },
            createDataFile: function createDataFile(parent, name, data, canRead, canWrite, canOwn) {
              var path = name;
              if (parent) {
                parent = typeof parent == "string" ? parent : FS.getPath(parent);
                path = name ? PATH.join2(parent, name) : parent;
              }
              var mode = FS_getMode(canRead, canWrite);
              var node = FS.create(path, mode);
              if (data) {
                data = FS_fileDataToTypedArray(data);
                FS.chmod(node, mode | 146);
                var stream = FS.open(node, 577);
                FS.write(stream, data, 0, data.length, 0, canOwn);
                FS.close(stream);
                FS.chmod(node, mode);
              }
            },
            createDevice: function createDevice(parent, name, input, output) {
              var _FS$createDevice, _FS$createDevice$majo;
              var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
              var mode = FS_getMode(!!input, !!output);
              (_FS$createDevice$majo = (_FS$createDevice = FS.createDevice).major) !== null && _FS$createDevice$majo !== void 0 ? _FS$createDevice$majo : _FS$createDevice.major = 64;
              var dev = FS.makedev(FS.createDevice.major++, 0);
              FS.registerDevice(dev, {
                open: function open(stream) {
                  stream.seekable = false;
                },
                close: function close(stream) {
                  var _output$buffer;
                  if (output !== null && output !== void 0 && (_output$buffer = output.buffer) !== null && _output$buffer !== void 0 && _output$buffer.length) {
                    output(10);
                  }
                },
                read: function read(stream, buffer, offset, length, pos) {
                  var bytesRead = 0;
                  for (var i = 0; i < length; i++) {
                    var result;
                    try {
                      result = input();
                    } catch (e) {
                      throw new FS.ErrnoError(29);
                    }
                    if (result === undefined && !bytesRead) {
                      throw new FS.ErrnoError(6);
                    }
                    if (result === null || result === undefined) break;
                    bytesRead++;
                    buffer[offset + i] = result;
                  }
                  if (bytesRead) {
                    stream.node.atime = Date.now();
                  }
                  return bytesRead;
                },
                write: function write(stream, buffer, offset, length, pos) {
                  for (var i = 0; i < length; i++) {
                    try {
                      output(buffer[offset + i]);
                    } catch (e) {
                      throw new FS.ErrnoError(29);
                    }
                  }
                  if (length) {
                    stream.node.mtime = stream.node.ctime = Date.now();
                  }
                  return i;
                }
              });
              return FS.mkdev(path, mode, dev);
            },
            forceLoadFile: function forceLoadFile(obj) {
              if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
              if (globalThis.XMLHttpRequest) {
                abort("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
              } else {
                try {
                  obj.contents = readBinary(obj.url);
                } catch (e) {
                  throw new FS.ErrnoError(29);
                }
              }
            },
            createLazyFile: function createLazyFile(parent, name, url, canRead, canWrite) {
              var LazyUint8Array = /*#__PURE__*/function () {
                function LazyUint8Array() {
                  _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_8___default()(this, LazyUint8Array);
                  _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "lengthKnown", false);
                  _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "chunks", []);
                }
                return _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_7___default()(LazyUint8Array, [{
                  key: "get",
                  value: function get(idx) {
                    if (idx > this.length - 1 || idx < 0) {
                      return undefined;
                    }
                    var chunkOffset = idx % this.chunkSize;
                    var chunkNum = idx / this.chunkSize | 0;
                    return this.getter(chunkNum)[chunkOffset];
                  }
                }, {
                  key: "setDataGetter",
                  value: function setDataGetter(getter) {
                    this.getter = getter;
                  }
                }, {
                  key: "cacheLength",
                  value: function cacheLength() {
                    var xhr = new XMLHttpRequest();
                    xhr.open("HEAD", url, false);
                    xhr.send(null);
                    if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort("Couldn't load ".concat(url, ". Status: ").concat(xhr.status));
                    var datalength = Number(xhr.getResponseHeader("Content-length"));
                    var header;
                    var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
                    var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
                    var chunkSize = 1024 * 1024;
                    if (!hasByteServing) chunkSize = datalength;
                    var doXHR = function doXHR(from, to) {
                      var _xhr$responseText;
                      if (from > to) abort("invalid range (".concat(from, ", ").concat(to, ") or no bytes requested!"));
                      if (to > datalength - 1) abort("only ".concat(datalength, " bytes available! programmer error!"));
                      var xhr = new XMLHttpRequest();
                      xhr.open("GET", url, false);
                      if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=".concat(from, "-").concat(to));
                      xhr.responseType = "arraybuffer";
                      if (xhr.overrideMimeType) {
                        xhr.overrideMimeType("text/plain; charset=x-user-defined");
                      }
                      xhr.send(null);
                      if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort("Couldn't load ".concat(url, ". Status: ").concat(xhr.status));
                      if (xhr.response !== undefined) {
                        return new Uint8Array(xhr.response || []);
                      }
                      return intArrayFromString((_xhr$responseText = xhr.responseText) !== null && _xhr$responseText !== void 0 ? _xhr$responseText : "", true);
                    };
                    var lazyArray = this;
                    lazyArray.setDataGetter(function (chunkNum) {
                      var start = chunkNum * chunkSize;
                      var end = (chunkNum + 1) * chunkSize - 1;
                      end = Math.min(end, datalength - 1);
                      if (typeof lazyArray.chunks[chunkNum] == "undefined") {
                        lazyArray.chunks[chunkNum] = doXHR(start, end);
                      }
                      if (typeof lazyArray.chunks[chunkNum] == "undefined") abort("doXHR failed!");
                      return lazyArray.chunks[chunkNum];
                    });
                    if (usesGzip || !datalength) {
                      chunkSize = datalength = 1;
                      datalength = this.getter(0).length;
                      chunkSize = datalength;
                      out("LazyFiles on gzip forces download of the whole file when length is accessed");
                    }
                    this._length = datalength;
                    this._chunkSize = chunkSize;
                    this.lengthKnown = true;
                  }
                }, {
                  key: "length",
                  get: function get() {
                    if (!this.lengthKnown) {
                      this.cacheLength();
                    }
                    return this._length;
                  }
                }, {
                  key: "chunkSize",
                  get: function get() {
                    if (!this.lengthKnown) {
                      this.cacheLength();
                    }
                    return this._chunkSize;
                  }
                }]);
              }();
              if (globalThis.XMLHttpRequest) {
                if (!ENVIRONMENT_IS_WORKER) abort("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");
                var lazyArray = new LazyUint8Array();
                var properties = {
                  isDevice: false,
                  contents: lazyArray
                };
              } else {
                var properties = {
                  isDevice: false,
                  url: url
                };
              }
              var node = FS.createFile(parent, name, properties, canRead, canWrite);
              if (properties.contents) {
                node.contents = properties.contents;
              } else if (properties.url) {
                node.contents = null;
                node.url = properties.url;
              }
              Object.defineProperties(node, {
                usedBytes: {
                  get: function get() {
                    return this.contents.length;
                  }
                }
              });
              var stream_ops = {};
              var _loop2 = function _loop2() {
                var _Object$entries3$_i = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_Object$entries3[_i9], 2),
                  key = _Object$entries3$_i[0],
                  fn = _Object$entries3$_i[1];
                stream_ops[key] = function () {
                  FS.forceLoadFile(node);
                  return fn.apply(void 0, arguments);
                };
              };
              for (var _i9 = 0, _Object$entries3 = Object.entries(node.stream_ops); _i9 < _Object$entries3.length; _i9++) {
                _loop2();
              }
              function writeChunks(stream, buffer, offset, length, position) {
                var contents = stream.node.contents;
                if (position >= contents.length) return 0;
                var size = Math.min(contents.length - position, length);
                if (contents.slice) {
                  for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents[position + i];
                  }
                } else {
                  for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents.get(position + i);
                  }
                }
                return size;
              }
              stream_ops.read = function (stream, buffer, offset, length, position) {
                FS.forceLoadFile(node);
                return writeChunks(stream, buffer, offset, length, position);
              };
              stream_ops.mmap = function (stream, length, position, prot, flags) {
                FS.forceLoadFile(node);
                var ptr = mmapAlloc(length);
                if (!ptr) {
                  throw new FS.ErrnoError(48);
                }
                writeChunks(stream, HEAP8, ptr, length, position);
                return {
                  ptr: ptr,
                  allocated: true
                };
              };
              node.stream_ops = stream_ops;
              return node;
            }
          };
          UTF8ToString = function UTF8ToString(ptr, maxBytesToRead, ignoreNul) {
            return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead, ignoreNul) : "";
          };
          SYSCALLS = {
            currentUmask: 18,
            calculateAt: function calculateAt(dirfd, path, allowEmpty) {
              if (PATH.isAbs(path)) {
                return path;
              }
              var dir;
              if (dirfd === -100) {
                dir = FS.cwd();
              } else {
                var dirstream = SYSCALLS.getStreamFromFD(dirfd);
                dir = dirstream.path;
              }
              if (path.length == 0) {
                if (!allowEmpty) {
                  throw new FS.ErrnoError(44);
                }
                return dir;
              }
              return dir + "/" + path;
            },
            writeStat: function writeStat(buf, stat) {
              HEAPU32[buf >> 2] = stat.dev;
              HEAPU32[buf + 4 >> 2] = stat.mode;
              HEAPU32[buf + 8 >> 2] = stat.nlink;
              HEAPU32[buf + 12 >> 2] = stat.uid;
              HEAPU32[buf + 16 >> 2] = stat.gid;
              HEAPU32[buf + 20 >> 2] = stat.rdev;
              HEAP64[buf + 24 >> 3] = BigInt(stat.size);
              HEAP32[buf + 32 >> 2] = 4096;
              HEAP32[buf + 36 >> 2] = stat.blocks;
              var atime = stat.atime.getTime();
              var mtime = stat.mtime.getTime();
              var ctime = stat.ctime.getTime();
              HEAP64[buf + 40 >> 3] = BigInt(Math.floor(atime / 1e3));
              HEAPU32[buf + 48 >> 2] = atime % 1e3 * 1e3 * 1e3;
              HEAP64[buf + 56 >> 3] = BigInt(Math.floor(mtime / 1e3));
              HEAPU32[buf + 64 >> 2] = mtime % 1e3 * 1e3 * 1e3;
              HEAP64[buf + 72 >> 3] = BigInt(Math.floor(ctime / 1e3));
              HEAPU32[buf + 80 >> 2] = ctime % 1e3 * 1e3 * 1e3;
              HEAP64[buf + 88 >> 3] = BigInt(stat.ino);
              return 0;
            },
            writeStatFs: function writeStatFs(buf, stats) {
              HEAPU32[buf + 4 >> 2] = stats.bsize;
              HEAPU32[buf + 60 >> 2] = stats.bsize;
              HEAP64[buf + 8 >> 3] = BigInt(stats.blocks);
              HEAP64[buf + 16 >> 3] = BigInt(stats.bfree);
              HEAP64[buf + 24 >> 3] = BigInt(stats.bavail);
              HEAP64[buf + 32 >> 3] = BigInt(stats.files);
              HEAP64[buf + 40 >> 3] = BigInt(stats.ffree);
              HEAPU32[buf + 48 >> 2] = stats.fsid;
              HEAPU32[buf + 64 >> 2] = stats.flags;
              HEAPU32[buf + 56 >> 2] = stats.namelen;
            },
            doMsync: function doMsync(addr, stream, len, flags, offset) {
              if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43);
              }
              if (flags & 2) {
                return 0;
              }
              var buffer = HEAPU8.subarray(addr, addr + len);
              FS.msync(stream, buffer, offset, len, flags);
            },
            getStreamFromFD: function getStreamFromFD(fd) {
              var stream = FS.getStreamChecked(fd);
              return stream;
            },
            varargs: undefined,
            getStr: function getStr(ptr) {
              var ret = UTF8ToString(ptr);
              return ret;
            }
          };
          SOCKFS = {
            websocketArgs: {},
            callbacks: {},
            on: function on(event, callback) {
              SOCKFS.callbacks[event] = callback;
            },
            emit: function emit(event, param) {
              var _SOCKFS$callbacks$eve, _SOCKFS$callbacks, _FS$getStream;
              (_SOCKFS$callbacks$eve = (_SOCKFS$callbacks = SOCKFS.callbacks)[event]) === null || _SOCKFS$callbacks$eve === void 0 || _SOCKFS$callbacks$eve.call(_SOCKFS$callbacks, param);
              var fd = event === "error" ? param[0] : param;
              var flags = {
                message: 64 | 1,
                open: 4,
                connection: 64 | 1,
                close: 1 | 16,
                error: 8
              }[event];
              if (flags) (_FS$getStream = FS.getStream(fd)) === null || _FS$getStream === void 0 || _FS$getStream.node.notifyListeners(flags);
            },
            mount: function mount(_mount4) {
              var _websocket, _Module$_websocket;
              SOCKFS.websocketArgs = Module["websocket"] || {};
              ((_Module$_websocket = Module[_websocket = "websocket"]) !== null && _Module$_websocket !== void 0 ? _Module$_websocket : Module[_websocket] = {})["on"] = SOCKFS.on;
              return FS.createNode(null, "/", 16895, 0);
            },
            createSocket: function createSocket(family, type, protocol) {
              if (family != 2) {
                throw new FS.ErrnoError(5);
              }
              type &= ~526336;
              if (type != 1 && type != 2) {
                throw new FS.ErrnoError(28);
              }
              var streaming = type == 1;
              if (streaming && protocol && protocol != 6) {
                throw new FS.ErrnoError(66);
              }
              var sock = {
                family: family,
                type: type,
                protocol: protocol,
                server: null,
                error: null,
                peers: {},
                pending: [],
                recv_queue: [],
                sock_ops: SOCKFS.websocket_sock_ops
              };
              var name = SOCKFS.nextname();
              var node = FS.createNode(SOCKFS.root, name, 49152, 0);
              node.sock = sock;
              var stream = FS.createStream({
                path: name,
                node: node,
                flags: 2,
                seekable: false,
                stream_ops: SOCKFS.stream_ops
              });
              sock.stream = stream;
              return sock;
            },
            getSocket: function getSocket(fd) {
              var stream = FS.getStream(fd);
              if (!stream || !FS.isSocket(stream.node.mode)) {
                return null;
              }
              return stream.node.sock;
            },
            stream_ops: {
              getattr: function getattr(stream) {
                var node = stream.node;
                return {
                  dev: 1,
                  ino: node.id,
                  mode: 49152 | 511,
                  nlink: 1,
                  uid: 0,
                  gid: 0,
                  rdev: 0,
                  size: 0,
                  atime: new Date(0),
                  mtime: new Date(0),
                  ctime: new Date(0),
                  blksize: 4096,
                  blocks: 0
                };
              },
              poll: function poll(stream) {
                var sock = stream.node.sock;
                return sock.sock_ops.poll(sock);
              },
              ioctl: function ioctl(stream, request, varargs) {
                var sock = stream.node.sock;
                return sock.sock_ops.ioctl(sock, request, varargs);
              },
              read: function read(stream, buffer, offset, length, position) {
                var sock = stream.node.sock;
                var msg = sock.sock_ops.recvmsg(sock, length);
                if (!msg) {
                  return 0;
                }
                buffer.set(msg.buffer, offset);
                return msg.buffer.length;
              },
              write: function write(stream, buffer, offset, length, position) {
                var sock = stream.node.sock;
                return sock.sock_ops.sendmsg(sock, buffer, offset, length);
              },
              close: function close(stream) {
                var sock = stream.node.sock;
                sock.sock_ops.close(sock);
              }
            },
            nextname: function nextname() {
              if (!SOCKFS.nextname.current) {
                SOCKFS.nextname.current = 0;
              }
              return "socket[".concat(SOCKFS.nextname.current++, "]");
            },
            websocket_sock_ops: {
              createPeer: function createPeer(sock, addr, port) {
                var ws;
                if (_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(addr) == "object") {
                  ws = addr;
                  addr = null;
                  port = null;
                }
                if (ws) {
                  if (ws._socket) {
                    addr = ws._socket.remoteAddress;
                    port = ws._socket.remotePort;
                  } else {
                    var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
                    if (!result) {
                      throw new Error("WebSocket URL must be in the format ws(s)://address:port");
                    }
                    addr = result[1];
                    port = parseInt(result[2], 10);
                  }
                } else {
                  try {
                    var url = "wss:#".replace("#", "//");
                    var subProtocols = "binary";
                    var opts = undefined;
                    if (SOCKFS.websocketArgs["url"]) {
                      url = SOCKFS.websocketArgs["url"];
                    }
                    if (SOCKFS.websocketArgs["subprotocol"]) {
                      subProtocols = SOCKFS.websocketArgs["subprotocol"];
                    } else if (SOCKFS.websocketArgs["subprotocol"] === null) {
                      subProtocols = "null";
                    }
                    if (url === "ws://" || url === "wss://") {
                      var parts = addr.split("/");
                      url = url + parts[0] + ":" + port + "/" + parts.slice(1).join("/");
                    }
                    if (subProtocols !== "null") {
                      subProtocols = subProtocols.replace(/^ +| +$/g, "").split(/ *, */);
                      opts = subProtocols;
                    }
                    var WebSocketConstructor;
                    if (ENVIRONMENT_IS_NODE) {
                      WebSocketConstructor = __webpack_require__(8);
                    } else {
                      WebSocketConstructor = WebSocket;
                    }
                    ws = new WebSocketConstructor(url, opts);
                    ws.binaryType = "arraybuffer";
                  } catch (e) {
                    throw new FS.ErrnoError(23);
                  }
                }
                var peer = {
                  addr: addr,
                  port: port,
                  socket: ws,
                  msg_send_queue: []
                };
                SOCKFS.websocket_sock_ops.addPeer(sock, peer);
                SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
                if (sock.type === 2 && typeof sock.sport != "undefined") {
                  peer.msg_send_queue.push(new Uint8Array([255, 255, 255, 255, "p".charCodeAt(0), "o".charCodeAt(0), "r".charCodeAt(0), "t".charCodeAt(0), (sock.sport & 65280) >> 8, sock.sport & 255]));
                }
                return peer;
              },
              getPeer: function getPeer(sock, addr, port) {
                return sock.peers[addr + ":" + port];
              },
              addPeer: function addPeer(sock, peer) {
                sock.peers[peer.addr + ":" + peer.port] = peer;
              },
              removePeer: function removePeer(sock, peer) {
                delete sock.peers[peer.addr + ":" + peer.port];
              },
              handlePeerEvents: function handlePeerEvents(sock, peer) {
                var first = true;
                function handleOpen() {
                  sock.connecting = false;
                  SOCKFS.emit("open", sock.stream.fd);
                  try {
                    var queued = peer.msg_send_queue.shift();
                    while (queued) {
                      peer.socket.send(queued);
                      queued = peer.msg_send_queue.shift();
                    }
                  } catch (e) {
                    peer.socket.close();
                  }
                }
                function handleMessage(data) {
                  if (typeof data == "string") {
                    var encoder = new TextEncoder();
                    data = encoder.encode(data);
                  } else {
                    if (data.byteLength == 0) {
                      return;
                    }
                    data = new Uint8Array(data);
                  }
                  var wasfirst = first;
                  first = false;
                  if (wasfirst && data.length === 10 && data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 && data[4] === "p".charCodeAt(0) && data[5] === "o".charCodeAt(0) && data[6] === "r".charCodeAt(0) && data[7] === "t".charCodeAt(0)) {
                    var newport = data[8] << 8 | data[9];
                    SOCKFS.websocket_sock_ops.removePeer(sock, peer);
                    peer.port = newport;
                    SOCKFS.websocket_sock_ops.addPeer(sock, peer);
                    return;
                  }
                  sock.recv_queue.push({
                    addr: peer.addr,
                    port: peer.port,
                    data: data
                  });
                  SOCKFS.emit("message", sock.stream.fd);
                }
                if (ENVIRONMENT_IS_NODE) {
                  peer.socket.on("open", handleOpen);
                  peer.socket.on("message", function (data, isBinary) {
                    if (!isBinary) {
                      return;
                    }
                    handleMessage(new Uint8Array(data).buffer);
                  });
                  peer.socket.on("close", function () {
                    return SOCKFS.emit("close", sock.stream.fd);
                  });
                  peer.socket.on("error", function (error) {
                    sock.error = 14;
                    SOCKFS.emit("error", [sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused"]);
                  });
                  return;
                }
                peer.socket.onopen = handleOpen;
                peer.socket.onclose = function () {
                  return SOCKFS.emit("close", sock.stream.fd);
                };
                peer.socket.onmessage = function (event) {
                  return handleMessage(event.data);
                };
                peer.socket.onerror = function (error) {
                  sock.error = 14;
                  SOCKFS.emit("error", [sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused"]);
                };
              },
              poll: function poll(sock) {
                if (sock.type === 1 && sock.server) {
                  return sock.pending.length ? 64 | 1 : 0;
                }
                var mask = 0;
                var dest = sock.type === 1 ? SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) : null;
                if (sock.recv_queue.length || !dest || dest && dest.socket.readyState === dest.socket.CLOSING || dest && dest.socket.readyState === dest.socket.CLOSED) {
                  mask |= 64 | 1;
                }
                if (!dest || dest && dest.socket.readyState === dest.socket.OPEN) {
                  mask |= 4;
                }
                if (dest && dest.socket.readyState === dest.socket.CLOSING || dest && dest.socket.readyState === dest.socket.CLOSED) {
                  if (sock.connecting) {
                    mask |= 4;
                  } else {
                    mask |= 16 | 8192;
                  }
                }
                return mask;
              },
              ioctl: function ioctl(sock, request, arg) {
                switch (request) {
                  case 21531:
                    var bytes = 0;
                    if (sock.recv_queue.length) {
                      bytes = sock.recv_queue[0].data.length;
                    }
                    HEAP32[arg >> 2] = bytes;
                    return 0;
                  case 21537:
                    var on = HEAP32[arg >> 2];
                    if (on) {
                      sock.stream.flags |= 2048;
                    } else {
                      sock.stream.flags &= ~2048;
                    }
                    return 0;
                  default:
                    return 28;
                }
              },
              close: function close(sock) {
                if (sock.server) {
                  try {
                    sock.server.close();
                  } catch (e) {}
                  sock.server = null;
                }
                for (var _i0 = 0, _Object$values2 = Object.values(sock.peers); _i0 < _Object$values2.length; _i0++) {
                  var peer = _Object$values2[_i0];
                  try {
                    peer.socket.close();
                  } catch (e) {}
                  SOCKFS.websocket_sock_ops.removePeer(sock, peer);
                }
                return 0;
              },
              bind: function bind(sock, addr, port) {
                if (typeof sock.saddr != "undefined" || typeof sock.sport != "undefined") {
                  throw new FS.ErrnoError(28);
                }
                sock.saddr = addr;
                sock.sport = port;
                if (sock.type === 2) {
                  if (sock.server) {
                    sock.server.close();
                    sock.server = null;
                  }
                  try {
                    sock.sock_ops.listen(sock, 0);
                  } catch (e) {
                    if (!(e.name === "ErrnoError")) throw e;
                    if (e.errno !== 138) throw e;
                  }
                }
              },
              connect: function connect(sock, addr, port) {
                if (sock.server) {
                  throw new FS.ErrnoError(138);
                }
                if (typeof sock.daddr != "undefined" && typeof sock.dport != "undefined") {
                  var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
                  if (dest) {
                    if (dest.socket.readyState === dest.socket.CONNECTING) {
                      throw new FS.ErrnoError(7);
                    } else {
                      throw new FS.ErrnoError(30);
                    }
                  }
                }
                var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
                sock.daddr = peer.addr;
                sock.dport = peer.port;
                sock.connecting = true;
              },
              listen: function listen(sock, backlog) {
                if (!ENVIRONMENT_IS_NODE) {
                  throw new FS.ErrnoError(138);
                }
                if (sock.server) {
                  throw new FS.ErrnoError(28);
                }
                var WebSocketServer = __webpack_require__(8).Server;
                var host = sock.saddr;
                sock.server = new WebSocketServer({
                  host: host,
                  port: sock.sport
                });
                SOCKFS.emit("listen", sock.stream.fd);
                sock.server.on("connection", function (ws) {
                  if (sock.type === 1) {
                    var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
                    var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
                    newsock.daddr = peer.addr;
                    newsock.dport = peer.port;
                    sock.pending.push(newsock);
                    SOCKFS.emit("connection", newsock.stream.fd);
                    sock.stream.node.notifyListeners(64 | 1);
                  } else {
                    SOCKFS.websocket_sock_ops.createPeer(sock, ws);
                    SOCKFS.emit("connection", sock.stream.fd);
                  }
                });
                sock.server.on("close", function () {
                  SOCKFS.emit("close", sock.stream.fd);
                  sock.server = null;
                });
                sock.server.on("error", function (error) {
                  sock.error = 23;
                  SOCKFS.emit("error", [sock.stream.fd, sock.error, "EHOSTUNREACH: Host is unreachable"]);
                });
              },
              accept: function accept(listensock) {
                if (!listensock.server || !listensock.pending.length) {
                  throw new FS.ErrnoError(28);
                }
                var newsock = listensock.pending.shift();
                newsock.stream.flags = listensock.stream.flags;
                return newsock;
              },
              getname: function getname(sock, peer) {
                var addr, port;
                if (peer) {
                  if (sock.daddr === undefined || sock.dport === undefined) {
                    throw new FS.ErrnoError(53);
                  }
                  addr = sock.daddr;
                  port = sock.dport;
                } else {
                  addr = sock.saddr || 0;
                  port = sock.sport || 0;
                }
                return {
                  addr: addr,
                  port: port
                };
              },
              sendmsg: function sendmsg(sock, buffer, offset, length, addr, port) {
                if (sock.type === 2) {
                  if (addr === undefined || port === undefined) {
                    addr = sock.daddr;
                    port = sock.dport;
                  }
                  if (addr === undefined || port === undefined) {
                    throw new FS.ErrnoError(17);
                  }
                } else {
                  addr = sock.daddr;
                  port = sock.dport;
                }
                var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
                if (sock.type === 1) {
                  if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                    throw new FS.ErrnoError(53);
                  }
                }
                if (ArrayBuffer.isView(buffer)) {
                  offset += buffer.byteOffset;
                  buffer = buffer.buffer;
                }
                var data = buffer.slice(offset, offset + length);
                if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
                  if (sock.type === 2) {
                    if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                      dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
                    }
                  }
                  dest.msg_send_queue.push(data);
                  return length;
                }
                try {
                  dest.socket.send(data);
                  return length;
                } catch (e) {
                  throw new FS.ErrnoError(28);
                }
              },
              recvmsg: function recvmsg(sock, length, flags) {
                if (sock.type === 1 && sock.server) {
                  throw new FS.ErrnoError(53);
                }
                var peek = flags & 2;
                var queued = sock.recv_queue[0];
                if (!queued) {
                  if (sock.type === 1) {
                    var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
                    if (!dest) {
                      throw new FS.ErrnoError(53);
                    }
                    if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                      return null;
                    }
                    throw new FS.ErrnoError(6);
                  }
                  throw new FS.ErrnoError(6);
                }
                var queuedLength = queued.data.byteLength || queued.data.length;
                var queuedOffset = queued.data.byteOffset || 0;
                var queuedBuffer = queued.data.buffer || queued.data;
                var bytesRead = Math.min(length, queuedLength);
                var res = {
                  buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
                  addr: queued.addr,
                  port: queued.port
                };
                if (peek) return res;
                sock.recv_queue.shift();
                if (sock.type === 1 && bytesRead < queuedLength) {
                  var bytesRemaining = queuedLength - bytesRead;
                  queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
                  sock.recv_queue.unshift(queued);
                }
                return res;
              }
            }
          };
          getSocketFromFD = function getSocketFromFD(fd) {
            var socket = SOCKFS.getSocket(fd);
            if (!socket) throw new FS.ErrnoError(8);
            return socket;
          };
          inetNtop4 = function inetNtop4(addr) {
            return (addr & 255) + "." + (addr >> 8 & 255) + "." + (addr >> 16 & 255) + "." + (addr >> 24 & 255);
          };
          inetNtop6 = function inetNtop6(ints) {
            var str = "";
            var word = 0;
            var longest = 0;
            var lastzero = 0;
            var zstart = 0;
            var len = 0;
            var i = 0;
            var parts = [ints[0] & 65535, ints[0] >> 16, ints[1] & 65535, ints[1] >> 16, ints[2] & 65535, ints[2] >> 16, ints[3] & 65535, ints[3] >> 16];
            var hasipv4 = true;
            var v4part = "";
            for (i = 0; i < 5; i++) {
              if (parts[i]) {
                hasipv4 = false;
                break;
              }
            }
            if (hasipv4) {
              v4part = inetNtop4(parts[6] | parts[7] << 16);
              if (parts[5] === -1) {
                str = "::ffff:";
                str += v4part;
                return str;
              }
              if (!parts[5]) {
                str = "::";
                if (v4part === "0.0.0.0") v4part = "";
                if (v4part === "0.0.0.1") v4part = "1";
                str += v4part;
                return str;
              }
            }
            for (word = 0; word < 8; word++) {
              if (!parts[word]) {
                if (word - lastzero > 1) {
                  len = 0;
                }
                lastzero = word;
                len++;
              }
              if (len > longest) {
                longest = len;
                zstart = word - longest + 1;
              }
            }
            for (word = 0; word < 8; word++) {
              if (longest > 1) {
                if (!parts[word] && word >= zstart && word < zstart + longest) {
                  if (word === zstart) {
                    str += ":";
                    if (!zstart) str += ":";
                  }
                  continue;
                }
              }
              str += Number(_ntohs(parts[word] & 65535)).toString(16);
              str += word < 7 ? ":" : "";
            }
            return str;
          };
          readSockaddr = function readSockaddr(sa, salen) {
            var family = HEAP16[sa >> 1];
            var port = _ntohs(HEAPU16[sa + 2 >> 1]);
            var addr;
            switch (family) {
              case 2:
                if (salen !== 16) {
                  return {
                    errno: 28
                  };
                }
                addr = HEAP32[sa + 4 >> 2];
                addr = inetNtop4(addr);
                break;
              case 10:
                if (salen !== 28) {
                  return {
                    errno: 28
                  };
                }
                addr = [HEAP32[sa + 8 >> 2], HEAP32[sa + 12 >> 2], HEAP32[sa + 16 >> 2], HEAP32[sa + 20 >> 2]];
                addr = inetNtop6(addr);
                break;
              default:
                return {
                  errno: 5
                };
            }
            return {
              family: family,
              addr: addr,
              port: port
            };
          };
          inetPton4 = function inetPton4(str) {
            var b = str.split(".");
            for (var i = 0; i < 4; i++) {
              var tmp = Number(b[i]);
              if (isNaN(tmp)) return null;
              b[i] = tmp;
            }
            return (b[0] | b[1] << 8 | b[2] << 16 | b[3] << 24) >>> 0;
          };
          inetPton6 = function inetPton6(str) {
            var words;
            var w, offset, z;
            var valid6regx = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
            var parts = [];
            if (!valid6regx.test(str)) {
              return null;
            }
            if (str === "::") {
              return [0, 0, 0, 0, 0, 0, 0, 0];
            }
            if (str.startsWith("::")) {
              str = str.replace("::", "Z:");
            } else {
              str = str.replace("::", ":Z:");
            }
            if (str.indexOf(".") > 0) {
              str = str.replace(new RegExp("[.]", "g"), ":");
              words = str.split(":");
              words[words.length - 4] = Number(words[words.length - 4]) + Number(words[words.length - 3]) * 256;
              words[words.length - 3] = Number(words[words.length - 2]) + Number(words[words.length - 1]) * 256;
              words = words.slice(0, words.length - 2);
            } else {
              words = str.split(":");
            }
            offset = 0;
            z = 0;
            for (w = 0; w < words.length; w++) {
              if (typeof words[w] == "string") {
                if (words[w] === "Z") {
                  for (z = 0; z < 8 - words.length + 1; z++) {
                    parts[w + z] = 0;
                  }
                  offset = z - 1;
                } else {
                  parts[w + offset] = _htons(parseInt(words[w], 16));
                }
              } else {
                parts[w + offset] = words[w];
              }
            }
            return [parts[1] << 16 | parts[0], parts[3] << 16 | parts[2], parts[5] << 16 | parts[4], parts[7] << 16 | parts[6]];
          };
          DNS = {
            address_map: {
              id: 1,
              addrs: {},
              names: {}
            },
            lookup_name: function lookup_name(name) {
              var res = inetPton4(name);
              if (res !== null) {
                return name;
              }
              res = inetPton6(name);
              if (res !== null) {
                return name;
              }
              var addr;
              if (DNS.address_map.addrs[name]) {
                addr = DNS.address_map.addrs[name];
              } else {
                var id = DNS.address_map.id++;
                addr = "172.29." + (id & 255) + "." + (id & 65280);
                DNS.address_map.names[addr] = name;
                DNS.address_map.addrs[name] = addr;
              }
              return addr;
            },
            lookup_addr: function lookup_addr(addr) {
              if (DNS.address_map.names[addr]) {
                return DNS.address_map.names[addr];
              }
              return null;
            }
          };
          getSocketAddress = function getSocketAddress(addrp, addrlen) {
            var info = readSockaddr(addrp, addrlen);
            if (info.errno) throw new FS.ErrnoError(info.errno);
            info.addr = DNS.lookup_addr(info.addr) || info.addr;
            return info;
          };
          syscallGetVarargI = function syscallGetVarargI() {
            var ret = HEAP32[+SYSCALLS.varargs >> 2];
            SYSCALLS.varargs += 4;
            return ret;
          };
          syscallGetVarargP = syscallGetVarargI;
          INT53_MAX = 9007199254740992;
          INT53_MIN = -9007199254740992;
          bigintToI53Checked = function bigintToI53Checked(num) {
            return num < INT53_MIN || num > INT53_MAX ? NaN : Number(num);
          };
          stringToUTF8 = function stringToUTF8(str, outPtr, maxBytesToWrite) {
            return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
          };
          ___syscall_getegid32 = function ___syscall_getegid32() {
            return 0;
          };
          ___syscall_geteuid32 = function ___syscall_geteuid32() {
            return 0;
          };
          ___syscall_getgid32 = function ___syscall_getgid32() {
            return 0;
          };
          writeSockaddr = function writeSockaddr(sa, family, addr, port, addrlen) {
            switch (family) {
              case 2:
                addr = inetPton4(DNS.lookup_name(addr));
                zeroMemory(sa, 16);
                if (addrlen) {
                  HEAP32[addrlen >> 2] = 16;
                }
                HEAP16[sa >> 1] = family;
                HEAP32[sa + 4 >> 2] = addr;
                HEAP16[sa + 2 >> 1] = _htons(port);
                break;
              case 10:
                addr = inetPton6(DNS.lookup_name(addr));
                zeroMemory(sa, 28);
                if (addrlen) {
                  HEAP32[addrlen >> 2] = 28;
                }
                HEAP32[sa >> 2] = family;
                HEAP32[sa + 8 >> 2] = addr[0];
                HEAP32[sa + 12 >> 2] = addr[1];
                HEAP32[sa + 16 >> 2] = addr[2];
                HEAP32[sa + 20 >> 2] = addr[3];
                HEAP16[sa + 2 >> 1] = _htons(port);
                break;
              default:
                return 5;
            }
            return 0;
          };
          ___syscall_getuid32 = function ___syscall_getuid32() {
            return 0;
          };
          pollOne = function pollOne(fd, events) {
            var _stream$stream_ops$po, _stream$stream_ops3, _stream$stream_ops3$p;
            var stream = FS.getStream(fd);
            if (!stream) return 32;
            var flags = (_stream$stream_ops$po = (_stream$stream_ops3 = stream.stream_ops) === null || _stream$stream_ops3 === void 0 || (_stream$stream_ops3$p = _stream$stream_ops3.poll) === null || _stream$stream_ops3$p === void 0 ? void 0 : _stream$stream_ops3$p.call(_stream$stream_ops3, stream)) !== null && _stream$stream_ops$po !== void 0 ? _stream$stream_ops$po : 5;
            return flags & (events | 8 | 16 | 32);
          };
          doPollSync = function doPollSync(fds, nfds) {
            var count = 0;
            for (var i = 0, pollfd = fds; i < nfds; i++, pollfd += 8) {
              var revents = pollOne(HEAP32[pollfd >> 2], HEAP16[pollfd + 4 >> 1]);
              if (revents) count++;
              HEAP16[pollfd + 6 >> 1] = revents;
            }
            return count;
          };
          readI53FromI64 = function readI53FromI64(ptr) {
            return HEAPU32[ptr >> 2] + HEAP32[ptr + 4 >> 2] * 4294967296;
          };
          __abort_js = function __abort_js() {
            return abort("");
          };
          jsStackTrace = function jsStackTrace() {
            return new Error().stack.toString();
          };
          getCallstack = function getCallstack(flags) {
            var callstack = jsStackTrace();
            var lines = callstack.split("\n");
            callstack = "";
            var firefoxRe = new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)");
            var chromeRe = new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");
            var _iterator1 = _createForOfIteratorHelper(lines),
              _step1;
            try {
              for (_iterator1.s(); !(_step1 = _iterator1.n()).done;) {
                var _parts;
                var line = _step1.value;
                var symbolName = "";
                var file = "";
                var lineno = 0;
                var column = 0;
                var parts = chromeRe.exec(line);
                if (((_parts = parts) === null || _parts === void 0 ? void 0 : _parts.length) == 5) {
                  symbolName = parts[1];
                  file = parts[2];
                  lineno = parts[3];
                  column = parts[4];
                } else {
                  var _parts2;
                  parts = firefoxRe.exec(line);
                  if (((_parts2 = parts) === null || _parts2 === void 0 ? void 0 : _parts2.length) >= 4) {
                    symbolName = parts[1];
                    file = parts[2];
                    lineno = parts[3];
                    column = parts[4] | 0;
                  } else {
                    callstack += line + "\n";
                    continue;
                  }
                }
                if (symbolName == "_emscripten_log" || symbolName == "_emscripten_get_callstack") {
                  callstack = "";
                  continue;
                }
                if (flags & 24) {
                  if (flags & 64) {
                    file = file.substring(file.replace(/\\/g, "/").lastIndexOf("/") + 1);
                  }
                  callstack += "    at ".concat(symbolName, " (").concat(file, ":").concat(lineno, ":").concat(column, ")\n");
                }
              }
            } catch (err) {
              _iterator1.e(err);
            } finally {
              _iterator1.f();
            }
            callstack = callstack.replace(/\s+$/, "");
            return callstack;
          };
          __emscripten_log_formatted = function __emscripten_log_formatted(flags, str) {
            str = UTF8ToString(str);
            if (flags & 24) {
              str = str.replace(/\s+$/, "");
              str += (str.length > 0 ? "\n" : "") + getCallstack(flags);
            }
            if (flags & 1) {
              if (flags & 4) {
                console.error(str);
              } else if (flags & 2) {
                console.warn(str);
              } else if (flags & 512) {
                console.info(str);
              } else if (flags & 256) {
                console.debug(str);
              } else {
                console.log(str);
              }
            } else if (flags & 6) {
              err(str);
            } else {
              out(str);
            }
          };
          isLeapYear = function isLeapYear(year) {
            return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
          };
          MONTH_DAYS_LEAP_CUMULATIVE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
          MONTH_DAYS_REGULAR_CUMULATIVE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
          ydayFromDate = function ydayFromDate(date) {
            var leap = isLeapYear(date.getFullYear());
            var monthDaysCumulative = leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE;
            var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
            return yday;
          };
          __tzset_js = function __tzset_js(timezone, daylight, std_name, dst_name) {
            var currentYear = new Date().getFullYear();
            var winter = new Date(currentYear, 0, 1);
            var summer = new Date(currentYear, 6, 1);
            var winterOffset = winter.getTimezoneOffset();
            var summerOffset = summer.getTimezoneOffset();
            var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
            HEAPU32[timezone >> 2] = stdTimezoneOffset * 60;
            HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);
            var extractZone = function extractZone(timezoneOffset) {
              var sign = timezoneOffset >= 0 ? "-" : "+";
              var absOffset = Math.abs(timezoneOffset);
              var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
              var minutes = String(absOffset % 60).padStart(2, "0");
              return "UTC".concat(sign).concat(hours).concat(minutes);
            };
            var winterName = extractZone(winterOffset);
            var summerName = extractZone(summerOffset);
            if (summerOffset < winterOffset) {
              stringToUTF8(winterName, std_name, 17);
              stringToUTF8(summerName, dst_name, 17);
            } else {
              stringToUTF8(winterName, dst_name, 17);
              stringToUTF8(summerName, std_name, 17);
            }
          };
          _emscripten_get_now = function _emscripten_get_now() {
            return performance.now();
          };
          _emscripten_date_now = function _emscripten_date_now() {
            return Date.now();
          };
          nowIsMonotonic = 1;
          checkWasiClock = function checkWasiClock(clock_id) {
            return clock_id >= 0 && clock_id <= 3;
          };
          readEmAsmArgsArray = [];
          readEmAsmArgs = function readEmAsmArgs(sigPtr, buf) {
            readEmAsmArgsArray.length = 0;
            var ch;
            while (ch = HEAPU8[sigPtr++]) {
              var wide = ch != 105;
              wide &= ch != 112;
              buf += wide && buf % 8 ? 4 : 0;
              readEmAsmArgsArray.push(ch == 112 ? HEAPU32[buf >> 2] : ch == 106 ? HEAP64[buf >> 3] : ch == 105 ? HEAP32[buf >> 2] : HEAPF64[buf >> 3]);
              buf += wide ? 8 : 4;
            }
            return readEmAsmArgsArray;
          };
          runEmAsmFunction = function runEmAsmFunction(code, sigPtr, argbuf) {
            var args = readEmAsmArgs(sigPtr, argbuf);
            return ASM_CONSTS[code].apply(ASM_CONSTS, _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3___default()(args));
          };
          _emscripten_asm_const_int = function _emscripten_asm_const_int(code, sigPtr, argbuf) {
            return runEmAsmFunction(code, sigPtr, argbuf);
          };
          _emscripten_exit_with_live_runtime = function _emscripten_exit_with_live_runtime() {
            throw "unwind";
          };
          getHeapMax = function getHeapMax() {
            return 2147483648;
          };
          _emscripten_get_heap_max = function _emscripten_get_heap_max() {
            return getHeapMax();
          };
          growMemory = function growMemory(size) {
            var oldHeapSize = wasmMemory.buffer.byteLength;
            var pages = (size - oldHeapSize + 65535) / 65536 | 0;
            try {
              wasmMemory.grow(pages);
              updateMemoryViews();
              return 1;
            } catch (e) {}
          };
          _emscripten_resize_heap = function _emscripten_resize_heap(requestedSize) {
            var oldSize = HEAPU8.length;
            requestedSize >>>= 0;
            var maxHeapSize = getHeapMax();
            if (requestedSize > maxHeapSize) {
              return false;
            }
            for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
              var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
              overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
              var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
              var replacement = growMemory(newSize);
              if (replacement) {
                return true;
              }
            }
            return false;
          };
          ENV = {};
          getExecutableName = function getExecutableName() {
            return thisProgram;
          };
          _getEnvStrings = function getEnvStrings() {
            if (!_getEnvStrings.strings) {
              var _globalThis$navigator, _globalThis$navigator2;
              var lang = ((_globalThis$navigator = (_globalThis$navigator2 = globalThis.navigator) === null || _globalThis$navigator2 === void 0 ? void 0 : _globalThis$navigator2.language) !== null && _globalThis$navigator !== void 0 ? _globalThis$navigator : "C").replace("-", "_") + ".UTF-8";
              var env = {
                USER: "web_user",
                LOGNAME: "web_user",
                PATH: "/",
                PWD: "/",
                HOME: "/home/web_user",
                LANG: lang,
                _: getExecutableName()
              };
              for (var x in ENV) {
                if (ENV[x] === undefined) delete env[x];else env[x] = ENV[x];
              }
              var strings = [];
              for (var x in env) {
                strings.push("".concat(x, "=").concat(env[x]));
              }
              _getEnvStrings.strings = strings;
            }
            return _getEnvStrings.strings;
          };
          _environ_get = function _environ_get(__environ, environ_buf) {
            var bufSize = 0;
            var envp = 0;
            var _iterator10 = _createForOfIteratorHelper(_getEnvStrings()),
              _step10;
            try {
              for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
                var string = _step10.value;
                var ptr = environ_buf + bufSize;
                HEAPU32[__environ + envp >> 2] = ptr;
                bufSize += stringToUTF8(string, ptr, Infinity) + 1;
                envp += 4;
              }
            } catch (err) {
              _iterator10.e(err);
            } finally {
              _iterator10.f();
            }
            return 0;
          };
          _environ_sizes_get = function _environ_sizes_get(penviron_count, penviron_buf_size) {
            var strings = _getEnvStrings();
            HEAPU32[penviron_count >> 2] = strings.length;
            var bufSize = 0;
            var _iterator11 = _createForOfIteratorHelper(strings),
              _step11;
            try {
              for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
                var string = _step11.value;
                bufSize += lengthBytesUTF8(string) + 1;
              }
            } catch (err) {
              _iterator11.e(err);
            } finally {
              _iterator11.f();
            }
            HEAPU32[penviron_buf_size >> 2] = bufSize;
            return 0;
          };
          doReadv = function doReadv(stream, iov, iovcnt, offset) {
            var ret = 0;
            for (var i = 0; i < iovcnt; i++) {
              var ptr = HEAPU32[iov >> 2];
              var len = HEAPU32[iov + 4 >> 2];
              iov += 8;
              try {
                var curr = FS.read(stream, HEAP8, ptr, len, offset);
              } catch (e) {
                if (ret > 0 && e instanceof FS.ErrnoError && (e.errno == 6 || e.errno == 6)) {
                  break;
                }
                throw e;
              }
              if (curr < 0) return -1;
              ret += curr;
              if (curr < len) break;
              if (typeof offset != "undefined") {
                offset += curr;
              }
            }
            return ret;
          };
          doWritev = function doWritev(stream, iov, iovcnt, offset) {
            if (iovcnt == 1) {
              return FS.write(stream, HEAP8, HEAPU32[iov >> 2], HEAPU32[iov + 4 >> 2], offset);
            }
            var total = 0;
            for (var i = 0, p = iov; i < iovcnt; i++, p += 8) {
              total += HEAPU32[p + 4 >> 2];
            }
            var view = new Uint8Array(total);
            var voff = 0;
            for (var i = 0; i < iovcnt; i++, iov += 8) {
              var ptr = HEAPU32[iov >> 2];
              var len = HEAPU32[iov + 4 >> 2];
              view.set(HEAPU8.subarray(ptr, ptr + len), voff);
              voff += len;
            }
            return FS.write(stream, view, 0, total, offset);
          };
          _getaddrinfo = function _getaddrinfo(node, service, hint, out) {
            var addr = 0;
            var port = 0;
            var flags = 0;
            var family = 0;
            var type = 0;
            var proto = 0;
            var ai;
            function allocaddrinfo(family, type, proto, canon, addr, port) {
              var sa, salen, ai;
              var errno;
              salen = family === 10 ? 28 : 16;
              addr = family === 10 ? inetNtop6(addr) : inetNtop4(addr);
              sa = _malloc(salen);
              errno = writeSockaddr(sa, family, addr, port);
              ai = _malloc(32);
              HEAP32[ai + 4 >> 2] = family;
              HEAP32[ai + 8 >> 2] = type;
              HEAP32[ai + 12 >> 2] = proto;
              HEAPU32[ai + 24 >> 2] = canon;
              HEAPU32[ai + 20 >> 2] = sa;
              if (family === 10) {
                HEAP32[ai + 16 >> 2] = 28;
              } else {
                HEAP32[ai + 16 >> 2] = 16;
              }
              HEAP32[ai + 28 >> 2] = 0;
              return ai;
            }
            if (hint) {
              flags = HEAP32[hint >> 2];
              family = HEAP32[hint + 4 >> 2];
              type = HEAP32[hint + 8 >> 2];
              proto = HEAP32[hint + 12 >> 2];
            }
            if (type && !proto) {
              proto = type === 2 ? 17 : 6;
            }
            if (!type && proto) {
              type = proto === 17 ? 2 : 1;
            }
            if (!proto) {
              proto = 6;
            }
            if (!type) {
              type = 1;
            }
            if (!node && !service) {
              return -2;
            }
            if (flags & ~(1 | 2 | 4 | 1024 | 8 | 16 | 32)) {
              return -1;
            }
            if (hint && HEAP32[hint >> 2] & 2 && !node) {
              return -1;
            }
            if (flags & 32) {
              return -2;
            }
            if (type && type !== 1 && type !== 2) {
              return -7;
            }
            if (family !== 0 && family !== 2 && family !== 10) {
              return -6;
            }
            if (service) {
              service = UTF8ToString(service);
              port = parseInt(service, 10);
              if (isNaN(port)) {
                if (flags & 1024) {
                  return -2;
                }
                return -8;
              }
            }
            if (!node) {
              if (family === 0) {
                family = 2;
              }
              if (!(flags & 1)) {
                if (family === 2) {
                  addr = _htonl(2130706433);
                } else {
                  addr = [0, 0, 0, _htonl(1)];
                }
              }
              ai = allocaddrinfo(family, type, proto, null, addr, port);
              HEAPU32[out >> 2] = ai;
              return 0;
            }
            node = UTF8ToString(node);
            addr = inetPton4(node);
            if (addr !== null) {
              if (family === 0 || family === 2) {
                family = 2;
              } else if (family === 10 && flags & 8) {
                addr = [0, 0, _htonl(65535), addr];
                family = 10;
              } else {
                return -2;
              }
            } else {
              addr = inetPton6(node);
              if (addr !== null) {
                if (family === 0 || family === 10) {
                  family = 10;
                } else {
                  return -2;
                }
              }
            }
            if (addr != null) {
              ai = allocaddrinfo(family, type, proto, node, addr, port);
              HEAPU32[out >> 2] = ai;
              return 0;
            }
            if (flags & 4) {
              return -2;
            }
            node = DNS.lookup_name(node);
            addr = inetPton4(node);
            if (family === 0) {
              family = 2;
            } else if (family === 10) {
              addr = [0, 0, _htonl(65535), addr];
            }
            ai = allocaddrinfo(family, type, proto, null, addr, port);
            HEAPU32[out >> 2] = ai;
            return 0;
          };
          _random_get = function _random_get(buffer, size) {
            return _randomFill(HEAPU8.subarray(buffer, buffer + size));
          };
          runtimeKeepaliveCounter = 0;
          keepRuntimeAlive = function keepRuntimeAlive() {
            return noExitRuntime || runtimeKeepaliveCounter > 0;
          };
          _proc_exit = function _proc_exit(code) {
            EXITSTATUS = code;
            if (!keepRuntimeAlive()) {
              var _Module$onExit;
              (_Module$onExit = Module["onExit"]) === null || _Module$onExit === void 0 || _Module$onExit.call(Module, code);
              ABORT = true;
            }
            quit_(code, new ExitStatus(code));
          };
          exitJS = function exitJS(status, implicit) {
            EXITSTATUS = status;
            _proc_exit(status);
          };
          handleException = function handleException(e) {
            if (e instanceof ExitStatus || e == "unwind") {
              return EXITSTATUS;
            }
            quit_(1, e);
          };
          getCFunc = function getCFunc(ident) {
            var func = Module["_" + ident];
            return func;
          };
          writeArrayToMemory = function writeArrayToMemory(array, buffer) {
            HEAP8.set(array, buffer);
          };
          stackAlloc = function stackAlloc(sz) {
            return __emscripten_stack_alloc(sz);
          };
          stringToUTF8OnStack = function stringToUTF8OnStack(str) {
            var size = lengthBytesUTF8(str) + 1;
            var ret = stackAlloc(size);
            stringToUTF8(str, ret, size);
            return ret;
          };
          ccall = function ccall(ident, returnType, argTypes, args, opts) {
            var toC = {
              string: function string(str) {
                var ret = 0;
                if (str !== null && str !== undefined && str !== 0) {
                  ret = stringToUTF8OnStack(str);
                }
                return ret;
              },
              array: function array(arr) {
                var ret = stackAlloc(arr.length);
                writeArrayToMemory(arr, ret);
                return ret;
              }
            };
            function convertReturnValue(ret) {
              if (returnType === "string") {
                return UTF8ToString(ret);
              }
              if (returnType === "boolean") return Boolean(ret);
              return ret;
            }
            var func = getCFunc(ident);
            var cArgs = [];
            var stack = 0;
            if (args) {
              for (var i = 0; i < args.length; i++) {
                var converter = toC[argTypes[i]];
                if (converter) {
                  if (!stack) stack = stackSave();
                  cArgs[i] = converter(args[i]);
                } else {
                  cArgs[i] = args[i];
                }
              }
            }
            var ret = func.apply(void 0, cArgs);
            function onDone(ret) {
              if (stack) stackRestore(stack);
              return convertReturnValue(ret);
            }
            ret = onDone(ret);
            return ret;
          };
          cwrap = function cwrap(ident, returnType, argTypes, opts) {
            var numericArgs = !argTypes || argTypes.every(function (type) {
              return type === "number" || type === "boolean";
            });
            var numericRet = returnType !== "string";
            if (numericRet && numericArgs && !opts) {
              return getCFunc(ident);
            }
            return function () {
              for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
              }
              return ccall(ident, returnType, argTypes, args, opts);
            };
          };
          FS.createPreloadedFile = FS_createPreloadedFile;
          FS.preloadFile = FS_preloadFile;
          FS.staticInit();
          if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
          if (Module["print"]) out = Module["print"];
          if (Module["printErr"]) err = Module["printErr"];
          if (Module["arguments"]) programArgs = Module["arguments"];
          if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
          preInit = Module["preInit"];
          if (preInit) {
            if (typeof preInit == "function") Module["preInit"] = preInit = [preInit];
            while (preInit.length > 0) {
              preInit.shift()();
            }
          }
          Module["cwrap"] = cwrap;
          Module["FS"] = FS;
          ASM_CONSTS = {
            1766196: function _() {
              function detectOsName() {
                if ((typeof process === "undefined" ? "undefined" : _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(process)) === "object" && typeof process.platform === "string") {
                  switch (process.platform) {
                    case "aix":
                      return "IBM AIX";
                    case "android":
                      return "Android";
                    case "darwin":
                      return "macOS";
                    case "freebsd":
                      return "FreeBSD";
                    case "linux":
                      return "Linux";
                    case "openbsd":
                      return "OpenBSD";
                    case "sunos":
                      return "SunOS";
                    case "win32":
                      return "Windows";
                    case "darwin":
                      return "macOS";
                    default:
                      return "Node.js";
                  }
                }
                var userAgent = "Unknown";
                if ((typeof window === "undefined" ? "undefined" : _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(window)) === "object") {
                  userAgent = window.navigator.userAgent;
                } else if (typeof importScripts === "function") {
                  userAgent = navigator.userAgent;
                }
                var match = /(Mac OS|Mac OS X|MacPPC|MacIntel|Mac_PowerPC|Macintosh) ([._0-9]+)/.exec(userAgent);
                if (match !== null) {
                  return "macOS " + match[2].replace("_", ".");
                }
                match = /Android [._0-9]+/.exec(userAgent);
                if (match !== null) {
                  return match[0].replace("_", ".");
                }
                if (/(iPhone|iPad|iPod)/.test(userAgent)) {
                  match = /OS ([._0-9]+)/.exec(userAgent);
                  if (match !== null) {
                    return "iOS " + match[1].replace("_", ".");
                  }
                  return "iOS";
                }
                var clientStrings = [{
                  s: "Windows 11",
                  r: /(Windows 11|Windows NT 11)/
                }, {
                  s: "Windows 8.1",
                  r: /(Windows 8.1|Windows NT 6.3)/
                }, {
                  s: "Windows 8",
                  r: /(Windows 8|Windows NT 6.2)/
                }, {
                  s: "Windows 7",
                  r: /(Windows 7|Windows NT 6.1)/
                }, {
                  s: "Windows Vista",
                  r: /Windows NT 6.0/
                }, {
                  s: "Windows Server 2003",
                  r: /Windows NT 5.2/
                }, {
                  s: "Windows XP",
                  r: /(Windows XP|Windows NT 5.1)/
                }, {
                  s: "Windows",
                  r: /Windows/
                }, {
                  s: "Android",
                  r: /Android/
                }, {
                  s: "FreeBSD",
                  r: /FreeBSD/
                }, {
                  s: "OpenBSD",
                  r: /OpenBSD/
                }, {
                  s: "Chrome OS",
                  r: /CrOS/
                }, {
                  s: "Linux",
                  r: /(Linux|X11)/
                }, {
                  s: "macOS",
                  r: /(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
                }, {
                  s: "QNX",
                  r: /QNX/
                }, {
                  s: "BeOS",
                  r: /BeOS/
                }];
                for (var id in clientStrings) {
                  var cs = clientStrings[id];
                  if (cs.r.test(userAgent)) {
                    return cs.s;
                  }
                }
                return "Emscripten";
              }
              var os_name = detectOsName();
              var length = lengthBytesUTF8(os_name) + 1;
              var result = _malloc(length);
              stringToUTF8(os_name, result, length);
              return result;
            },
            1768199: function _($0) {
              throw UTF8ToString($0);
            }
          };
          wasmImports = {
            ca: ___syscall_chmod,
            t: ___syscall_connect,
            n: ___syscall_dup3,
            H: ___syscall_faccessat,
            da: ___syscall_fchmod,
            ba: ___syscall_fchown32,
            a: ___syscall_fcntl64,
            $: ___syscall_fstat64,
            W: ___syscall_ftruncate64,
            V: ___syscall_getcwd,
            E: ___syscall_getdents64,
            U: ___syscall_getegid32,
            i: ___syscall_geteuid32,
            R: ___syscall_getgid32,
            s: ___syscall_getpeername,
            r: ___syscall_getsockname,
            q: ___syscall_getsockopt,
            h: ___syscall_getuid32,
            aa: ___syscall_ioctl,
            Y: ___syscall_lstat64,
            O: ___syscall_mkdirat,
            Z: ___syscall_newfstatat,
            l: ___syscall_openat,
            f: ___syscall_poll,
            I: ___syscall_poll_nonblocking,
            D: ___syscall_readlinkat,
            C: ___syscall_renameat,
            B: ___syscall_rmdir,
            p: ___syscall_sendmsg,
            e: ___syscall_setsockopt,
            o: ___syscall_socket,
            _: ___syscall_stat64,
            z: ___syscall_unlinkat,
            y: ___syscall_utimensat,
            Q: __abort_js,
            m: __emscripten_log_formatted,
            L: __gmtime_js,
            M: __localtime_js,
            J: __mmap_js,
            K: __munmap_js,
            N: __tzset_js,
            x: _clock_time_get,
            j: _emscripten_asm_const_int,
            d: _emscripten_date_now,
            fa: _emscripten_exit_with_live_runtime,
            A: _emscripten_get_heap_max,
            g: _emscripten_get_now,
            v: _emscripten_resize_heap,
            S: _environ_get,
            T: _environ_sizes_get,
            b: _fd_close,
            w: _fd_fdstat_get,
            G: _fd_pread,
            F: _fd_pwrite,
            k: _fd_read,
            P: _fd_seek,
            X: _fd_sync,
            c: _fd_write,
            ea: _getaddrinfo,
            u: _random_get
          };
          _context10.n = 1;
          return createWasm();
        case 1:
          wasmExports = _context10.v;
          _context10.n = 2;
          return run();
        case 2:
          createTdwebModule.ready.FS = Module.FS;
          ;
          return _context10.a(2, Module);
      }
    }, _callee10);
  }));
}();
if ((typeof exports === "undefined" ? "undefined" : _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(exports)) === "object" && ( false ? undefined : _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(module)) === "object") {
  module.exports = createTdwebModule;
  module.exports["default"] = createTdwebModule;
} else if (typeof define === "function" && __webpack_require__(29)) define([], function () {
  return createTdwebModule;
});
/* WEBPACK VAR INJECTION */}.call(this, "/index.js", "/", __webpack_require__(9), __webpack_require__(10).Buffer, __webpack_require__(14)(module)))

/***/ })
]);