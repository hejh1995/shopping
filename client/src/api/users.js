import request from '@/utils/request'

export function checkLogin() {
  return request({
    url: '/users/checkLogin',
    method: 'get'
  })
}
export function cofLogin(data) {
  return request({
    url: `/users/cofLogin`,
    method: 'post',
    data
  })
}
export function getCartCount() {
  return request({
    url: '/users/getCartCount',
    method: 'get'
  })
}
export function logout() {
  return request({
    url: '/users/logout',
    method: 'post'
  })
}
export function cartList() {
  return request({
    url: '/users/cartList',
    method: 'get'
  })
}
export function cartEdit(data) {
  return request({
    url: '/users/cartEdit',
    method: 'post',
    data
  })
}
export function checkedAll(data) {
  return request({
    url: '/users/checkedAll',
    method: 'post',
    data
  })
}
export function cartDel(data) {
  return request({
    url: '/users/cartDel',
    method: 'post',
    data
  })
}
export function addressList() {
  return request({
    url: '/users/addressList',
    method: 'get'
  })
}
export function setDefault(data) {
  return request({
    url: '/users/setDefault',
    method: 'post',
    data
  })
}
export function payMent(data) {
  return request({
    url: '/users/payMent',
    method: 'post',
    data
  })
}
export function delAddress(data) {
  return request({
    url: '/users/delAddress',
    method: 'post',
    data
  })
}
