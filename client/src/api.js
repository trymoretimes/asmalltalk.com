import fetch from 'isomorphic-fetch'
import { API_HOST } from '../config'

class API {
  async query (id) {
    const url = `${API_HOST}/users/${id}`
    const resp = await fetch(url)
    return resp.json()
  }

  async submit (payload) {
    const url = `${API_HOST}/users`
    const opt = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
    const resp = await fetch(url, opt)
    return resp.json()
  }

  async updateInfo (payload) {
    const { id, story } = payload
    const url = `${API_HOST}/users/${id}`
    const opt = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ story })
    }
    const resp = await fetch(url, opt)
    return resp.status === 204
  }

  async isValidUser (payload) {
    const { username, site } = payload
    const url = `${API_HOST}/users/valid?username=${username}&site=${site}`
    const resp = await fetch(url)
    const data = await resp.json()
    // TODO fix this
    return true
  }

  async isGithubUser (payload) {
    const { username } = payload
    const url = `https://api.github.com/users/${username}`
    let valid = true
    try {
      const resp = await fetch(url)
      const data = await resp.json()
      valid = !(data.message === 'Not Found')
    } catch (e) {
      // TODO put log into log system
      console.warn(e)
      valid = false
    }
    return valid
  }

  async isV2exUser (payload) {
    const { username } = payload
    const url = `${API_HOST}/auth/v2ex/user?username=${username}`
    let valid = true
    try {
      const resp = await fetch(url)
      const data = await resp.json()
      valid = !(data.status === 'notfound')
    } catch (e) {
      // TODO put log into log system
      console.warn(e)
      valid = false
    }
    return valid
  }

  async getUserProfile (payload) {
    const { username } = payload
    const url = `${API_HOST}/users/valid?username=${username}`
    const resp = await fetch(url)
    return resp.json()
  }

  async getCode (payload) {
    const { username, email, site } = payload
    const opt = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        email,
        site
      })
    }
    const url = `${API_HOST}/auth/codes`
    const resp = await fetch(url, opt)
    return resp.json()
  }

  async verify (payload) {
    const { username, code, site } = payload
    const url = `${API_HOST}/auth?username=${username}&code=${code}&site=${site}`
    const resp = await fetch(url)
    const data = await resp.json()
    return data.ok
  }
}

export default new API()
