"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
// referr to https://github.com/redux-saga/redux-saga/issues/697
var createExposedPromise = function () {
    var deferred = {};
    // $FlowFixMe
    var promise = new Promise(function (resolve, reject) {
        // @ts-ignore
        deferred.resolve = resolve;
        // @ts-ignore
        deferred.reject = reject;
    });
    return [promise, deferred];
};
// For create our own redux middleware, refer to https://redux.js.org/advanced/middleware
// $FlowFixMe
exports.default = (function () { return function (next) { return function (action) {
    // Skip actions that don't end with "Saga"
    if (!action.type.endsWith('Saga')) {
        return next(action);
    }
    var _a = createExposedPromise(), promise = _a[0], deferred = _a[1];
    var newActions = __assign({}, action, { deferred: deferred });
    next(newActions);
    return promise;
}; }; });
