const API = require('./api')

const { lcsSubStr, delay } = require('./utils')

const CHECK_INTERVAL = 1 * 3600 * 1000

class Matcher {
  constructor (config = {}) {
    this.CHECK_INTERVAL = config.CHECK_INTERVAL || CHECK_INTERVAL

    this.checkInterval = null
    this.stopped = false
    this.api = new API(config)
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

  async run () {
    try {
      const users = await this.api.fetchUsers()

      for (let i = 0; i < users.length; i++) {
        const source = users[i]
        let matchGuy = null
        let maxScore = -1
        for (let j = 0; j < users.length; j++) {
          const target = users[j]

          if (target.id !== source.id) {
            const emailed = source.emailed || []
            if (emailed.indexOf(target.email) === -1) {
              const score = this.calculate(source, target)
              if (score > maxScore) {
                maxScore = score
                matchGuy = target
              }
            }
          }
        }
        if (matchGuy) {
          await this.api.update(source.id, matchGuy.email)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  calculate (source, target) {
    return lcsSubStr(source.story, target.story)
  }
}

module.exports = Matcher
