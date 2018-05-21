const { JSDOM } = require('jsdom')
const fetch = require('node-fetch')

const { delay } = require('./utils')
const API = require('./api')

const CHECK_INTERVAL = 1 * 3600 * 1000

class JobInfoUpdator {
  constructor (config = {}) {
    this.api = new API(config)
    this.CHECK_INTERVAL = config.CHECK_INTERVAL || CHECK_INTERVAL

    this.stopped = false
  }

  async start () {
    this.stopped = false

    while (!this.stopped) {
      try {
        await this.run()
        await delay(this.CHECK_INTERVAL || CHECK_INTERVAL)
      } catch (e) {
        console.log(e)
      }
    }
  }

  stop () {
    this.stopped = true
  }

  async run () {
    const users = await this.api.fetchUsers()
    for (const user of users) {
      const { id, username, site } = user
      const profile = await this.api.fetchProfile(username, site)
      this.api.update(id, {
        extra: JSON.stringify({ profile })
      })
    }
  }

}

module.exports = JobInfoUpdator
