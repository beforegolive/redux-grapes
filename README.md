# redux-saga-promise-action

### 创建actions。
创建3个action分别为actionIdTest，actionNoParamTest，actionTestSaga，其中第一个action包含参数id。
所有的action的type都包含前缀PREFIX。

```
import { createActions } from 'redux-saga-promise-action'

export default createActions({
  actionIdTest: id => ({ id }),
  actionNoParamTest:()=>({}),
  actionTestSaga: () => ({}),
}, 'PREFIX')

```


### 创建reducers。
创建reducer处理对应的action，此例中为处理actionIdTest：

import { createReducers } from 'redux-saga-action'
import appActions from '../actions/appActions'

const initialState = {
  testId: '',
  testName: ''
}

export default createReducers(on => {
  on(appActions.actionIdTest, (state, action) => {
    const { id } = action.payload
    return {
      ...state,
      testId: id
    }
  })
}, initialState)
```

### 创建对应的saga

创建saga来处理saga后缀的action (actionTestSaga)

```
mport { SagaIterator } from 'redux-saga'
import { takeLatest, put } from 'redux-saga/effects'
import appActions from '../actions/appActions'

export function* actionTest1(): SagaIterator {
  yield takeLatest(appActions.actionTestSaga, function*(action: SagaAction) {
    const { deferred } = action
    yield put(appActions.actionIdTest('id-demo'))
    yield put(appActions.actionNameTest('name-demo'))
    deferred.resolve()
  })
}
```


### 配置redux中间件

配置对应中间件将action转换为promise的中间件。

```
import createSagaMiddleware from 'redux-saga'
import { sagaPromiseMiddleware } from 'redux-saga-promise-action'

……

const middlewares = [
  sagaPromiseMiddleware,
  sagaMiddleWare
]

const store = createStore(rootReducer, applyMiddleware(...middlewares))

……

```



