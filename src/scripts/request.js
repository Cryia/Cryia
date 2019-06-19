import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/scripts/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 50000
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token || getToken()) {
      // 让每个请求携带token
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    // 更新token
    if (response.headers.authorization) {
      const token = response.headers.authorization
      const currentToken = store.getters.token
      if (token !== currentToken) {
        store.commit('SET_TOKEN', token)
        setToken(token)
      }
    }

    if (response.data.code !== 0) {
      Message({
        message: response.data.msg || response.data.message,
        type: 'error',
        duration: 5 * 1000
      })

      // return Promise.reject(new Error('error'))
    } else {
      return response.data
    }
  },
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      const statusCode = error.response.status

      if (statusCode === 401) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        }).catch(() => {
        })
      }
      console.log('response error, statusCode: ', error.response.data)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log('error.request')
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log(error.config)
      console.log('error message')
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }

    // return Promise.reject(error)
  }
)

export default service
