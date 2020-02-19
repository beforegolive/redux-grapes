/**
 * @param {(on: (actionCreator, handler, errorHandler) => void) => void} func
 * @param initialState
 */
export declare const createReducers: (func: Function, initialState: Object) => any;
