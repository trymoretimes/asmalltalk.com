const fetch = require('node-fetch')

class API {
  constructor (config = {}) {
    this.base = config.API_URL || 'https://asmalltalk.com/v1/api'
  }

  async fetchUsers () {
    const url = `${this.base}/users`
    console.log(url)
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

  async getUserMatcher (id) {
    const user = await this.fetchUser(id)
    return user.matchGuys
  }

  async updateUser (id, obj) {
    const url = `${this.base}/users/${id}`
    const opt = {
      method: 'PUT',
      contentType: 'application/json',
      body: JSON.stringify(obj)
    }
    const resp = await fetch(url, opt)
    if (resp.status !== 204) {
      throw new Error(`update user failed: ${resp.statusText}`)
    }
  }

  async updateUserMatchGuys (hostId, matchGuyId) {
    const user = await this.fetchUser(hostId)
    const matchGuys = user.matchGuys || []
    if (matchGuys.indexOf(matchGuyId) === -1) {
      matchGuys.push(matchGuyId)
    }

    await this.updateUser(hostId, { matchGuys })
  }
}

module.exports = API
