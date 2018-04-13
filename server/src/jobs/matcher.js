const { lcsSubStr } = require('../utils')

const CHECK_INTERVAL = 5 * 60 * 1000

class Matcher {
  constructor (dal) {
    this.dal = dal

    this.checkInterval = null
  }

  async start () {
    if (this.checkInterval === null) {
      this.checkInterval = setInterval(async () => {
        await this.run()
      }, CHECK_INTERVAL)
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
  }

  async run () {
    const users = await this.dal.find()

    for (let i = 0; i < users.length; i++) {
      const source = users[i]
      let matchGuy = null
      let maxScore = 0
      for (let j = i + 1; j < users.length; j++) {
        const target = users[j]
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
        this.update(source, matchGuy)
      }
    }
  }

  calculate (a, b) {
    const score1 = lcsSubStr(a.canHelp || '', b.needHelp || '')
    const score2 = lcsSubStr(a.needHelp || '', b.canHelp || '')
    return score1 + score2
  }

  update (host, matcher) {
    this.dal.updateMatchGuys(host._id, matcher._id)
  }
}

module.exports = (dal) => {
  return new Matcher(dal)
}
