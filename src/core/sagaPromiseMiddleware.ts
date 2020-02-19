// referr to https://github.com/redux-saga/redux-saga/issues/697
const createExposedPromise = () => {
  const deferred = {}

  // $FlowFixMe
  const promise = new Promise((resolve, reject) => {
    // @ts-ignore
    deferred.resolve = resolve
    // @ts-ignore
    deferred.reject = reject
  })

  return [promise, deferred]
}

// For create our own redux middleware, refer to https://redux.js.org/advanced/middleware
// $FlowFixMe
export default () => next => action => {
  // Skip actions that don't end with "Saga"
  if (!action.type.endsWith('Saga')) {
    return next(action)
  }

  const [promise, deferred] = createExposedPromise()
  const newActions = { ...action, deferred }

  next(newActions)
  return promise
}
