// This is a helper based on "redux-actions",
// we don't need to use "switch" syntax and are able to intercept reducer with this helper.
// open to discussion and enhancement all the time.
import { handleActions } from 'redux-actions'

/**
 * @param {(on: (actionCreator, handler, errorHandler) => void) => void} func
 * @param initialState
 */
export const createReducers = (func: Function, initialState: Object): any => {
  const handlersObj: any = {}
  const on = (actionCreator, handler, errorHandler) => {
    const actionType = actionCreator && actionCreator.toString()
    handlersObj[actionType] = {
      next: handler,
      throw: errorHandler
    }
  }

  func(on)

  return handleActions(handlersObj, initialState)
}
