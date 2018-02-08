'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggle_a = exports.filterVal_a = exports.push_a = exports.remove_a = exports.over_a = exports.set_a = exports.createMutation = exports.view_ = exports.over_ = exports.set_ = exports.lens_ = exports.push = exports.enhancer = exports.metaReducer = undefined;

var _ramda = require('ramda');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var LIB_NAME = 'DEMUT';
var SHOULD_BE_HANDLED = 'THIS_ACTION_SHOULD_BE_HANDLED_BY_' + LIB_NAME;

var metaReducer = exports.metaReducer = function metaReducer(reducer) {
  return function (state, action) {
    var actionData = action[SHOULD_BE_HANDLED] ? action : action.payload && action.payload[SHOULD_BE_HANDLED] ? action.payload : null;

    if (actionData) return demutReducer(state, actionData);

    return reducer(state, action);
  };
};

function demutReducer(state, action) {
  var path = action.path,
      mutation = action.mutation,
      args = action.args,
      handler = action.handler;


  return lensMutations[mutation].apply(lensMutations, [path].concat(_toConsumableArray(args)))(state);
}

var enhancer = exports.enhancer = function enhancer(createStore) {
  return function (rootReducer, initialState) {
    return createStore(metaReducer(rootReducer), initialState);
  };
};

// default mutations
var push = exports.push = (0, _ramda.curry)(function (x, arr) {
  return (arr || []).concat(x);
});

var lens = function lens(x) {
  return typeof x === 'number' ? (0, _ramda.lensIndex)(x) : typeof x === 'string' ? lensProp(x) : new Error('All arguments to lens must be either integers or strings');
};

var lensPath = function lensPath(p) {
  return _ramda.compose.apply(undefined, _toConsumableArray((0, _ramda.map)(lens, p)));
};

var lens_ = exports.lens_ = (0, _ramda.memoize)(function (p) {
  return (Array.isArray(p) ? lensPath : lens)(p);
});

var set_ = exports.set_ = (0, _ramda.curry)(function (p, x, o) {
  return set(lens_(p), x, o);
});

var over_ = exports.over_ = (0, _ramda.curry)(function (p, f, o) {
  return over(lens_(p), f, o);
});

var view_ = exports.view_ = (0, _ramda.curry)(function (p, o) {
  return view(lens_(p), o);
});

var lensMutations = {
  set_: set_,
  over_: over_,
  remove_: function remove_(path, start, count) {
    return over_(path, (0, _ramda.remove)(start, count));
  },
  push_: function push_(path, x) {
    return over_(path, push(x));
  },
  filterVal_: function filterVal_(path, x) {
    return over_(path, function (s) {
      return s.filter(function (y) {
        return y !== x;
      });
    });
  },
  toggle_: function toggle_(path) {
    return over_(path, function (s) {
      return !s;
    });
  }
};

var createMutation = exports.createMutation = function createMutation(name) {
  return function (path) {
    var _ref;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return _ref = {}, _defineProperty(_ref, SHOULD_BE_HANDLED, true), _defineProperty(_ref, 'path', path), _defineProperty(_ref, 'mutation', name), _defineProperty(_ref, 'args', args), _ref;
  };
};

var set_a = exports.set_a = createMutation('set_');

var over_a = exports.over_a = createMutation('over_');

var remove_a = exports.remove_a = createMutation('remove_');

var push_a = exports.push_a = createMutation('push_');

var filterVal_a = exports.filterVal_a = createMutation('filterVal_');

var toggle_a = exports.toggle_a = createMutation('toggle_');
