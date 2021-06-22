/*
    1) redux 库向外暴露下面几个函数
        createStore(): 接收的参数为reducer 函数, 返回为store 对象
        combineReducers(): 接收包含n 个reducer 方法的对象, 返回一个新的reducer 函数
        applyMiddleware() // 暂不实现
    2) store 对象的内部结构
        getState(): 返回值为内部保存的state 数据
        dispatch(): 参数为action 对象
        subscribe(): 参数为监听内部state 更新的回调函数
*/

//根据指定的reducer函数创建一个store对象
export function createStore(reducer){
    //用来存储内部状态数据的变量，初始值为调用reducer函数返回的结果（外部指定的默认值）
    let state = reducer(undefined, {type:'@@redux/init'})
    //用来存储监听state更新回调函数的数组容器
    const listeners = []

    //返回当前内部的state数据
    function getState() {
        return state;
    }

    //分发action，触发reducer调用，产生新的state
    //1.触发reducer调用，得到新的state
    //2.保存新的state
    //3.调用所有缓存的监视回调
    function dispatch(action) {
        //1.触发reducer调用，得到新的state
        const newState = reducer(state, action);
        //2.保存新的state
        state = newState;
        //3.调用所有缓存的监视回调
        listeners.forEach(listener => listener())
    }

    //绑定内部state变化的监听回调,可以给一个store绑定多个监听
    function subscribe(listener) {
        //保存到缓存listener的容器数组中
        listeners.push(listener)
    }

    //返回store对象，包括三个方法
    return {
        getState,
        dispatch,
        subscribe
    }
}

//整合传入参数对象中的多个reducer函数，返回一个新的reducer函数
/*
    {
        count: count(state.count, action)
        user: count(state.user, action)
    }
*/
export function combineReducers(reducers) {
    // 返回一个新的reducer 函数
    // 函数接收的是总的state 和指定的action
    return (state = {}, action) => {
        // 遍历调用所有的reducer, 并得到其返回的新状态值, 并封装成对象作为总的新state 对象
        // ['count','user']
        const newState = Object.keys(reducers).reduce((preState, key) => {
            preState[key] = reducers[key](state[key], action)
            return preState
        }, {})
        // 返回新的状态对象
        return newState
    }
}
