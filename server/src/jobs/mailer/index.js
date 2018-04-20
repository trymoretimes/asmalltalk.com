const mailer = require('../../sendgrid')
const buildBody = require('./builder')
const { delay } = require('../../utils')

const CHECK_INTERVAL = 1 * 3600 * 1000

class Mailer {
  constructor (dal, config = {}) {
    this.dal = dal
    this.config = config

    this.stopped = false
  }

  async start () {
    this.stopped = false

    while (!this.stopped) {
      await this.run()
      await delay(this.config.CHECK_INTERVAL || CHECK_INTERVAL)
    }
  }

  stop () {
    this.stopped = true
  }

  async run () {
    console.log('run mailer at', (new Date()))
    // matchee ---> matcher
    // we send matchee info to matcher
    const users = await this.dal.find()
    for (const matcher of users) {
      const matchGuys = matcher.matchGuys || []
      const mailed = matcher.emailed || []
      for (const guyId of matchGuys) {
        if (mailed.indexOf(guyId) === -1) {
          const matchee = await this.dal.fetch(guyId)
          await this.connect(matcher, matchee)
          break
        }
      }
    }
  }

  async connect (matcher, matchee) {
    try {
      await this.mail(matcher, matchee)
      await this.dal.updateMailed(matcher._id.toString(), matchee._id.toString())
    } catch (e) {
      console.error('Send email failed =====')
      console.error(e)
      console.error('=======================')
    }
  }

  updateMailed (matcher, matchee) {
    this.dal.updateMailed(matcher._id, matchee._id)
  }

  async mail (reciver, matcher) {
    const { text, html } = buildBody(reciver, matcher)
    const payload = {
      to: reciver.email,
      from: 'h.minghe@gmail.com', // TODO our platform email here
      replyTo: matcher.email,
      subject: `小对话：今天为你推荐 ${matcher.username}`,
      text,
      html
    }

    await mailer.send(payload)
    console.log(`mail send`)
  }
}

module.exports = (dal, config) => {
  return new Mailer(dal, config)
}
