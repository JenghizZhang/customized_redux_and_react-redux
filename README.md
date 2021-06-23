# 自定义简单版redux和react-redux相关库
## src下的lib为自定义的库，其他的为此库的应用显示

## 1. redux理解
	什么?: redux是专门做状态管理的独立第3方库, 不是react插件, 但一般都用在react项目中
	作用?: 对应用中状态进行集中式的管理(写/读)
	开发: 与react-redux, redux-thunk等插件配合使用

## 2. redux相关API
	redux中包含: createStore(), applyMiddleware(), combineReducers()
	store对象: getState(), dispatch(), subscribe()
	react-redux: 
		<Provider store={store}>: 向所有的容器组件提供store
		connect(
			state => ({xxx: state.xxx}),
			{actionCreator1, actionCreator2}
		)(UI组件): 
			产生的就是容器组件, 负责向UI组件传递标签属性, 
			一般属性值从state中获取, 函数属性内部会执行dispatch分发action

## 3. redux核心概念(3个)
	action: 
		默认是对象(同步action), {type: 'xxx', data: value}, 需要通过对应的actionCreator产生, 
		它的值也可以是函数(异步action), 需要引入redux-thunk才可以
	reducer
		根据老的state和指定的action, 返回一个新的state
		不能修改老的state
	store
		redux最核心的管理对象
		内部管理着: state和reducer
		提供方法: getState(), dispatch(action), subscribe(listener)
        
## 4. 自定义redux库
    1). redux库向外暴露下面几个函数
        createStore(): 接收的参数为reducer函数, 返回为store对象
        combineReducers(): 接收包含n个reducer方法的对象, 返回一个新的reducer函数
        applyMiddleware() // 暂不实现
    
    2). store对象的内部结构
        getState(): 返回值为内部保存的state数据
        dispatch(): 参数为action对象
        subscribe(): 参数为监听内部state更新的回调函数
    
    3). combineReducers函数:
        返回的总reducer函数内部会根据总的state和指定的action, 
        调用每个reducer函数得到对应的新的state, 并封装成一个新的总state对象返回

## 5. 自定义react-redux库
    1). react-redux向外暴露了2个API
        a. Provider组件类
        b. connect函数
    
    2). Provider组件
        接收store属性
        通过context将store暴露给所有的容器子组件
        Provider原样渲染其所有标签子节点
        
    3). connect函数
        接收2个参数: mapStateToProps和mapDispatchToProps
        connect()执行的返回值为一个高阶组件: 包装UI组件, 返回一个新的容器组件
        mapStateToProps: 
            为一个函数, 返回包含n个一般属性对象, 
            容器组件中调用得到对象后, 初始化为容器组件的初始状态, 并指定为UI组件标签的一般属性
        mapDispatchToProps:
            如果为函数, 调用得到包含n个dispatch方法的对象
            如果为对象, 遍历封装成包含n个dispatch方法的对象
            将包含n个dispatch方法的对象分别作为函数属性传入UI组件
        通过store绑定state变化的监听, 在回调函数中根据store中最新的state数据更新容器组件状态, 从而更新UI组件