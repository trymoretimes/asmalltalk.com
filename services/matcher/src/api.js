const fetch = require('node-fetch')

class API {
  constructor (config = {}) {
    this.base = config.API_URL
  }

  async createUser (obj) {
    const url = `${this.base}/users`
    const opt = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj)
    }
    const resp = await fetch(url, opt)
    if (resp.status !== 201) {
      throw new Error(`create user exception: ${resp.status}`)
    }
    return resp.json()
  }

  async fetchUsers () {
    const url = `${this.base}/users`
    const resp = await fetch(url)
    if (resp.status !== 200) {
      throw new Error(`fetch users failure: ${resp}`)
    }
    return resp.json()
  }

  async fetchUser (id) {
    const url = `${this.base}/users/${id}`
    const resp = await fetch(url)
    if (resp.status !== 200) {
      throw new Error(`fetch match guys failed: ${resp.statusText}`)
    }
    return resp.json()
  }

  async update (id, match) {
    const url = `${this.base}/users/${id}`
    const opt = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ match: match })
    }
    const resp = await fetch(url, opt)
    if (resp.status !== 200) {
      throw new Error(`update user failed: ${resp.statusText}`)
    }
  }
}

module.exports = API
