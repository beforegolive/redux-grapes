import { isInLocal } from '../utils'

type PromiseHandler = {
  resolve?: ()=>void,
  reject?: ()=>void
}

const initAppFinishedPromiseHandler: PromiseHandler = {}
const initAppFinishedPromise = new Promise((resolve, reject) => {
	initAppFinishedPromiseHandler.resolve = resolve
	initAppFinishedPromiseHandler.reject = reject
})

const initFirstActionsFinishedPromiseHandler: PromiseHandler = {}
// 用于hold住其他saga，等待initSagasWhenAppStarted中优先级最高的saga列表执行完毕
const initFirstActionsFinishedPromise = new Promise((resolve, reject) => {
	initFirstActionsFinishedPromiseHandler.resolve = resolve
	initFirstActionsFinishedPromiseHandler.reject = reject
})

const initSecondActionsFinishedPromiseHandler: PromiseHandler = {}
// 用于hold住非saga优先级列表的其他saga，执行优先级低于initSagasWhenAppStarted中firstSaga列表，高于其他saga
const initSecondActionsFinishedPromise = new Promise((resolve, reject) => {
	initSecondActionsFinishedPromiseHandler.resolve = resolve
	initSecondActionsFinishedPromiseHandler.reject = reject
})

const initThirdActionsFinishedPromiseHandler: PromiseHandler = {}
// 优先级低于第一和第二，但高于其他saga
// 当前项目中需要第三优先级saga的业务场景：用户之间跳到优惠券列表页。
// 1. 先获取openId和unionId
// 2. 获取authToken
// 3. 获取G2 member信息
// 然后再请求其他saga
const initThirdActionsFinishedPromise = new Promise((resolve, reject) => {
	initThirdActionsFinishedPromiseHandler.resolve = resolve
	initThirdActionsFinishedPromiseHandler.reject = reject
})

let firstActionArr = []
let secondActionArr = []
let thirdActionArr = []

let isHandlerLocked = false

async function handlePreInitActions(dispath) {
	const firstLevelPromisedActions = firstActionArr.map(item => dispath(item))
	await Promise.all(firstLevelPromisedActions)

	initFirstActionsFinishedPromiseHandler.resolve()

	const secondLevelPromisedActions = secondActionArr.map(item => dispath(item))
	await Promise.all(secondLevelPromisedActions)
	initSecondActionsFinishedPromiseHandler.resolve()

	const thirdLevelPromiseActions = thirdActionArr.map(item => dispath(item))
	await Promise.all(thirdLevelPromiseActions)
	initThirdActionsFinishedPromiseHandler.resolve()
}

/**
 * 初始化应用时要执行的saga，其他saga会等到此函数内的saga执行完毕后再执行。
 *
 * @export
 * @param {object|array} firstActions Object或Array，最先执行的saga列表，优先级最高，早于其他所有saga执行。
 * @param {object|array} [secondActions=[]] Object或Array，选填. 优先级低于参数1，但高于其他saga
 * @param {*} [thirdActions=[]] Object或Array，选填. 优先级低于参数1和2，但高于其他saga
 */
export function initSagasWhenAppStarted(firstActions, secondActions = [], thirdActions = []) {
	const tempFirstActionArr = Array.isArray(firstActions) ? firstActions : [firstActions]
	const tempSecondActionArr = Array.isArray(secondActions) ? secondActions : [secondActions]
	const tempThirdActionArr = Array.isArray(thirdActions) ? thirdActions : [thirdActions]

	firstActionArr = firstActionArr.concat(tempFirstActionArr)
	secondActionArr = secondActionArr.concat(tempSecondActionArr)
	thirdActionArr = thirdActionArr.concat(tempThirdActionArr)
	initAppFinishedPromiseHandler.resolve()
	console.warn('** initalizerMiddleware.initSagasWhenAppStarted执行完毕 **')
}

if (isInLocal()) {
	console.warn('*** 初始化时记得执行initSagasWhenAppStarted方法, 保证部分saga在应用初始化时优先执行 ***')
}

export default ({ dispatch }) => next => async action => {
	// 如果是跟saga无关的action则跳过，不会被block住
	if (!action.type.endsWith('Saga')) {
		return next(action)
	}

	await initAppFinishedPromise

	if (!isHandlerLocked) {
		isHandlerLocked = true
		await handlePreInitActions(dispatch)
	}

	if (!firstActionArr.some(item => item.type === action.type)) {
		await initFirstActionsFinishedPromise
	}

	if (
		!firstActionArr.some(item => item.type === action.type) &&
		!secondActionArr.some(item => item.type === action.type)
	) {
		await initSecondActionsFinishedPromise
	}

	if (
		!firstActionArr.some(item => item.type === action.type) &&
		!secondActionArr.some(item => item.type === action.type) &&
		!thirdActionArr.some(item => item.type === action.type)
	) {
		await initThirdActionsFinishedPromise
	}

	next(action)
}
