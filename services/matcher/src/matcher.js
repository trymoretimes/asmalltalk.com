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

          if (target._id !== source._id) {
            const matchGuys = await this.api.getUserMatcher(source._id) || []
            if (matchGuys.indexOf(target._id) === -1) {
              const score = this.calculate(source, target)
              if (score > maxScore) {
                maxScore = score
                matchGuy = target
              }
            }
          }
        }
        if (matchGuy) {
          await this.api.updateUserMatchGuys(source._id, matchGuy._id)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  calculate (source, target) {
    return lcsSubStr(source.needHelp || '', target.canHelp || '')
  }
}

module.exports = Matcher
