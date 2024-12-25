import qs from 'qs'
import _ from '../assets/utils'
//二次封装fetch
const isPlainObject = function isPlainObject(obj) {
  const hasOwn = {}.hasOwnProperty
  let proto, Ctor
  if (!obj || toString.call(obj) !== '[object Object]') return false
  proto = Object.getPrototypeOf(obj)
  if (!proto) return true
  Ctor = hasOwn.call(proto, 'constructor') && proto.constructor
  return typeof Ctor === 'function' && Ctor === Object
}

const baseURL = '/api'

const http = (config) => {
  if (!isPlainObject(config)) {
    config = {}
  }
  let baseConfig = {
    url: '',
    method: 'GET',
    credentials: 'include',
    body: null,
    params: null,
    responseType: 'json',
    signal: null,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  config = Object.assign(baseConfig, config)
  if (!config.url) {
    throw new TypeError('url must be a string')
  }
  if (config.params !== null && !isPlainObject(config.params)) config.params = null
  let { url, method, credentials, headers, body, params, responseType, signal } = config
  url = baseURL + url
  // params 问号传参
  if (params) {
    url += (url.includes('?') ? '&' : '?') + qs.stringify(params)
  }
  // 处理请求主体，根据后端服务的要求，设置其格式 (以下为 urlencoded 格式请求体）
  if (isPlainObject(body)) {
    body = qs.stringify(body)
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }

  // 类似 axios 的 interceptors ，设置请求拦截器
  const token = _.storage.get('tk'),
    safeList = ['/user_info', '/store', '/store_list', '/store_remove', '/user_update']
  if (token) {
    let reg = /\/api(\/[^?#]+)/,
      [, $1] = reg.exec(url) || []
    let isSafe = safeList.some((item) => {
      return $1 === item
    })
    if (isSafe) headers['authorization'] = token
  }
  //send
  method = method.toUpperCase()
  config = {
    method,
    credentials,
    headers,
    signal,
    cache: 'no-cache'
  }

  if (/^(POST|PUT|PATCH)$/i.test(method) && body) {
    config.body = body
  }
  return fetch(url, config)
    .then((response) => {
      const { status, statusText } = response
      if (/^(2|3)\d{2}$/.test(status)) {
        // 根据预设返回类型设置返回值
        let result
        switch (responseType) {
          case 'json':
            result = response.json()
            break
          case 'text':
            result = response.text()
            break
          case 'arraybuffer':
            result = response.arrayBuffer()
            break
          case 'blob':
            result = response.blob()
            break
          default:
            result = response.json()
        }
        return result
      }
      return Promise.reject({
        code: -1,
        status,
        statusText
      })
    })
    .catch((reason) => {
      // 失败的统一处理
      if (reason && typeof reason === 'object') {
        let { code, status } = reason
        if (code === -1) {
          switch (+status) {
            case 400:
              // 参数错误
              break
          }
        } else if (code === 20) {
          // 请求中断
        } else {
          //
        }
      } else {
        //
      }
      return Promise.reject(reason) // 统一处理提示后，组件中依然还是失败
    })
}

const baseMethod = ['GET', 'HEAD', 'OPTIONS', 'DELETE']
baseMethod.forEach((method) => {
  http[method.toLowerCase()] = (url, config) => {
    if (!isPlainObject(config)) {
      config = {}
    }
    config['url'] = url
    config['method'] = method
    return http(config)
  }
})

const highMethod = ['POST', 'PUT', 'PATCH']
highMethod.forEach((method) => {
  http[method.toLowerCase()] = (url, data, config) => {
    if (!isPlainObject(config)) {
      config = {}
    }
    config['url'] = url
    config['method'] = method
    config['body'] = data
    return http(config)
  }
})

export default http
