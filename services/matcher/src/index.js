const fetch = require('node-fetch')

const { lcsSubStr, delay } = require('./utils')

const CHECK_INTERVAL = 1 * 3600 * 1000

class Matcher {
  constructor (config = {}) {
    this.API_URL = config.API_URL || 'https://asmalltalk.com/v1/api'
    this.CHECK_INTERVAL = config.CHECK_INTERVAL || CHECK_INTERVAL

    this.checkInterval = null
    this.stopped = false
  }

  async start () {
    this.stopped = false

    while (!this.stopped) {
      try {
        await this.run()
        await delay(this.CHECK_INTERVAL)
      } catch (e) {
        console.info(e)
      }
    }
  }

  stop () {
    this.stopped = true
  }

  async fetchUsers () {
    const url = `${this.API_URL}/users`
    const resp = await fetch(url)
    if (resp.status !== 200) {
      throw new Error(`fetch users failure: ${resp}`)
    }
    return resp.json()
  }

  async fetchUser (id) {
    const url = `${this.API_URL}/users/${id}`
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
    const url = `${this.API_URL}/users/${id}`
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
    const { matchGuys } = user
    if (matchGuys.indexOf(matchGuyId) === -1) {
      matchGuys.push(matchGuyId)
    }

    await this.updateUser(hostId, { matchGuys })
  }

  async run () {
    const users = await this.fetchUsers()

    for (let i = 0; i < users.length; i++) {
      const source = users[i]
      let matchGuy = null
      let maxScore = -1
      for (let j = 0; j < users.length; j++) {
        const target = users[j]

        if (target._id.toString() !== source._id.toString()) {
          const matchGuys = await this.getUserMatcher(source._id)
          if (matchGuys.indexOf(target._id) === -1) {
            const score = this.calculate(source, target)
            if (score > maxScore) {
              maxScore = score
              matchGuy = target
            }
          }
        }
        if (matchGuy) {
          await this.updateUserMatchGuys(source._id.toString(), matchGuy._id.toString())
        }
      }
    }
  }

  calculate (a, b) {
    const score1 = lcsSubStr(a.canHelp || '', b.needHelp || '')
    const score2 = lcsSubStr(a.needHelp || '', b.canHelp || '')
    return score1 + score2
  }
}

module.exports = Matcher
