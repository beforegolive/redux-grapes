"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_actions_1 = require("redux-actions");
// import _ from 'lodash'
// const actionMap = {}
exports.createActions = function (obj, prefix) {
    if (prefix === void 0) { prefix = ''; }
    // const objProxy = {}
    var objProxy = {};
    Object.keys(obj).forEach(function (e) {
        var actionType = prefix + "_" + e;
        // @ts-ignore
        objProxy[e] = redux_actions_1.createAction(actionType, obj[e].bind(objProxy));
        objProxy[e].toString = function () { return actionType; };
    });
    return objProxy;
};
