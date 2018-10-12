import axios from 'axios'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 15000
})

// request拦截器，在请求发出之前做一些操作
// headers 自定义请求头部
service.interceptors.request.use(config => {
  // 让每个请求携带自定义token 请根据实际情况自行修改
  config.headers.Authorization = getToken()
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})
// response 拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response.status === 401) {
      console.log('请重新登录')
      // 更新store，logout
    }
    console.log(error)
    return Promise.reject(error)
  }
)
export default service
