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
    const resp = await fetch(url, opt)
    if (resp.status === 201) {
      return resp.json()
    }
  }

  async updateInfo (payload) {
    const { userId, canHelp, needHelp, extraInfo } = payload
    const url = `${API_HOST}/users/${userId}`
    const opt = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ canHelp, needHelp, extraInfo })
    }
    const resp = await fetch(url, opt)
    return resp.status === 204
  }

  async isValidUser (payload) {
    const { username } = payload
    const url = `${API_HOST}/users/valid?userId=${username}`
    const resp = await fetch(url)
    const data = await resp.json()
    const { valid, code } = data
    return { valid, code }
  }

  async verify (payload) {
    const { username, code } = payload
    const url = `${API_HOST}/users/verifycode?userId=${username}&code=${code}`
    const resp = await fetch(url)
    const data = await resp.json()
    return data.verified
  }
}

export default new API()
