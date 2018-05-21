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
      throw new Error(`fetch users failure: ${resp.statusText}`)
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

  async update (id, obj) {
    const url = `${this.base}/users/${id}`
    const opt = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    }
    const resp = await fetch(url, opt)
    if (resp.status !== 200) {
      throw new Error(`update user failed: ${resp.statusText}`)
    }
  }

  async fetchProfile(username, site) {
    const apis = {
      v2ex: `https://www.v2ex.com/api/members/show.json?username=${username}`,
      github: `https://api.github.com/users/${username}`
    }
    const url = apis[site]
    if (url) {
      const resp = await fetch(url)
      if (resp.status === 200) {
        return resp.json()
      }
    }
    return {}
  }
}

module.exports = API
