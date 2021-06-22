/*
reducer函数模块: 根据当前state和指定action返回一个新的state
 */
import {INCREMENT, DECREMENT} from './action-types'
import { combineReducers } from '../lib/redux'

//管理count状态数据的reducer
export default function count(state=1, action) {
  console.log('reducer', state, action)
  switch (action.type) {
    case INCREMENT:
      return state + action.data
    case DECREMENT:
      return state - action.data
    default:
      return state
  }
}

//管理用户信息的reducer函数
function user(state = {}, action) {
  switch (action.type) {
    default:
      return state;
  }
}
combineReducers({ count, user })
