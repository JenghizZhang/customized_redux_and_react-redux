//react-redux库的模块
/*
    1) react-redux 向外暴露了2 个API
        a. Provider 组件类
        b. connect 函数
    2) Provider 组件
        接收store 属性
        让所有容器组件都可以看到store, 从而通过store 读取/更新状态
    3) connect 函数
        接收2 个参数: mapStateToProps 和mapDispatchToProps
        mapStateToProps: 为一个函数, 用来指定向UI 组件传递哪些一般属性
        mapDispatchToProps: 为一个函数或对象, 用来指定向UI 组件传递哪些函数属性
        connect()执行的返回值为一个高阶组件: 包装UI 组件, 返回一个新的容器组件
        容器组件会向UI 传入前面指定的一般/函数类型属性
*/

import React, { Component } from 'react'
import PropTypes from 'prop-types'

//用来向所有容器组件提供store的组件类
//通过context向所有容器子组件提供store
export class Provider extends Component {
    static propTypes={
        store: PropTypes.object //声明接受store
    }

    //声明向后代组件传递的context中的数据
    static childContextTypes = {
        store: PropTypes.object
    }

    //向所有有声明的子组件提供包含要传递数据的context对象
    getChildContext() {
        return {
            store: this.props.store
        }
    }

    render() {
        //返回渲染<Provider>所有子节点
        return this.props.children
    }
}

//connect高阶函数：接受mapStateToProps和mapDispatchToProps
//connect()返回值是一个高阶组件函数，接收UI组件，返回容器组件
export function connect(mapStateToProps, mapDispatchToProps) {
    return (UIComponent) => {
        //返回容器组件
        return class ContainerComponent extends Component {

            //声明接收的context数据名称和类型
            static contextTypes={
                store: PropTypes.object
            }

            constructor(props,context){
                super(props);
                console.log('ContainerComponent constructor()', context.store);

                //得到store
                const { store } = context

                //得到包含所有一般属性的对象，调用mapStateToProps得到
                const stateProps = mapStateToProps(store.getState()); //{cont:1}
                //将所有一般属性作为容器组件的状态，后面变化，后面变化会更新
                this.state = { ...stateProps }

                let dispatchProps
                //判断mapDispatchToProps是否为函数
                if (typeof mapDispatchToProps === 'function'){
                    //得到包含所有函数属性的对象，调用mapDispatchToProps得到
                    dispatchProps = mapDispatchToProps(store.dispatch)
                } else {
                    //{ increment, decrement }=>{increment: (number) => dispatch(increment(number)), decrement: (number) => dispatch(decrement(number))}
                    dispatchProps = Object.keys(mapDispatchToProps).reduce((pre, key) => {
                        const actionCreator = mapDispatchToProps[key];
                        pre[key] = (...args) => store.dispatch(actionCreator(...args)); //参数后传
                        return pre;
                    }, {})
                }
              
                //保存到组件上
                this.dispatch = { ...dispatchProps }

                //绑定store的state变化的监听,发生变化就会重新更新
                store.subscribe(() => { //store内部状态数据发生了变化
                    //更新容器组件，从而导致UI组件更新
                    this.setState({...mapStateToProps(store.getState())})
                })
            }

            render(){
                //返回UI组件的标签
                return <UIComponent {...this.state} {...this.dispatch} />
            }
        }
    }
}
