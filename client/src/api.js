import fetch from 'isomorphic-fetch'
import { API_HOST } from '../config'

class API {
  async query(qs = {}) {
    const { username, email, id } = qs
    let qsString = '?'
    if (username) {
      qsString += `username=${username}&`
    }
    if (email) {
      qsString += `email=${email}&`
    }
    if (id) {
      qsString += `id=${id}&`
    }

    const url = `${API_HOST}/users${qsString}`
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
    const { id, canHelp, needHelp, extraInfo } = payload
    const url = `${API_HOST}/users/${id}`
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
    const { username, site } = payload
    const url = `${API_HOST}/users/valid?username=${username}&site=${site}`
    const resp = await fetch(url)
    const data = await resp.json()
    return data.valid
  }

  async getUserProfile (payload) {
    const { username } = payload
    const url = `${API_HOST}/users/valid?username=${username}`
    const resp = await fetch(url)
    return resp.json()
  }

  async getCode (payload) {
    const { username, email, site } = payload
    const url = `${API_HOST}/users/code?username=${username}&email=${email}&site=${site}`
    const resp = await fetch(url)
    return resp.json()
  }

  async verify (payload) {
    const { username, code, site } = payload
    const url = `${API_HOST}/users/verifycode?username=${username}&code=${code}&site=${site}`
    const resp = await fetch(url)
    const data = await resp.json()
    return data.verified
  }
}

export default new API()
