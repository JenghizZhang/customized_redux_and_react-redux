# 自定义简单版redux和react-redux相关库
## src下的lib为自定义的库，其他的为此库的应用显示

## 1. 在项目中搭建redux整套环境
    1). store.js
    2). reducer.js
    3). actions.js
    4). action-types.js
    5). index.js
    6). 在需要与redux进行状态数据通信(读/写)的UI组件包装生成容器组件

## 2. 通过redux管理头部标题headTitle数据
    1). action-types.js
    2). actoins.js
    3). reducer.js
    4). 相关组件: 
        left-nav.js
        header.js
        
## 3. 通过redux管理登陆用户信息user数据
    1). action-types.js
    2). actoin.js
    3). reducer.js
    4). 相关组件: 
        login.js
        admin.js
        left-nav.js
        header.js
        role.js

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