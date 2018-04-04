import fetch from 'isomorphic-fetch'
import { API_HOST } from '../config'

class API {
  async query (uri) {
    const url = `${API_HOST}/comments?uri=${encodeURIComponent(uri)}`
    return fetch(url)
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
    return fetch(url, opt)
  }

  async isValidUser (payload) {
    const { username } = payload
    const url = `${API_HOST}/users/valid?userId=${username}`
    const resp = await fetch(url)
    const data = await resp.json()
    return data.valid
  }

  async getCode (username) {
    // TODO get code from backend
    return Math.random()
  }
}

export default new API()
