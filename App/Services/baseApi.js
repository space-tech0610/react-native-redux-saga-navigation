// @flow
import axios from 'axios'
import url from 'url'
import { merge as _merge } from 'lodash'
import _ from 'lodash'

function baseAxios(options) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  return axios.get('https://community-staging.pollenstores.co/interview/api/communities/all', {
    headers: {
      apikey: "d3b74bd5-8fc5-4953-aa6a-1be333cd6e0b"
    },
    auth: {
      username: "react",
      password: "native"
    }
  })
}

function executeRequest(method, pathname, data, options = {}) {
  const body = method === 'get' || !data ? {} : { data }
  const reqObj = { method, url: pathname, params: options.query, ...body }

  const baseAxiosRequest = baseAxios(options)
  return new Promise((resolve, reject) => {
    return baseAxiosRequest
      // .request(reqObj)
      .then(res => {
        console.log("res.data")
        console.log(res.data)
        resolve(res.data)
      })
      .catch(error => {
        console.log("error1111111111111111",error)
        reject(error)
      })
  })
}

export default {
  get(pathname, options) {
    console.log(pathname, options)
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
