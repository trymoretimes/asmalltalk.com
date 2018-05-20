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
      const { _id, username } = user
      const company = await this.getCompay(username)
      this.api.updateUser(_id, { company })
    }
  }

  async getCompay (username) {
    const url = `https://www.v2ex.com/member/${username}`
    let company = null
    try {
      const dom = await JSDOM.fromURL(url)
      const val = dom.window.document.querySelectorAll('.box .cell table td span')[1].textContent || ''
      if (val.length < 30) {
        company = val
      }
    } catch (e) {
      console.log(`could get compay of ${username}: ${e}`)
    }

    return company
  }
}

module.exports = JobInfoUpdator
