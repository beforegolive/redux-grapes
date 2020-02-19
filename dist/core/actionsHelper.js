import { createAction } from 'redux-actions';
// import _ from 'lodash'
// const actionMap = {}
export var createActions = function (obj, prefix) {
    if (prefix === void 0) { prefix = ''; }
    // const objProxy = {}
    var objProxy = {};
    Object.keys(obj).forEach(function (e) {
        var actionType = prefix + "_" + e;
        // @ts-ignore
        objProxy[e] = createAction(actionType, obj[e].bind(objProxy));
        objProxy[e].toString = function () { return actionType; };
    });
    return objProxy;
};
