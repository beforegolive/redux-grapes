import { createAction } from 'redux-actions'
import { isFunction } from '../utils/index'

const actionMap = {}

export const createActions = <T extends { [key: string]: Function, }>(
  obj: T,
  prefix: string = ''
) => {
  const objProxy: {
    [K in Extract<keyof T, string>]: any
  } = {} as any
  Object.keys(obj).forEach(e => {
    if (isFunction(obj[e])) {
      if (actionMap.hasOwnProperty(e)) {
        throw new Error(`action - '${e}' is duplicated`)
      } else {
        // 0表示action存在，但尚未和任何reducer关联。
        actionMap[e] = 0
      }

      const actionType = `${prefix}_${e}`

      // @ts-ignore
      objProxy[e] = createAction(actionType, obj[e].bind(objProxy))
      objProxy[e].toString = () => actionType
    }
  })

  // const objProxyWrapper = originalObj => {
  //   return new Proxy(originalObj, {
  //     get(target, property) {
  //       const val = target[property]
  //       if (val === undefined) {
  //         throw new Error(`the action '${property}' is not defined`)
  //       }
  //
  //       // 1表示action存在，并且已有对应reducer处理
  //       actionMap[property] = 1
  //       return val
  //     },
  //   })
  // }

  // 某些环境下Proxy不存在，比如IE浏览器和React Native运行环境。
  // if (typeof Proxy === 'function') {
  //   return objProxyWrapper(objProxy)
  // }

  return objProxy
}

// export const showActionsRefState = () => {
//   const unusedActions = []
//   Object.keys(actionMap).forEach(name => {
//     if (actionMap[name] !== 1) {
//       unusedActions.push(name)
//     }
//   })

//   if (unusedActions.length > 0) {
//     console.warn('currently, the unused actions are:', unusedActions)
//   }
// }
