const { lcsSubStr } = require('../utils')

const CHECK_INTERVAL = 1 * 3600 * 1000

class Matcher {
  constructor (dal, config = {}) {
    this.dal = dal
    this.config = config

    this.checkInterval = null
    this.stopped = true
  }

  async start () {
    this.stopped = false

    if (this.checkInterval === null) {
      this.checkInterval = setInterval(async () => {
        await this.run()
      }, this.config.CHECK_INTERVAL || CHECK_INTERVAL)
    }
  }

  stop () {
    if (this.checkInterval !== null) {
      try {
        clearInterval(this.checkInterval)
      } catch (e) {
        console.warn('err stop timeout checker', e)
      }
    }
    this.checkInterval = null

    this.stopped = true
  }

  async run () {
    const users = await this.dal.find()

    for (let i = 0; i < users.length; i++) {
      const source = users[i]
      let matchGuy = null
      let maxScore = -1
      for (let j = 0; j < users.length; j++) {
        const target = users[j]

        if (target._id.toString() !== source._id.toString()) {
          const matchGuys = await this.dal.fetchMatchGuys(source._id)
          if (matchGuys.indexOf(target._id) === -1) {
            const score = this.calculate(source, target)
            if (score > maxScore) {
              maxScore = score
              matchGuy = target
            }
          }
        }
        if (matchGuy) {
          await this.update(source, matchGuy)
        }
      }
    }
  }

  calculate (a, b) {
    const score1 = lcsSubStr(a.canHelp || '', b.needHelp || '')
    const score2 = lcsSubStr(a.needHelp || '', b.canHelp || '')
    return score1 + score2
  }

  async update (host, matcher) {
    await this.dal.updateMatchGuys(host._id.toString(), matcher._id.toString())
  }
}

module.exports = (dal, config) => {
  return new Matcher(dal, config)
}
