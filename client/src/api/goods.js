import request from '@/utils/request'

export function getGoodsList (param) {
  return request({
    url: `/goods/list`,
    method: 'get',
    params: param
  })
}
export function addCart(data) {
  return request({
    url: `/goods/addCart`,
    method: 'post',
    data
  })
}
