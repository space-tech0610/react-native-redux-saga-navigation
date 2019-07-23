// @flow
import axios from 'axios'
import url from 'url'
import { merge as _merge } from 'lodash'
import _ from 'lodash'

function baseAxios(options) {
  const base64 = require('base-64');
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'apikey': 'd3b74bd5-8fc5-4953-aa6a-1be333cd6e0b',
    'Authorization': 'Basic' + base64.encode("react:native")
  }
  // let headers = new Headers()
  // headers.append('Content-Type', 'application/json')
  // headers.append('apiKey', 'd3b74bd5-8fc5-4953-aa6a-1be333cd6e0b')
  // defaultHeaders.append('Authorization', 'Basic' + base64.encode("react:native"))
  return axios.create({
    baseURL: url.format('https://community-staging.pollenstores.co/interview/api/communities/all'),
    timeout: options.timeout || 30000,
    headers: defaultHeaders,
  })
}

function executeRequest(method, pathname, data, options = {}) {
  const body = method === 'get' || !data ? {} : { data }
  const reqObj = { method, url: pathname, params: options.query, ...body }

  const baseAxiosRequest = baseAxios(options)
  return new Promise((resolve, reject) => {
    return baseAxiosRequest
      .request(reqObj)
      .then(res => {
        resolve(res.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export default {
  get(pathname, options) {
    return executeRequest('get', pathname, null, options)
  },

  post(pathname, data, options) {
    return executeRequest('post', pathname, data, options)
  },

  put(pathname, data, options) {
    return executeRequest('put', pathname, data, options)
  },

  delete(pathname, data, options) {
    return executeRequest('delete', pathname, data, options)
  },

  all(promises) {
    return axios.all(promises)
  },
}
