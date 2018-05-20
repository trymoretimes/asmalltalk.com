const fetch = require('node-fetch')

class API {
  constructor (config = {}) {
    this.base = config.API_URL || 'https://asmalltalk.com/v1/api'
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
    console.log(url)
    if (resp.status !== 200) {
      throw new Error(`fetch users failure: ${resp.statusText}`)
    }
    return resp.json()
  }

  async fetchUser (id) {
    const url = `${this.base}/users/${id}`
    console.log(url)
    const resp = await fetch(url)
    if (resp.status !== 200) {
      throw new Error(`fetch match guys failed: ${resp.statusText}`)
    }
    return resp.json()
  }

  async getUserMatcher (id) {
    const user = await this.fetchUser(id)
    // TODO hot fix --- to clean soon
    return user.matchGuys || []
  }

  async updateUser (id, obj) {
    const url = `${this.base}/users/${id}`
    const opt = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
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

  async updateMailed (hostId, mailedId) {
    const user = await this.fetchUser(hostId)
    const emaileds = user.emailed || []
    if (emaileds.indexOf(mailedId) === -1) {
      emaileds.push(mailedId)
    }

    const now = (new Date()).getTime()
    await this.updateUser(hostId, {
      emailed: emaileds,
      lastEmailAt: now
    })
  }
}

module.exports = API
