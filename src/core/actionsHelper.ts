import { createAction } from 'redux-actions'
// import _ from 'lodash'

// const actionMap = {}

export const createActions = <T extends { [key: string]: Function }>(
  obj,
  prefix = ''
) => {
  // const objProxy = {}
  const objProxy: {
    [K in Extract<keyof T, string>]: any
  } = {} as any
  Object.keys(obj).forEach(e => {
    const actionType = `${prefix}_${e}`

    // @ts-ignore
    objProxy[e] = createAction(actionType, obj[e].bind(objProxy))
    objProxy[e].toString = () => actionType
  })

  return objProxy
}
